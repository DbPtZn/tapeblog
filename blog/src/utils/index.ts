export * from './diff'
import { isDiff } from './diff'
import { dateFormat1, dateFormat2 } from './date-format'
import { generateRandomString } from './randomstring'
const utils = {
  /** 格式化日期 */
  dateFormat1,
  dateFormat2,
  /** 脏值判断 */
  isDiff,
  /** 生成随机字符串 */
  generateRandomString
}
export default utils