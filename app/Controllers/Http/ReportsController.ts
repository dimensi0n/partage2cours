// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Cours from 'App/Models/Cours'
import Report from 'App/Models/Report'
import User from 'App/Models/User'

export default class ReportsController {
  public async index({ auth, view }) {
    const user = auth.user
    const reports = await Report.query().preload('cours')
    return view.render('admin', { user, reports })
  }

  public async create({ params, request, response, session }) {
    const coursId = params.id
    const cours = (await Cours.find(coursId)) || new Cours()

    const report = new Report()
    report.reason = request.input('reason')
    await report.save()
    await report.related('cours').associate(cours)

    session.flash(
      'reported',
      "Le signalement de contenu ne respectant pas les conditions d'utilisation a été envoyé"
    )

    response.redirect('back')
  }

  public async delete({ params, response, session }) {
    const id = params.id
    const report = await Report.find(id)
    await report?.delete()

    session.flash('success', 'Le signalement a été supprimé')
    response.redirect('back')
  }

  public async deleteCours({ request, session, response }) {
    const { username, slug } = request.all(['username', 'slug'])
    try {
      const user = await User.findByOrFail('username', username)
      const cours = await user.related('cours').query().where('slug', slug).firstOrFail()
      await cours.delete()

      session.flash('success', 'Le cours a été supprimé avec succès')
      response.redirect('back')
    } catch (error) {
      session.flash('error', "Ce cours n'existe pas")
      response.redirect('back')
    }
  }

  public async deleteUser({ request, session, response }) {
    try {
      const username = request.input('username')
      const user = await User.findByOrFail('username', username)
      await user.delete()

      session.flash('success', "L'utilisateur a été supprimé avec succès")
      response.redirect('back')
    } catch (error) {
      session.flash('error', "L'utilisateur n'existe pas")
      response.redirect('back')
    }
  }
}
