import { DpzIcon } from '@/components'
// import useStore, { any, any, any } from "@/store"
import { Ref, nextTick, ref, h } from 'vue'
import * as UUID from 'uuid'
import { LibraryEnum, MaterialTypeEnum } from '@/enums'
import { NInput, NTree, useDialog, useMessage } from 'naive-ui'
import { DialogApiInjection } from 'naive-ui/es/dialog/src/DialogProvider'
import { DropdownMixedOption } from 'naive-ui/es/dropdown/src/interface'
import { MessageApiInjection } from 'naive-ui/es/message/src/MessageProvider'
import SelectCollectionForm from '../form/SelectCollectionForm.vue'
import useStore from '@/store'

export class ItemListDropDown {
  private xRef: Ref<number>
  private yRef: Ref<number>
  private showDropdownRef: Ref<boolean>
  private contextmenuFolder: any | null
  private contextmenuFile: any | null
  private copy: DropdownMixedOption
  private paste: DropdownMixedOption
  private dialog: DialogApiInjection
  private message: MessageApiInjection
  constructor() {
    this.dialog = useDialog()
    this.message = useMessage()
    this.xRef = ref(0)
    this.yRef = ref(0)
    this.showDropdownRef = ref(false)
    this.contextmenuFolder = null
    this.contextmenuFile = null
    this.copy = {
      label: '复制',
      key: UUID.v4(),
      props: {
        onClick: () => {
          this.handleHideDropdown()
        }
      }
    }
    this.paste = {
      label: '粘贴',
      key: UUID.v4(),
      disabled: true,
      props: {
        onClick: () => {
          this.handleHideDropdown()
        }
      }
    }
  }

  /** 获取【未分配文件】的下拉菜单选项 */
  getUnfiledDropdownOptions(id: string): DropdownMixedOption[] {
    return [this.unfiled().genUnfiledAllocationOption(id), this.unfiled().genUnfiledRemoveOption(id)]
  }
  /** 获取【合辑项目文件】的下拉菜单选项 */
  getFileDropdownOptions(id: string, isPublish: boolean): DropdownMixedOption[] {
    return [
      this.file(id, isPublish).genPublishOption(),
      {
        key: 'header-divider',
        type: 'divider'
      },
      this.file(id, isPublish).genUpdateTitleOption(),
      this.file(id, isPublish).genRevokeOption(),
      this.file(id, isPublish).genMoveOption(),
      this.file(id, isPublish).genRemoveOption()
    ]
  }

  /** 获取【右击菜单】的下拉列表选项 */
  getContextmenuDropdownOptions(): DropdownMixedOption[] {
    return []
  }

  /** --------------------------------- Unfiled ----------------------------- */
  private unfiled() {
    const { collectionsDataStore, collectionStore, productStore } = useStore('manage')
    return {
      /** 分配 */
      genUnfiledAllocationOption: (id: string): DropdownMixedOption => {
        return {
          label: '分配',
          key: UUID.v4(),
          props: {
            onClick: () => {
              this.dialog.create({
                icon: () => h(DpzIcon, { icon: `${MaterialTypeEnum.FILLED}dirve_file_move_rtl`, size: 24 }),
                title: '分配',
                content: () =>
                  h(SelectCollectionForm, {
                    data: collectionsDataStore.data.map(item => {
                      return { id: item.id, label: item.name }
                    }),
                    submit: res => {
                      if (!res.collectionId) return
                      const isPublish = collectionsDataStore.data[collectionsDataStore.data.findIndex(item => item.id === res.collectionId)].isPublish
                      productStore
                        .allocation({
                          id,
                          collectionId: res.collectionId,
                          isPublish
                        })
                        .then(res => {
                          collectionStore.removeSubfileById(id)
                          this.dialog.destroyAll()
                        })
                        .catch(err => console.log(err))
                    }
                  })
              })
            }
          }
        }
      },
      /** 移除 */
      genUnfiledRemoveOption: (id: string) => {
        return {
          label: '删除',
          key: UUID.v4(),
          props: {
            onClick: () => {
              console.log('45')
            }
          }
        }
      }
    }
  }

  /** --------------------------------- File ----------------------------- */
  private file(id: string, isPublish: boolean) {
    const { productStore, collectionStore } = useStore('manage')
    return {
      /** 移除文件 */
      genPublishOption: (): DropdownMixedOption => {
        return {
          label: `${isPublish ? '撤回' : '发布'}`,
          key: UUID.v4(),
          props: {
            onClick: () => {
              collectionStore.subfiles[collectionStore.subfiles.findIndex(item => item.id === id)].isPublish = !isPublish
            }
          }
        }
      },
      /** 修改标题 */
      genUpdateTitleOption: (): DropdownMixedOption => {
        return {
          label: '修改标题',
          key: UUID.v4(),
          props: {
            onClick: () => {
              console.log('45')
            }
          }
        }
      },
      /** 撤销文件（撤回未分配状态） */
      genRevokeOption: (): DropdownMixedOption => {
        return {
          label: '移出合辑',
          key: UUID.v4(),
          props: {
            onClick: () => {
              productStore.revoke(id).then(res => {
                collectionStore.removeSubfileById(id)
              })
            }
          }
        }
      },
      genMoveOption: (): DropdownMixedOption => {
        return {
          label: '移动',
          key: UUID.v4(),
          props: {
            onClick: () => {
              console.log('45')
            }
          }
        }
      },
      genRemoveOption: (): DropdownMixedOption => {
        return {
          label: '删除',
          key: UUID.v4(),
          props: {
            onClick: () => {
              console.log('45')
            }
          }
        }
      }
    }
  }

  /** 新建 */
  private createNewBuildOption(folderId: string, lib: LibraryEnum): DropdownMixedOption {
    return {}
  }

  /** 创建新文件（列表） */
  private createNewFile(folderId: string, lib: LibraryEnum) {
    //
  }

  /** 创建新文件夹（列表） */
  private createNewFolder(folderId: string, lib: LibraryEnum, isCloud?: boolean) {
    //
  }
  /** 创建文件夹 */
  private createFolder(config: any, node: any) {
    //
  }
  /** -------------------------------- Handle ---------------------------- */
  /** 打开右击菜单 */
  handleContextmenu(ev: MouseEvent, item?: any | any, type?: 'folder' | 'file') {
    if (type === 'folder') {
      this.contextmenuFolder = item ? (item as any) : null
      this.contextmenuFile = null
    } else if (type === 'file') {
      this.contextmenuFile = item ? (item as any) : null
      this.contextmenuFolder = null
    } else {
      this.contextmenuFile = null
      this.contextmenuFolder = null
    }
    ev.preventDefault()
    ev.stopPropagation()
    this.showDropdownRef.value = false
    nextTick().then(() => {
      this.showDropdownRef.value = true
      this.xRef.value = ev.clientX
      this.yRef.value = ev.clientY
    })
  }
  getDropDownX() {
    return this.xRef.value
  }
  getDropDownY() {
    return this.yRef.value
  }
  getShowDropdown() {
    return this.showDropdownRef.value
  }
  handleHideDropdown() {
    this.showDropdownRef.value = false
  }
}
