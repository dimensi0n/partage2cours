import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Fichiers extends BaseSchema {
  protected tableName = 'fichiers'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('cours_id').notNullable()
      table.string('path').notNullable()
      table.string('nom')
      table.timestamps(true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
