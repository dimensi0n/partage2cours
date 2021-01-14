import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Application from '@ioc:Adonis/Core/Application'
import Cours from 'App/Models/Cours'
import slugify from 'slugify'
import { unlink } from 'fs'
import User from 'App/Models/User'
import Fichier from 'App/Models/Fichier'
import Miniature from 'App/Models/Miniature'

export default class CoursController {
  /**
   * @TODO Add description breaklines
   * @TODO Extend validator to make the cours name unique for the user
   * @TODO Use photoswipe for the image viewer
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
    cours.username = user.username

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
    const miniature = new Miniature()
    if (coursDetails.miniature) {
      const name = coursDetails.miniature?.clientName
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

  /**
   * @TODO remove files
   */
  public async edit({ params, auth, view, response }) {
    const user = auth.user
    const slug = params.slug

    const targetUser = await User.find(user.id)
    const cours = await targetUser?.related('cours').query().where('slug', slug).first()

    if (!cours) {
      response.redirect('/')
    }

    return view.render('cours/edit', { user, cours })
  }

  /**
   * @TODO change miniature
   */
  public async update({ request, params, auth, response }) {
    const user = auth.user
    const targetUser = await User.find(user.id)
    const slug = params.slug

    const validationSchema = schema.create({
      nom: schema.string({ trim: true }),
      description: schema.string({ trim: true }, [rules.blacklist(['Description du cours'])]),
      classe: schema.string({ trim: true }, [rules.blacklist(['Classe'])]),
      matiere: schema.string({ trim: true }),
      type: schema.string({ trim: true }, [rules.blacklist(['Type'])]),
    })

    const coursDetails = await request.validate({
      schema: validationSchema,
    })

    await targetUser?.related('cours').query().where('slug', slug).update(coursDetails)

    const cours = await targetUser?.related('cours').query().where('slug', slug).first()
    const path = `${user.username}/${slug}`

    const fichiers = request.files('fichiers', {
      size: '2mb',
      extnames: ['jpg', 'png', 'jpeg', 'docx', 'odt', 'pdf', 'pptx', 'odp'],
    })

    for (let document of fichiers) {
      const fichier = new Fichier()
      const name = document.clientName
      fichier.nom = name
      fichier.path = `/uploads/${path}/${name}`
      await document.move(Application.publicPath(`uploads/${path}/`))
      await cours?.related('fichiers').save(fichier)
    }

    response.redirect(`/cours/${user.username}/${slug}`)
  }

  public async delete({ params, auth, response }) {
    const user = auth.user
    const slug = params.slug

    const targetUser = await User.find(user.id)
    const cours = await targetUser?.related('cours').query().where('slug', slug).first()

    const fichiers = await cours?.related('fichiers').query()
    for (let fichier of fichiers ? fichiers : []) {
      const path = fichier.path
      unlink(Application.publicPath(path), (err) => console.log(err))
    }

    await cours?.related('fichiers').query().delete()
    await cours?.related('miniature').query().delete()
    await targetUser?.related('cours').query().where('slug', slug).delete()

    response.redirect('/')
  }
}
