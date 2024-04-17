import { Exclude } from 'class-transformer'
import { MaxLength, MinLength } from 'class-validator'
import { ObjectId } from 'mongodb'
import {
  AfterUpdate,
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  ObjectIdColumn,
  OneToMany,
  Tree,
  TreeChildren,
  TreeParent,
  UpdateDateColumn
} from 'typeorm'
import { ProductTypeEnum } from '../enum/ProductTypeEnum'
import { RemovedEnum } from 'src/enum'

@Entity()
export class Product {
  @ObjectIdColumn() _id: ObjectId

  /** 作品类型 */
  @Column()
  type: string

  /** 是否完成解析 */
  @Column() isParsed: boolean

  /** 编辑器版本号 */
  @Column() editorVersion: string

  /** 来源作者笔名 */
  @Column() penname: string

  /** 来源(作品提交时的授权码对应的配置 id) */
  @Column() authorizeId: ObjectId

  /** 合辑id */
  @Column() collectionId: ObjectId

  /** 用户id */
  @Column() userId: ObjectId

  /** UID */
  @Column() UID: string

  @Column({
    length: 120,
    default: '无标题'
  })
  title: string

  @Column({
    default: ''
  })
  content: string

  /** ------------------------------------------------- 课程相关 ------------------------------------- */

  @Column()
  audio: string // 音频地址

  @Column()
  duration: number // 音频时长

  @Column({
    default: []
  })
  promoterSequence: Array<string> // 启动子序列

  @Column({
    default: []
  })
  keyframeSequence: Array<number> // 关键帧序列

  @Column({
    default: []
  })
  subtitleSequence: Array<string> // 字幕序列

  @Column({
    default: []
  })
  subtitleKeyframeSequence: Array<number> // 字幕关键帧序列

  /** ------------------------------------------------------------------------------------------------ */

  @Column({
    length: 30
  })
  abbrev: string

  @Column({
    default: ''
  })
  firstPicture: string

  @Column({
    default: []
  })
  tags: Array<string> // 标签

  // 是否出版
  @Column({
    default: false
  })
  isPublish: boolean

  /** 作者邮箱 */
  @Column({
    default: ''
  })
  email: string

  /** 作者网站主页 */
  @Column({
    default: ''
  })
  homepage: string

  /** 作品详情 */
  @Column({
    default: {
      wordage: 0,
      duration: 0,
      filesize: 0
    }
  })
  detail: {
    wordage: number // 字数
    duration?: number // 时长
    filesize?: number // 文件大小(包含音频文件、文本、图片)
  }

  /** 备注讯息 */
  @Column()
  msg: string

  /** 移除状态 */
  @Column({
    type: 'enum',
    enum: RemovedEnum,
    default: RemovedEnum.NEVER
  })
  removed: RemovedEnum // 移除状态

  /** 统计 */
  @Column({
    default: {
      like: 0,
      comment: 0,
      collection: 0,
      read: 0
    }
  })
  count: {
    like: number //点赞数
    comment: number // 评论数
    collection: number // 收藏数
    read: number // 阅读数
  }

  /** 评论（序列） */

  @CreateDateColumn()
  createAt: Date

  @UpdateDateColumn()
  updateAt: Date

  /** 插入实体时设置创建时间 */
  @BeforeInsert()
  createDate() {
    this.createAt = new Date()
    this.isPublish = false
    this.removed = RemovedEnum.NEVER
  }

  /** 实体更新时自动更新时间 */
  @AfterUpdate()
  updateDate() {
    this.updateAt = new Date()
  }
}
