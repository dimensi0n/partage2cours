// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Cours from 'App/Models/Cours'
import Report from 'App/Models/Report'

export default class ReportsController {
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
}
