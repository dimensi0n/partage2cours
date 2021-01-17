// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { hash, verify } from 'phc-bcrypt'

export default class ProfilesController {
  public async show({ params, auth, view, response }) {
    const targetUser = await User.findBy('username', params.username)
    if (!targetUser) {
      return response.redirect('/')
    }
    const user = auth.user
    await targetUser.preload('cours', (query) => {
      query.preload('miniature')
    })

    console.log(targetUser.cours)
    return view.render('profile/show', {
      user,
      isCurrentUser: user.username === targetUser?.username,
      targetUser,
    })
  }

  public async edit({ request, auth, response }) {
    /**
     * Validate user details
     */
    const validationSchema = schema.create({
      email: schema.string({ trim: true }, [rules.email()]),
      classe: schema.string({ trim: true }),
    })

    const userDetails = await request.validate({
      schema: validationSchema,
    })

    const { username } = auth.user
    await User.query().where('username', username).update(userDetails)

    return response.redirect(`/profile/${userDetails.username}`)
  }

  public async updatePassword({ request, auth, session, response }) {
    const validationSchema = schema.create({
      oldpassword: schema.string({ trim: true }),
      newpassword: schema.string({ trim: true }),
    })

    const validatedPasswords = await request.validate({
      schema: validationSchema,
    })

    const user = auth.user

    if (await verify(user.password, validatedPasswords.oldpassword)) {
      user.password = await hash(validatedPasswords.newpassword)
      user.save()
    } else {
      session.flash('errors.oldpassword', "L'ancien password saisi n'est pas correct")
      return response.redirect('back')
    }

    return response.redirect(`/profile/${user.username}`)
  }
}
