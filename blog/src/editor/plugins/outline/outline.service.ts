import { Injectable, Observable, Subject } from '@textbus/core'
// import { Observable, Subject } from '@textbus/core'

@Injectable()
export class OutlineService {
  isExpanded: boolean
  private expandEvent: Subject<any> = new Subject()
  onExpand: Observable<boolean>

  private mountEvent: Subject<HTMLElement> = new Subject()
  onMount: Observable<HTMLElement>
  constructor() {
    this.isExpanded = false
    this.onExpand = this.expandEvent.asObservable()
    this.onMount = this.mountEvent.asObservable()
  }
  setHost(host: HTMLElement) {
    this.mountEvent.next(host)
  }

  handleExpand() {
    this.isExpanded = !this.isExpanded
    this.expandEvent.next(this.isExpanded)
  }
}
