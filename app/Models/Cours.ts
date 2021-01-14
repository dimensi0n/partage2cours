import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, HasMany, HasOne, hasOne } from '@ioc:Adonis/Lucid/Orm'
import Fichier from './Fichier'
import Miniature from './Miniature'

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
  public username: string

  @column()
  public nom: string

  @column()
  public slug: string

  @column()
  public description: string

  @hasOne(() => Miniature)
  public miniature: HasOne<typeof Miniature>

  @column()
  public classe: string

  @column()
  public matiere: string

  @hasMany(() => Fichier)
  public fichiers: HasMany<typeof Fichier>

  @column()
  public type: string
}
