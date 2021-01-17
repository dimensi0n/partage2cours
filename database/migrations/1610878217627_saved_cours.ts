import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class SavedCours extends BaseSchema {
  protected tableName = 'saved_cours'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id')
      table.integer('cours_id')
      table.timestamps(true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
