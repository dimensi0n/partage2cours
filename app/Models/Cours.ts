import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, HasMany, HasOne, hasOne } from '@ioc:Adonis/Lucid/Orm'
import Fichier from './Fichier'

export default class Cours extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column()
  public userId: number

  @column()
  public nom: string

  @column()
  public slug: string

  @column()
  public description: string

  @hasOne(() => Fichier)
  public miniature: HasOne<typeof Fichier>

  @column()
  public classe: string

  @column()
  public matiere: string

  @hasMany(() => Fichier)
  public fichiers: HasMany<typeof Fichier>

  @column()
  public type: string
}
