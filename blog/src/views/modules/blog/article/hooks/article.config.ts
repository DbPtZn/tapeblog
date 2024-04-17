// import { Caret, CaretLimit } from '@textbus/browser'
// import { ContainerEventPlugin, CustomToolbar, InlineToolbarPlugin, OutlinesPlugin, outlineExpandTool } from '@/editor'
// import { CustomToolbar, InlineToolbarPlugin, OutlinePlugin, ResizeService, outlineCollapseTool, OutlineService } from '@/editor'
import { AnimeProvider, ConfigProvider, Controller, OutlinePlugin, OutlineService, Player, ThemeController, animeIgnoreComponent, animeIgnoreComponentLoader, animePlayerComponent, animePlayerComponentLoader, animePlayerFormatLoader, animePlayerFormatter, forwardTool, replayTool, rewindTool, speedDownTool, speedUpTool, startTool, stopTool, textBackgroundColorFormatLoader, textBackgroundColorFormatter, volumeDownTool, volumeUpTool } from '@/editor'
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

export function getArticleConfig(args: {
  scrollerRef: HTMLElement,
  controllerRef: HTMLElement,
  layoutRef: HTMLElement,
  content: string
}) {
  const { scrollerRef, controllerRef, layoutRef, content } = args
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
    providers: [ConfigProvider, Player, AnimeProvider, OutlineService],
    plugins: [
      () => new LinkJumpTipPlugin(),
      () => new ThemeController(),
      () => new OutlinePlugin()
      // new Controller(
      //   [speedDownTool, rewindTool, startTool, forwardTool, speedUpTool, replayTool, stopTool, volumeUpTool, volumeDownTool],
      //   controllerRef
      //   // autoHideController
      // )
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
      const configProvider = injector.get(ConfigProvider)
      configProvider.setup(injector, { scrollerRef })
      /** 播放器依赖注入 */
      const player = injector.get(Player)
      player.setup(injector, scrollerRef, layoutRef)
    }
  }
  return config
}
