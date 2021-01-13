import User from 'App/Models/User'
import { hash } from 'phc-bcrypt'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class AuthController {
  public async register({ request, auth, response }: HttpContextContract) {
    /**
     * Validate user details
     */
    const validationSchema = schema.create({
      email: schema.string({ trim: true }, [
        rules.email(),
        rules.unique({ table: 'users', column: 'email' }),
      ]),
      username: schema.string({ trim: true }, [
        rules.alpha(),
        rules.unique({ table: 'users', column: 'username' }),
        rules.blacklist(['edit', 'update', 'delete', 'admin']),
      ]),
      password: schema.string({ trim: true }),
      classe: schema.string({ trim: true }),
    })

    const userDetails = await request.validate({
      schema: validationSchema,
    })

    /**
     * Create a new user
     */
    const user = new User()
    user.email = userDetails.email
    user.password = await hash(userDetails.password)
    user.username = userDetails.username
    user.classe = userDetails.classe
    await user.save()

    await auth.login(user)
    response.redirect('/')
  }

  public async login({ request, auth, session, response }) {
    const email = request.input('email')
    const password = request.input('password')
    const rememberUser = !!request.input('remember_me')

    try {
      await auth.attempt(email, password, rememberUser)
      response.redirect('/')
    } catch (err) {
      session.flash('error', 'Identifiants invalides')
      response.redirect('back')
    }
  }

  public async logout({ auth, response }) {
    await auth.logout()
    return response.redirect('/login')
  }
}
