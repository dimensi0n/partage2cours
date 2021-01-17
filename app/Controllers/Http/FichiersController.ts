// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Fichier from 'App/Models/Fichier'

export default class FilesController {
  public async delete({ params, response }) {
    const id = params.id

    const fichier = await Fichier.find(id)
    await fichier?.delete()

    response.redirect('back')
  }
}
