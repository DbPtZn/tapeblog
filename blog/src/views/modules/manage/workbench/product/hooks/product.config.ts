// import { Caret, CaretLimit } from '@textbus/browser'
// import { ContainerEventPlugin, CustomToolbar, InlineToolbarPlugin, OutlinesPlugin, outlineExpandTool } from '@/editor'
// import { CustomToolbar, InlineToolbarPlugin, OutlinePlugin, ResizeService, outlineCollapseTool, OutlineService } from '@/editor'
import { AnimeProvider, ConfigProvider, Controller, Player, PlayerContextMenuPlugin, Structurer, ThemeProvider, animeIgnoreComponent, animeIgnoreComponentLoader, animePlayerComponent, animePlayerComponentLoader, animePlayerFormatLoader, animePlayerFormatter, forwardTool, replayTool, rewindTool, speedDownTool, speedUpTool, startTool, stopTool, textBackgroundColorFormatLoader, textBackgroundColorFormatter, volumeDownTool, volumeUpTool } from '@/editor'
import { fromEvent, Injector } from '@textbus/core'
import {
  boldTool,
  cleanTool,
  colorFormatLoader,
  colorFormatter,
  colorTool,
  defaultComponentLoaders,
  defaultComponents,
  defaultFormatLoaders,
  defaultFormatters,
  defaultGroupTool,
  defaultTools,
  EditorOptions,
  headingTool,
  imageTool,
  italicTool,
  LinkJumpTipPlugin,
  linkTool,
  strikeThroughTool,
  textBackgroundTool,
  Toolbar,
  underlineTool,
  unlinkTool
} from '@textbus/editor'
import { CaretLimit, Input } from '@textbus/platform-browser'
import { CustomThemeCommonVars, ThemeCommonVars } from 'naive-ui'

export function getProductConfig(args: {
  rootRef: HTMLElement,
  editorRef: HTMLElement,
  scrollerRef: HTMLElement, 
  toolbarRef?: HTMLElement,
  controllerRef?: HTMLElement,
  content?: string
}) {
  const { rootRef, editorRef, scrollerRef, toolbarRef, controllerRef, content } = args
  const config: EditorOptions = {
    theme: 'darkline',
    autoFocus: true,
    autoHeight: true,
    zenCoding: true,
    historyStackSize: 30,
    placeholder: '在此输入正文',
    readonly: true,
    content: content || '',
    components: [animePlayerComponent, animeIgnoreComponent, ...defaultComponents],
    componentLoaders: [animePlayerComponentLoader, animeIgnoreComponentLoader, ...defaultComponentLoaders],
    formatters: [animePlayerFormatter, colorFormatter, textBackgroundColorFormatter, ...defaultFormatters],
    formatLoaders: [animePlayerFormatLoader, colorFormatLoader, textBackgroundColorFormatLoader, ...defaultFormatLoaders],
    styleSheets: [],
    providers: [ConfigProvider, Player, AnimeProvider],
    plugins: [
      () => new LinkJumpTipPlugin(),
      () => new PlayerContextMenuPlugin(),
      new Controller(
        [speedDownTool, rewindTool, startTool, forwardTool, speedUpTool, replayTool, stopTool, volumeUpTool, volumeDownTool],
        controllerRef!
        // autoHideController
      )
    ],
    setup(injector: Injector) {
      const input = injector.get(Input)
      input.caret.correctScrollTop({
        onScroll: fromEvent(document, 'scoll'),
        getLimit(): CaretLimit {
          const rect = scrollerRef.getBoundingClientRect()
          return {
            top: 0,
            bottom: rect.height + rect.top
          }
        },
        setOffset(offsetScrollTop: number) {
          scrollerRef.scrollTop += offsetScrollTop
        }
      })
      /** 配置服务依赖 */
      // 主题依赖
      const themeProvider = injector.get(ThemeProvider)
      themeProvider.setup(injector)
      // 组成元素
      const structurer = injector.get(Structurer)
      structurer.setup({
        rootRef,
        scrollerRef,
        toolbarRef,
        editorRef,
        controllerRef
      })
      /** 播放器依赖注入 */
      const player = injector.get(Player)
      player.setup(injector, scrollerRef)
    }
  }
  return config
}
