import { DpzIcon } from '@/components'
// import useStore, { any, any, any } from "@/store"
import { Ref, nextTick, ref, h, reactive, computed, Component } from 'vue'
import * as UUID from 'uuid'
import { LibraryEnum, MaterialTypeEnum } from '@/enums'
import { NIcon, NInput, NTree, useDialog, useMessage } from 'naive-ui'
import { DialogApiInjection } from 'naive-ui/es/dialog/src/DialogProvider'
import { DropdownOption } from 'naive-ui'
import { MessageApiInjection } from 'naive-ui/es/message/src/MessageProvider'
import SelectCollectionForm from '../../form/SelectCollectionForm.vue'
import useStore, { useManageStore } from '@/store'
import { DriveFileMoveRtlFilled, DriveFileRenameOutlineFilled } from '@vicons/material'
import { DropdownMixedOption } from 'naive-ui/es/dropdown/src/interface'
type Article = ReturnType<typeof useManageStore>['collectionStore']['subfiles'][0]
export function useListDropDown () {
  const dialog = useDialog()
  const message = useMessage()
  const dropdownState = reactive({
    lib: ref<LibraryEnum>(),
    type: ref<'file' | 'folder' | 'list'>(),
    target: ref<Article>(),
    xRef: ref<number>(0),
    yRef: ref<number>(0),
    showDropdownRef: ref<boolean>(false),
    showArrowRef: ref<boolean>(false),
    placementRef: ref<'bottom' | 'bottom-start'>('bottom-start')
  })
    
  const renderIcon = (component: Component) => {
    return h(NIcon, { component: component, size: 24 })
  }
  const options = computed<DropdownMixedOption[]>(() => {
    const { collectionsDataStore, productStore, collectionStore } = useStore('manage')
    const target = dropdownState.target
    if (!target) return []
    return [
      // 分配
      {
        label: '分配',
        show: !target.collectionId,
        key: 'distribution',
        props: {
          onClick: () => {
            dialog.create({
              title: '分配合辑',
              icon: () => renderIcon(DriveFileMoveRtlFilled),
              content: () => 
                h(SelectCollectionForm, {
                  data: collectionsDataStore.data.map(item => {
                    return { id: item.id, label: item.name }
                  }),
                  submit: res => {
                    if (!res.collectionId) return
                    productStore
                      .allocation({
                        id: target.id,
                        collectionId: res.collectionId,
                        isPublish: target.isPublish
                      })
                      .then(res => {
                        collectionStore.removeSubfileById(target.id)
                        dialog.destroyAll()
                      })
                      .catch(err => console.log(err))
                  }
                })
            })
          }
        }
      },
      {
        label: `${target.isPublish ? '撤回' : '发布'}`,
        show: !!target.collectionId,
        key: 'publish',
        props: {
          onClick: () => {
            productStore.publish(target.id).then(res => {
              const index = collectionStore.subfiles.findIndex(item => item.id === target.id)
              if (index !== -1) collectionStore.subfiles[index].isPublish = res.data
            }).catch(err => {
              message.error('发布状态更新失败！')
            })
          }
        }
      },
      {
        label: '修改标题',
        key: 'updateTitle',
        props: {
          onClick: () => {
            const newTitle = ref(target.title)
            dialog.create({
              icon: () => h(NIcon, { component: DriveFileRenameOutlineFilled, size: 24 }),
              title: '文件夹重命名',
              content: () =>
                h(NInput, {
                  type: 'text',
                  placeholder: '输入新名称',
                  maxlength: 32,
                  showCount: true,
                  value: newTitle.value,
                  onInput: value => {
                    newTitle.value = value
                  }
                }),
              positiveText: '确定',
              negativeText: '取消',
              maskClosable: true,
              onPositiveClick: () => {
                if (newTitle.value === target.title) return
                if (newTitle.value === '') message.error('作品名称不能为空！')
                if (newTitle.value && target.id) {
                  productStore.updateTitle(target.id, newTitle.value).then(res => {
                    if (target.collectionId === collectionStore.id) {
                      collectionStore.subfiles.some((item, index, arr) => {
                        if (item.id === target.id) {
                          arr[index].title = newTitle.value
                          return true
                        }
                      })
                    }
                  })
                }
              }
            })
            
          }
        }
      },
      {
        label: '查看版本',
        key: 'version',
        disabled: true,
        show: !!target.collectionId,
        props: {
          onClick: () => {
            //
          }
        }
      },
      {
        label: '移出合辑',
        key: 'moveout',
        show: !!target.collectionId,
        props: {
          onClick: () => {
            productStore.revoke(target.id).then(res => {
              collectionStore.removeSubfileById(target.id)
            })
          }
        }
      },
      {
        label: '移动',
        key: 'move',
        show: !!target.collectionId,
        props: {
          onClick: () => {
            dialog.create({
              title: '移动',
              icon: () => renderIcon(DriveFileMoveRtlFilled),
              content: () => 
                h(SelectCollectionForm, {
                  data: collectionsDataStore.data.map(item => {
                    return { id: item.id, label: item.name }
                  }),
                  submit: res => {
                    if (!res.collectionId) return
                    productStore
                      .allocation({
                        id: target.id,
                        collectionId: res.collectionId,
                        isPublish: target.isPublish
                      })
                      .then(res => {
                        collectionStore.removeSubfileById(target.id)
                        dialog.destroyAll()
                      })
                      .catch(err => console.log(err))
                  }
                })
            })
          }
        }
      },
      {
        label: '删除',
        key: 'remove',
        props: {
          onClick: () => {
            productStore.remove(target.id).then(res => {
              if(target.collectionId === collectionStore.id) {
                collectionStore.removeSubfileById(target.id)
              }
            })
          }
        }
      }

    ]
  })

  function handleContextmenu(ev: MouseEvent, target: Article, type?: 'folder' | 'file' | 'list') {
    dropdownState.type = type
    ev.preventDefault()
    ev.stopPropagation()
    dropdownState.showDropdownRef = false
    dropdownState.target = target
    nextTick().then(() => {
      dropdownState.showDropdownRef = true
      dropdownState.xRef = ev.clientX
      dropdownState.yRef = ev.clientY
      dropdownState.showArrowRef = false
      dropdownState.placementRef = 'bottom-start'
    })
  }
  function handleMoreAction(ev: MouseEvent, target: Article, type?: 'folder' | 'file') {
    dropdownState.type = type
    ev.preventDefault()
    ev.stopPropagation()
    dropdownState.showDropdownRef = false
    dropdownState.target = target
    const el = ev.target as HTMLElement
    const rect = el.getBoundingClientRect()
    nextTick().then(() => {
      dropdownState.showDropdownRef = true
      dropdownState.xRef = rect.x + 9
      dropdownState.yRef = rect.y + 15
      dropdownState.showArrowRef = true
      dropdownState.placementRef = 'bottom'
    })
  }
  
  function handleClickoutside() {
    dropdownState.showDropdownRef = false
  }

  function handleSelect() {
    dropdownState.showDropdownRef = false
  }


  return {
    dropdownState,
    options,
    handleClickoutside,
    handleContextmenu,
    handleMoreAction,
    handleSelect
  }
}