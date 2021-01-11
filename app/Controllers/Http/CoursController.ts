import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Application from '@ioc:Adonis/Core/Application'
import Cours from 'App/Models/Cours'
import slugify from 'slugify'
import User from 'App/Models/User'
import Fichier from 'App/Models/Fichier'

export default class CoursController {
  /**
   * @TODO Add description breaklines
   * @TODO Extend validator to make the cours name unique for the user
   */
  public async create({ request, auth, session, response }: HttpContextContract) {
    const user = auth.user || new User()

    const validationSchema = schema.create({
      nom: schema.string({ trim: true }),
      description: schema.string({ trim: true }, [rules.blacklist(['Description du cours'])]),
      classe: schema.string({ trim: true }, [rules.blacklist(['Classe'])]),
      matiere: schema.string({ trim: true }),
      type: schema.string({ trim: true }, [rules.blacklist(['Type'])]),
      miniature: schema.file.optional({
        size: '2mb',
        extnames: ['png', 'jpg', 'jpeg'],
      }),
    })

    const coursDetails = await request.validate({
      schema: validationSchema,
    })

    const cours = new Cours()
    cours.nom = coursDetails.nom
    cours.description = coursDetails.description
    cours.classe = coursDetails.classe
    cours.matiere = coursDetails.matiere
    cours.type = coursDetails.type

    const slug = slugify(coursDetails.nom)
    cours.slug = slug

    await user.related('cours').save(cours)

    const path = `${user.username}/${slug}`
    const fichiers = request.files('fichiers', {
      size: '2mb',
      extnames: ['jpg', 'png', 'jpeg', 'docx', 'odt', 'pdf', 'pptx', 'odp'],
    })
    if (fichiers.length === 0) {
      session.flash('errors.fichiers', 'Fichier manquant')
    }
    for (let document of fichiers) {
      const fichier = new Fichier()
      const name = document.clientName
      fichier.nom = name
      fichier.path = `/uploads/${path}/${name}`
      await document.move(Application.publicPath(`uploads/${path}/`))
      await cours.related('fichiers').save(fichier)
    }
    const miniature = new Fichier()
    if (coursDetails.miniature) {
      const name = coursDetails.miniature?.clientName
      miniature.nom = name
      miniature.path = `/uploads/${path}/${name}`
    } else {
      miniature.path = '/miniaturecours.png'
    }
    await coursDetails.miniature?.move(Application.publicPath(`uploads/${path}/`))

    await cours.related('miniature').save(miniature)

    /**
     * @BUG la session ne fonctionne pas
     */
    session.flash('info-sucess', 'Votre cours a bien été créé')
    response.redirect(`/cours/${user.username}/${slug}`)
  }

  public async show({ params, auth, response, view }) {
    const user = auth.user || new User()
    try {
      const { username, slug } = params
      const targetUser = await User.findBy('username', username)
      const cours = await targetUser
        ?.related('cours')
        .query()
        .where('slug', slug)
        .preload('miniature')
        .preload('fichiers')

      if (cours?.length === 0) {
        response.status(404)
        return view.render('errors.not-found')
      } else {
        return view.render('cours/show', { user, targetUser, cours })
      }
    } catch (error) {
      console.log(error)
      response.status(404)
      return view.render('errors.not-found')
    }
  }
}
