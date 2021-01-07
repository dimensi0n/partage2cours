// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'

export default class ProfilesController {
  public async show({ params, auth, view, response }) {
    const targetUser = await User.findBy('username', params.username)
    if (!targetUser) {
      return response.redirect('/')
    }
    const user = auth.user
    return view.render('profile/show', {
      user,
      isCurrentUser: user.username === targetUser?.username,
      targetUser,
    })
  }

  public async edit() {}
}
