import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class Admin {
  public async handle({ auth, response }: HttpContextContract, next: () => Promise<void>) {
    if (auth.user?.username === 'admin') {
      await next()
    } else {
      response.redirect('/')
    }
  }
}
