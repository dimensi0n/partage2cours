import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Reports extends BaseSchema {
  protected tableName = 'reports'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.timestamps(true)
      table.integer('cours_id')
      table.string('reason').notNullable().defaultTo('Pas de raison indiquee')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
