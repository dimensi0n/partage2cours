import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Miniatures extends BaseSchema {
  protected tableName = 'miniatures'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.timestamps(true)
      table.integer('cours_id')
      table.string('path')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
