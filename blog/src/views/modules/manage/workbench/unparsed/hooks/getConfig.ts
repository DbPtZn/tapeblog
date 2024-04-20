/** 导出编辑器配置 */
import { colorFormatter, textBackgroundColorFormatLoader, colorFormatLoader, textBackgroundColorFormatter, animeIgnoreComponentLoader, animePlayerComponent, animeIgnoreComponent, animePlayerComponentLoader, imageB2UComponent, imageB2UComponentLoader, animePlayerFormatter, animePlayerFormatLoader, ImgToUrlService } from '@/editor'
import { Injector } from '@textbus/core'
import {
  defaultComponentLoaders,
  defaultComponents,
  defaultFormatLoaders,
  defaultFormatters,
  EditorOptions,
  rootComponent,
  rootComponentLoader,
} from '@textbus/editor'
export function getEditorConfig(content: string, hostname: string, accessToken: string, uploadImgUrl: string) {
  const config: EditorOptions = {
    rootComponent: rootComponent,
    rootComponentLoader: rootComponentLoader,
    content: content || '',
    components: [imageB2UComponent, animePlayerComponent, animeIgnoreComponent, ...defaultComponents],
    componentLoaders: [imageB2UComponentLoader, animePlayerComponentLoader, animeIgnoreComponentLoader, ...defaultComponentLoaders],
    formatters: [animePlayerFormatter, colorFormatter, textBackgroundColorFormatter, ...defaultFormatters],
    formatLoaders: [animePlayerFormatLoader, colorFormatLoader, textBackgroundColorFormatLoader, ...defaultFormatLoaders],
    plugins: [],
    providers: [
      ImgToUrlService
    ],
    setup(injector: Injector) {
      const img2url = injector.get(ImgToUrlService)
      img2url.setup({
        hostname:  hostname,
        accessToken: accessToken,
        uploadImgUrl: uploadImgUrl
      })  
    }
  }
  return config
}
