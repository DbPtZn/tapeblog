import * as UUID from 'uuid'
import { unref, watch } from 'vue'
import useStore from '@/store'
import { ShellModule, ContainerTypeEnum, FractalContainerConfig } from '@/renderer'

export class BloggerShell implements ShellModule {
  height: string | number
  readonly width: string | number
  readonly useAuxLines?: string | undefined
  wrapper: FractalContainerConfig | undefined
  header: FractalContainerConfig | undefined
  main: FractalContainerConfig | undefined
  footer: FractalContainerConfig | undefined
  constructor() {
    this.height = '2800px'
    this.width = '100vw'
    this.useAuxLines = '' // '#b6b6b6'
    this.wrapper = undefined
    this.header = {
      id: UUID.v4(),
      type: ContainerTypeEnum.LAYOUT,
      name: 'header',
      isRow: true,
      ratio: '68px',
      useMargin: { bottom: '16px' },
      children: []
    }
    this.main = {
      id: UUID.v4(),
      type: ContainerTypeEnum.LAYOUT,
      name: 'main',
      // cmpt: markRaw(Showcase),
      isRow: true,
      // ratio: 92,
      children: []
    }
    this.footer = {
      id: UUID.v4(),
      type: ContainerTypeEnum.LAYOUT,
      name: 'footer',
      isRow: true,
      ratio: '68px',
      children: []
    }
  }
  setup() {
    const { settingStore } = useStore()
    watch(
      () => settingStore.theme,
      () => {
        this.wrapper!.useBgcolor = settingStore.theme === null ? '#f7f7f7' : ''
      }
    )
    const module = <FractalContainerConfig>(this.wrapper = {
      id: UUID.v4(),
      type: ContainerTypeEnum.WRAPPER,
      name: 'shell',
      isRow: false,
      ratio: 100,
      children: [
        this.header!,
        this.main!,
        this.footer!
      ]
    })
    return module
  }
}

export const bloggerShell = new BloggerShell()
