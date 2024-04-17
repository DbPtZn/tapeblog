import { Exclude } from 'class-transformer'
import { MaxLength, MinLength } from 'class-validator'
import { ObjectId } from 'mongodb'
// import { Folder } from 'src/folder/entities/folder.entity'
import {
  AfterUpdate,
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  ObjectIdColumn,
  OneToMany,
  UpdateDateColumn
} from 'typeorm'

@Entity()
export class User {
  @ObjectIdColumn()
  _id: ObjectId

  @Column()
  UID: string // 用户ID

  @Column({
    unique: true
  })
  account: string // 账号

  @Column()
  @MaxLength(120)
  encryptedPassword: string // 密码

  @Column({
    length: 18,
    default: '未命名用户'
  })
  nickname: string // 昵称

  @Column()
  avatar: string //头像

  @Column({
    default: ''
  })
  email: string // 邮箱

  @Column({
    default: ''
  })
  phone: string // 手机号

  @Column({
    default: ''
  })
  @MaxLength(64)
  desc: string // 描述

  /**
   * 0 - 完全开放
   * 1 - 启用授权码模式
   * 2 - 禁止任何投稿
   */
  @Column({
    default: {
      status: 0,
      autoParse: false
    }
  })
  receiverConfig: {
    status: 0 | 1 | 2
    autoParse: boolean
  }

  @CreateDateColumn()
  createAt: Date // 创建时间

  @UpdateDateColumn()
  updateAt: Date // 更新时间

  /** 插入实体时设置创建时间 */
  @BeforeInsert()
  createDate() {
    this.createAt = new Date()
    this.receiverConfig = {
      status: 0,
      autoParse: false
    }
  }

  /** 实体更新时自动更新时间 */
  @AfterUpdate()
  updateDate() {
    this.updateAt = new Date()
  }
}
