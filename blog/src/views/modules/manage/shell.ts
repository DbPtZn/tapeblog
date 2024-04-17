import * as UUID from 'uuid'
import { markRaw } from 'vue'
import useStore from '@/store'
import { ShellModule, ContainerTypeEnum, FractalContainerConfig } from '@/renderer'
import { SidebarView } from './sidebar'
import { PageHeaderView } from './page-header'
import { ItemListView } from './itemlist'
import { RouteNameEnum } from '@/enums'
import { ComponentWorkbench } from './component.workbench'
import { AuthManage } from './auth'
export class ManagerShell implements ShellModule {
  height: string | number
  width: string | number
  useAuxLines?: string | undefined
  itemlistVisible: boolean
  workbench: ComponentWorkbench
  layout: {
    verticalWrapper: FractalContainerConfig | undefined
    horizontalWrapper: FractalContainerConfig | undefined
    header: FractalContainerConfig | undefined
    sidebar: FractalContainerConfig | undefined
    itemlist: FractalContainerConfig | undefined
    workbenchWrapper: FractalContainerConfig | undefined
  }
  constructor() {
    this.height = '100vh'
    this.width = '100vw'
    this.itemlistVisible = false
    this.workbench = new ComponentWorkbench()
    this.layout = {
      verticalWrapper: undefined,
      horizontalWrapper: undefined,
      header: {
        id: UUID.v4(),
        type: ContainerTypeEnum.CMPT,
        name: 'sidebar',
        cmpt: markRaw(PageHeaderView),
        isRow: false,
        ratio: '60px',
        // min: '240px',
        children: []
      },
      sidebar: {
        id: UUID.v4(),
        type: ContainerTypeEnum.CMPT,
        name: 'sidebar',
        cmpt: markRaw(SidebarView),
        isRow: false,
        ratio: '240px',
        // min: '240px',
        children: []
      },
      itemlist: {
        id: UUID.v4(),
        type: ContainerTypeEnum.CMPT,
        name: 'itemlist',
        cmpt: markRaw(ItemListView),
        isRow: true,
        ratio: '280px',
        // min: '280px',
        isSplitterRender: true,
        children: []
      },
      workbenchWrapper: {
        id: UUID.v4(),
        type: ContainerTypeEnum.LAYOUT,
        name: 'workbench-wrapper',
        isRow: true,
        isSplitterRender: true,
        children: [
          this.workbench.data
        ]
      }
    }
    
  }

  setup() {
    const { settingStore } = useStore()
    // watch(
    //   () => settingStore.theme,
    //   () => {
    //     this.layout.wrapper!.useBgcolor = settingStore.theme === null ? '#f7f7f7' : ''
    //   }
    // )
    this.layout.horizontalWrapper = {
      id: UUID.v4(),
      type: ContainerTypeEnum.WRAPPER,
      name: 'shell',
      isRow: true,
      useBgcolor: settingStore.theme === null ? '#f7f7f7' : '',
      children: [
        this.layout.sidebar!,
        // this.layout.itemlist!,
        this.layout.workbenchWrapper!
      ]
    }
    const module = <FractalContainerConfig>(this.layout.verticalWrapper = {
      id: UUID.v4(),
      type: ContainerTypeEnum.WRAPPER,
      name: 'shell',
      isRow: false,
      ratio: 100,
      useBgcolor: settingStore.theme === null ? '#f7f7f7' : '',
      children: [
        this.layout.header!,
        this.layout.horizontalWrapper!
      ]
    })
    
    return module
  }

  useItemlist() {
    const { collectionStore } = useStore('manage')
    if (this.layout.horizontalWrapper?.children.includes(this.layout.itemlist!)) {
      if (!collectionStore.id) {
        this.layout.horizontalWrapper?.children.splice(1, 1)
      }
    } else {
      if (collectionStore.id) {
        this.layout.horizontalWrapper?.children.splice(1, 0, this.layout.itemlist!)
      }
      if (this.layout.itemlist?.ratio === 0) {
        this.expandItemlist()
      }
    }
  }

  useWorkbench() {
    this.layout.workbenchWrapper!.children = [this.workbench.data]
  }

  useAuthManage() {
    const data = {
      id: UUID.v4(),
      type: ContainerTypeEnum.CMPT,
      name: 'auth-manage',
      cmpt: markRaw(AuthManage),
      isRow: true,
      children: []
    }
    this.layout.workbenchWrapper!.children = [data]
  }

  useBlogger() {
    const data = {
      id: UUID.v4(),
      type: ContainerTypeEnum.IFRAME,
      name: 'blogger',
      cmpt: null,
      url: `${window.location.origin}/#/${RouteNameEnum.BLOGGER}`,
      isRow: true,
      children: []
    }
    this.layout.workbenchWrapper!.children = [data]
  }

  
  collapseSidebar() {
    const { settingStore } = useStore()
    settingStore.isSidebarCollapse = true
    this.layout.sidebar!.ratio = 0
    // this.layout.sidebar!.min = 0
  }
  expandSidebar() {
    const { settingStore } = useStore()
    settingStore.isSidebarCollapse = false
    this.layout.sidebar!.ratio = '240px'
    // this.layout.sidebar!.min = '240px'
  }
  collapseItemlist() {
    const { settingStore } = useStore()
    settingStore.isItemListCollapse = true
    this.layout.itemlist!.ratio = 0
    // this.layout.sidebar!.min = 0
  }
  expandItemlist() {
    const { settingStore } = useStore()
    settingStore.isItemListCollapse = false
    this.layout.itemlist!.ratio = '280px'
    // this.layout.sidebar!.min = '240px'
  }
}

export const managerShell = new ManagerShell()

