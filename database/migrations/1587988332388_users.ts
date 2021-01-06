import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class UsersSchema extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('email', 255).notNullable()
      table.string('password', 180).notNullable()
      table.string('username').notNullable()
      table.string('biography').defaultTo("Cet utilisateur n'a pas de biographie")
      table.string('classe').notNullable()
      table.string('remember_me_token').nullable()
      table.timestamps(true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
