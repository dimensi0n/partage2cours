import { DateTime } from 'luxon'
import { BaseModel, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import Cours from './Cours'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column()
  public email: string

  @column()
  public username: string

  @column()
  public password: string

  @column()
  public classe: string

  @column()
  public biography: string

  @column()
  public rememberMeToken: string

  @hasMany(() => Cours)
  public cours: HasMany<typeof Cours>
}
