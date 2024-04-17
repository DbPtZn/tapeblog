import { Exclude } from 'class-transformer'
import { MaxLength, MinLength } from 'class-validator'
import { ObjectId } from 'mongodb'
import { RemovedEnum } from 'src/enum'
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

@Entity()
export class Collection {
  @ObjectIdColumn() _id: ObjectId

  @Column() userId: ObjectId

  @Column() UID: string

  @Column() account: string

  @Column() name: string

  @Column({
    default: false
  })
  isPublish: boolean // 是否公开发布

  @Column({
    type: 'enum',
    enum: RemovedEnum,
    default: RemovedEnum.NEVER
  })
  removed: RemovedEnum // 移除状态

  @CreateDateColumn()
  createAt: Date // 创建时间

  @UpdateDateColumn()
  updateAt: Date // 更新时间

  /** 插入实体时设置创建时间 */
  @BeforeInsert()
  createDate() {
    this.createAt = new Date()
    this.removed = RemovedEnum.NEVER
    this.isPublish = false
  }

  /** 实体更新时自动更新时间 */
  @AfterUpdate()
  updateDate() {
    this.updateAt = new Date()
  }
}
