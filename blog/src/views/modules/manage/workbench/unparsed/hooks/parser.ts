import { createEditor, Layout } from '@textbus/editor'
import { getEditorConfig } from './getConfig'
import { ImgToUrlService } from '@/editor'
import { debounceTime } from '@tanbo/stream'

export class Parser {

  constructor() {}

  /** 获取内容数据 */
  parseContent(args: {content: string, hostname: string, accessToken: string, uploadImgUrl: string}) {
    const { content, hostname, accessToken, uploadImgUrl } = args
    return new Promise<{ content: string; firstPicture: string }>((resolve, reject) => {
      const config = getEditorConfig('', hostname, accessToken, uploadImgUrl)
      const editor = createEditor(config)
      const host = document.createElement('div')
      editor.mount(host)

      const img2url = editor.get(ImgToUrlService)
      
      // 因为组件加载在外部依赖 setup 之前，所以需要在编辑器 ready 之后再替换内容
      editor.onReady.subscribe(() => {
        editor.replaceContent(content)
      })

      editor.onChange.pipe(debounceTime(1000)).subscribe(() => {
        // 1s 后如果没有图片转换任务，则说明已经转换完成或者不存在需要替换的图片组件
        if (img2url.tasks === 0) {
          console.log('replace')
          resolve({ content: editor.getHTML(), firstPicture: '' })
        }
      })

      Promise.all(img2url.promiseSequence).then(() => {
        console.log('all finish')
        img2url.promiseSequence = []
      })

      // 图片转换完成时：
      img2url.onFinish.subscribe(() => {
        console.log('img replace finish')
        const container = editor.get(Layout).container
        const firstImg = container.querySelector('img')
        let firstPicture = ''
        if (firstImg) {
          // 找到最后一个斜杠的索引
          // const lastIndex = imageUrl.lastIndexOf('/')
          // 使用substring方法获取文件名
          // const fileName = imageUrl.substring(lastIndex + 1)
          // console.log(fileName)
          firstPicture = firstImg.src
        }
        // console.log(firstPicture)
        // 导出富文本数据
        resolve({ content: editor.getHTML(), firstPicture: firstPicture })
        // editor.destroy()
      })

      img2url.onError.subscribe(error => {
        console.log(error)
        reject(error)
      })
    })
  }

}

export const parser = new Parser()
