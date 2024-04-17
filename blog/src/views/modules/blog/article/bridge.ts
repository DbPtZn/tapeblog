import { Observable, Subject } from "@tanbo/stream"
import { Editor } from "@textbus/editor"
import { Ref, reactive, ref } from "vue"

export interface OutlineItem {
  tagName: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  text: string
  offsetTop: number
}
interface OutlineState {
  data: OutlineItem[]
  scroller: HTMLElement | undefined
  activeIndex: number
}
/** 控制器状态 */
type Placement = 'draggable' |  'leftside' | 'rightside'
interface ControlState {
  placement: Placement
  isAutoHide: boolean
}
/** 课程状态 */
type Playrate = 0.5 | 0.75 | 1 | 1.25 | 1.5 | 2
interface CourseState {
  playrate: Playrate
  isSubtitlesHide: boolean
}
/** 讲台状态 */
type PlatformWidth = '880px' | '1080px' |'100%'
interface PlatformState {
  isScrollbarHide: boolean
  isOutlineHide: boolean
  width: PlatformWidth
}
/** 目录状态 */
interface DirState {
  isCollapse: boolean
}
interface HabitState {
  control: ControlState
  course: CourseState
  platform: PlatformState
  dir: DirState
}


class Outline {
  state: OutlineState

  constructor() {
    this.state = reactive<OutlineState>({
      data: [],
      scroller: undefined,
      activeIndex: 0
    })
  }

  /** 设置大纲视图数据 */
  setData(data: OutlineItem[]) {
    this.state.data = data
  }

  /** 设置滚动器 */
  setScroller(scrollerRef: HTMLElement | undefined) {
    this.state.scroller = scrollerRef
  }

  /**
   * 设置当前焦点条目
   * @param scrollTop 滚动条的位置 
   */
  setActiveIndex(scrollTop: number) {
    // console.log(scrollTop)
    const index = this.state.data.findIndex((item, index) => item.offsetTop >= scrollTop)
    this.state.activeIndex = index
  }

  /** 滚动至 */
  scrollTo(offsetTop: number) {
    this.state.scroller?.scrollTo({ top: offsetTop, behavior: 'smooth' })
  }

  /** 重置 */
  reset() {
    this.state.activeIndex = 0
    this.state.scroller = undefined
    this.state.data = []
  }
}


class Habit {
  state: HabitState
  controlPlaceOptions: ({ label: string; value: Placement })[]
  playRateOptions: ({ label: string; value: Playrate })[]
  platformWidthOptions: ({ label: string; value: PlatformWidth })[]
  constructor() {
    this.state = reactive({
      control: {
        placement: 'rightside',
        isAutoHide: false
      },
      course: {
        playrate: 1,
        isSubtitlesHide: false
      },
      platform: {
        isScrollbarHide: false,
        isOutlineHide: false,
        width: '880px'
      },
      dir: {
        isCollapse: true
      }
    })
    this.controlPlaceOptions = [
      {
        label: '拖拽',
        value: 'draggable'
      },
      {
        label: '右侧',
        value: 'leftside'
      },
      {
        label: '左侧',
        value: 'rightside'
      }
    ]
    this.playRateOptions = [
      {
        label: '0.5x',
        value:  0.5
      },
      {
        label: '0.75x',
        value: 0.75
      },
      {
        label: '默认',
        value: 1
      },
      {
        label: '1.25x',
        value: 1.25
      },
      {
        label: '1.5x',
        value: 1.5
      },
      {
        label: '2x',
        value: 2
      }
    ]
    this.platformWidthOptions = [
      {
        label: '窄屏',
        value: '880px'
      },
      {
        label: '宽屏',
        value: '1080px'
      },
      {
        label: '超宽',
        value: '100%'
      }
    ]
  }

}

class Bridge {
  private editorReadyEvent: Subject<any> = new Subject()
  onEditorReady: Observable<Editor> = this.editorReadyEvent.asObservable()
  // editor!: Editor
  outline: Outline
  habit: Habit

  constructor() {
    this.outline = new Outline()
    this.habit = new Habit()
  }
  setup(){}

  catchEditorReady(editor: Editor) {
    this.editorReadyEvent.next(editor)
  }
}
const bridge = new Bridge()

export default bridge