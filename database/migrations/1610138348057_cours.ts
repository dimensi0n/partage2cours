import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Cours extends BaseSchema {
  protected tableName = 'cours'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.timestamps(true)
      table.integer('user_id').notNullable()
      table.string('username').notNullable()
      table.string('nom').notNullable()
      table.string('description').notNullable()
      table.string('slug').notNullable()
      table.string('type').notNullable()
      table.string('classe').notNullable()
      table.string('matiere').notNullable()
      table.boolean('blocked').defaultTo(false)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
