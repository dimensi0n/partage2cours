// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'

export default class ProfilesController {
  public async show({ params, view }) {
    const user = await User.findBy('username', params.username)
    console.log(user)
    return view.render('profile/show', { user })
  }
}
