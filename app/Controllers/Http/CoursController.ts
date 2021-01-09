// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Application from '@ioc:Adonis/Core/Application'
import Cours from 'App/Models/Cours'
import slugify from 'slugify'

export default class CoursController {
  /**
   * @TODO Add flash messages et les custom errors
   */
  public async create({ request, auth, session, response }) {
    const user = auth.user

    const validationSchema = schema.create({
      nom: schema.string({ trim: true }),
      description: schema.string({ trim: true }, [rules.blacklist(['Description du cours'])]),
      classe: schema.string({ trim: true }, [rules.blacklist(['Classe'])]),
      matiere: schema.string({ trim: true }),
      type: schema.string({ trim: true }, [rules.blacklist(['Type'])]),
      document: schema.file({
        size: '2mb',
        extnames: ['png', 'jpg', 'jpeg', 'pdf', 'odt', 'docx'],
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

    const path = `${user.username}/${slugify(coursDetails.nom)}`
    await coursDetails.document.move(Application.publicPath(`uploads/${path}`))

    console.log(coursDetails.document)
    cours.filePath = `/uploads/${path}/${coursDetails.document.fileName}`

    user.related('cours').save(cours)

    session.flash('info-sucess', 'Votre cours a bien été créé')
    return response.redirect('/')
  }
}
