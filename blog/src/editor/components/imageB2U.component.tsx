import {
  ComponentInitData,
  ComponentInstance,
  ContentType,
  defineComponent,
  VElement,
  useState,
  useContext,
  Injector,
  onViewChecked
} from '@textbus/core'
import { ComponentLoader } from '@textbus/platform-browser'
import { ImgToUrlService } from '../services'

export interface ImageComponentLiteral {
  src: string
  maxWidth?: string
  maxHeight?: string
  width?: string
  height?: string
  margin?: string
  float?: string
}

export const imageB2UComponent = defineComponent({
  type: ContentType.InlineComponent,
  name: 'ImageB2UComponent',
  setup(data?: ComponentInitData<ImageComponentLiteral>) {
    let state = data?.state || {
      src: ''
    }
    const stateController = useState(state)

    stateController.onChange.subscribe(v => {
      state = v
    })

    const injector = useContext()
    const img2Url = injector.get(ImgToUrlService)
   
    if (data && data.state) {
      img2Url.addProcess(data.state.src, url => {
        stateController.update(draft => {
          draft.src = url
        })
      })
    }
    /** 视图更新完成后检查进程 */
    onViewChecked(() => {
      // console.log('check')
      img2Url.checkProcess()
    })

    return {
      render(): VElement {
        return VElement.createElement('img', {
          src: state.src,
          class: 'tb-img',
          style: {
            width: state.width,
            height: state.height,
            maxWidth: state.maxWidth,
            maxHeight: state.maxHeight,
            margin: state.margin,
            float: state.float
          }
        })
      }
    }
  }
})

export const imageB2UComponentLoader: ComponentLoader = {
  match(element: HTMLElement): boolean {
    return element.tagName === 'IMG'
  },
  read(element: HTMLElement, injector: Injector): ComponentInstance {
    const style = element.style
    return imageB2UComponent.createInstance(injector, {
      state: {
        src: element.getAttribute('src') || '',
        width: style.width,
        height: style.height,
        margin: style.margin,
        float: style.float,
        maxWidth: style.maxWidth,
        maxHeight: style.maxHeight
      }
    })
  }
}
