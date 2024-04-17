import { Subscription } from '@tanbo/stream'
import { VIEW_DOCUMENT } from '@textbus/platform-browser'
import { Plugin, Injector } from '@textbus/core'
import _ from 'lodash'
import { ConfigProvider } from '@/editor'
import { Layout } from '@textbus/editor'
/**
 * 主题控制器（插件）
 */
export class ThemeController implements Plugin {
  private subs: Subscription[] = []
  private editorHost: HTMLElement | null = null
  private toolbarHost: HTMLElement | null = null
  private layout: Layout | null = null
  constructor() {
  }
  setup(injector: Injector): void {
    this.layout = injector.get(Layout)
    this.editorHost = this.layout.container
    this.layout.middle.setAttribute('data-color', '#000000')
    // this.editorHost = injector.get(VIEW_DOCUMENT)
    const configProvider = injector.get(ConfigProvider)
    this.toolbarHost = configProvider.toolbarRef
    this.subs.push(
      configProvider.onThemeUpdate.subscribe(value => {
        switch (value) {
          case 'dark':
            this.updateTheme('data-theme', 'dark-theme')
            break
          case 'light':
            this.updateTheme('data-theme', 'light-theme')
            break
          default:
            return
        }
      })
    )
  }

  updateTheme(attrName: string, themeName: string) {
    this.toolbarHost?.setAttribute(attrName, themeName)
    this.editorHost?.setAttribute(attrName, themeName)
  }

  onDestroy() {
    this.subs.forEach(i => i.unsubscribe())
  }
}
