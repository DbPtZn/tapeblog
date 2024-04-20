import { watchOnce } from '@vueuse/core'
import { Ref, onMounted, ref, watch } from 'vue'
// import { getProductConfig } from "./private/note.config"
import { Editor, createEditor } from '@textbus/editor'
import useStore from '@/store'
import { getProductConfig } from './product.config'
import { CustomThemeCommonVars, ThemeCommonVars } from 'naive-ui'
import { Starter } from '@textbus/core'
import { ConfigProvider, Player, ThemeProvider } from '@/editor'

export function useEditor(args: {
  id: string
  rootRef: Ref<HTMLElement>
  editorRef: Ref<HTMLElement>
  scrollerRef: Ref<HTMLElement>
  controllerRef: Ref<HTMLElement>
}) {
  const { id, rootRef, editorRef, scrollerRef, controllerRef } = args
  const { productStore } = useStore('manage')
  const { settingStore } = useStore()
  let editor: Editor
  watch(
    () => settingStore.theme,
    () => {
      const themeProvider = editor?.get(ThemeProvider)
      themeProvider?.handleThemeUpdate(settingStore.getCurrentTheme())
    }
  )
  return new Promise<Editor>((resolve, reject) => {
    onMounted(() => {
      productStore.fetchAndSet(id).then(data => {
        try {
          const courseData = {
            audio: data.audio,
            duration: data.duration,
            promoterSequence: data.promoterSequence,
            keyframeSequence: data.keyframeSequence,
            subtitleSequence: data.subtitleSequence,
            subtitleKeyframeSequence: data.subtitleKeyframeSequence
          }
          console.log(courseData)
          editor = createEditor(
            getProductConfig({
              rootRef: rootRef.value,
              editorRef: editorRef.value,
              scrollerRef: scrollerRef.value,
              controllerRef: controllerRef.value,
              content: data.content
            })
          )
          editor.mount(editorRef.value).then(() => {
            const themeProvider = editor?.get(ThemeProvider)
            themeProvider?.handleThemeUpdate(settingStore.getCurrentTheme())
            /** 载入数据 */
            /** 载入微课数据 */
            const player = editor?.get(Player)
            player.loadData([courseData])
          })
          resolve(editor)
        } catch (error) {
          console.log(error)
          reject(error)
        }
      })
    })
  })
}

// export function useNoteEditor(toolbarRef: Ref<HTMLElement>, scrollerRef: Ref<HTMLElement>, editorRef: Ref<HTMLElement>) {
//   const { noteStore } = useStore()
//   let editor: Editor | undefined = undefined
//   /** 仅在第一次接收内容数据初始化创建编辑器: 采用这种方式初始化时就不会触发 onChange */
//   watchOnce(
//     () => noteStore.content,
//     () => {
//       try {
//         const config = getProductConfig(toolbarRef.value, scrollerRef.value, noteStore.content)
//         editor = createEditor(config)
//         // resizeService = editor.get(ResizeService)
//         editor.mount(editorRef.value)
//         // editor.onReady.subscribe(() => {
//         //   // emits('onContentLoad', editor.getHTML())
//         // })
//         // editor.onChange.subscribe(() => {
//         //   // console.log(editor.getHTML())
//         // })
//       } catch (error) {
//         console.error(error)
//       }
//     }
//   )
//   return editor
// }
