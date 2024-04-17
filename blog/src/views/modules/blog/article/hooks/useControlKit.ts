import { Player } from '@/editor'
import { Editor } from '@textbus/editor'
import { Component, markRaw, reactive, ref } from 'vue'
import {
  KeyboardDoubleArrowUpOutlined,
  KeyboardDoubleArrowDownOutlined,
  Replay5Outlined,
  PlayArrowOutlined,
  Forward5Outlined,
  PauseOutlined,
  StopFilled
} from '@vicons/material'
interface ControlOption {
  label: string
  size: 'tiny' | 'small' | 'medium' | 'large'
  icon: Component
  iconSize: number | string
  onClick: () => void
}
export function useControlKit() {
  const isPlaying = ref<boolean>(false)
  const isPause = ref<boolean>(false)
  function getControlOptions(editor: Editor) {
    const player = editor.get(Player)
    player.onStateUpdate.subscribe(() => {
      isPlaying.value = player.isPlaying
      isPause.value = player.isPause
    })
    player.onPlayOver.subscribe(() => {
      isPlaying.value = player.isPlaying
      isPause.value = player.isPause
    })
    const options = ref<ControlOption[]>([
      {
        label: '减速',
        size: 'small',
        icon: markRaw(KeyboardDoubleArrowUpOutlined),
        iconSize: 24,
        onClick: () => {
          player.speedDown()
        }
      },
      {
        label: '回拨 2 s',
        size: 'medium',
        icon: markRaw(Replay5Outlined),
        iconSize: 26,
        onClick: () => {
          player.rewind()
        }
      },
      {
        label: '开始',
        size: 'large',
        icon: isPlaying.value ? markRaw(PauseOutlined) : markRaw(PlayArrowOutlined),
        iconSize: 28,
        onClick: () => {
          if (!player.isPlaying && !player.isPause) return player.start()
          if (player.isPlaying && !player.isPause) return player.pause()
          if (!player.isPlaying && player.isPause) return player.resume()
        }
      },
      {
        label: '跳越 2 s',
        size: 'medium',
        icon: markRaw(Forward5Outlined),
        iconSize: 26,
        onClick: () => {
          player.forward()
        }
      },
      {
        label: '加速',
        size: 'small',
        icon: markRaw(KeyboardDoubleArrowDownOutlined),
        iconSize: 24,
        onClick: () => {
          player.speedUp()
        }
      },
      {
        label: '终止',
        size: 'small',
        icon: markRaw(StopFilled),
        iconSize: 20,
        onClick: () => {
          player.stop()
        }
      }
    ])
    return options.value
  }

  return getControlOptions
}
