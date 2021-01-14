// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Cours from 'App/Models/Cours'

/**
 * @TODO Pagination
 */
export default class WelcomesController {
  public async welcome({ request, auth, view }) {
    const user = auth.user
    const { classe, type, matiere, page } = request.all(['classe', 'type', 'matiere', 'page'])

    let cours
    if (matiere) {
      cours = await Cours.query()
        .where('classe', classe ? classe : user?.classe)
        .where('type', type ? type : 'Cours')
        .where('matiere', matiere)
        .preload('miniature')
        .paginate(page ? page : 1, 9)
    } else {
      cours = await Cours.query()
        .where('classe', classe ? classe : user?.classe)
        .where('type', type ? type : 'Cours')
        .preload('miniature')
        .paginate(page ? page : 1, 9)
    }

    let coursPremiereLigne: Cours[] = []
    let coursSecondeLigne: Cours[] = []
    let coursTroisiemeLigne: Cours[] = []

    for (let i = 0; i < 8; i++) {
      if (i <= 2) {
        if (cours[i]) {
          coursPremiereLigne.push(cours[i])
        }
      } else if (i <= 5) {
        if (cours[i]) {
          coursSecondeLigne.push(cours[i])
        }
      } else if (i <= 5) {
        if (cours[i]) {
          coursTroisiemeLigne.push(cours[i])
        }
      }
    }

    return view.render('welcome', {
      classe,
      user,
      type: type ? type : 'Cours',
      matiere,
      coursPremiereLigne,
      coursSecondeLigne,
      coursTroisiemeLigne,
      hasCours: coursPremiereLigne.length > 0,
    })
  }
}
