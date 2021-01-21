import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from 'App/Models/User'
import Env from '@ioc:Adonis/Core/Env'
import { hash } from 'phc-bcrypt'

export default class UserSeeder extends BaseSeeder {
  public async run() {
    await User.create({
      email: 'admin@admin.p2c',
      username: 'admin',
      classe: 'Terminale',
      password: await hash(Env.get('ADMIN_PASSWORD')),
    })
  }
}
