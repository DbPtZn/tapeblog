import { MaxLength } from 'class-validator'
import { AfterUpdate, BeforeInsert, Column, CreateDateColumn, Entity, ObjectIdColumn, UpdateDateColumn } from 'typeorm'
import { ObjectId } from 'mongodb'
@Entity()
export class Authcode {
  @ObjectIdColumn()
  _id: ObjectId

  @Column()
  userId: ObjectId

  @Column()
  @MaxLength(36)
  name: string

  @Column({
    unique: true
  })
  code: string

  @Column({
    default: false
  })
  disabled: boolean

  @Column({
    default: ''
  })
  desc: string

  @CreateDateColumn()
  createAt: Date

  @UpdateDateColumn()
  updateAt: Date

  /** 插入实体时设置创建时间 */
  @BeforeInsert()
  createDate() {
    this.createAt = new Date()
    this.disabled = false
  }

  /** 实体更新时自动更新时间 */
  @AfterUpdate()
  updateDate() {
    this.updateAt = new Date()
  }
}
