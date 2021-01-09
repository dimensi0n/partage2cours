/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes/index.ts` as follows
|
| import './cart'
| import './customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async ({ auth, view }) => {
  const user = await auth.authenticate()
  return view.render('welcome', { user })
})

Route.on('register').render('register')
Route.post('register', 'AuthController.register')
Route.on('/login').render('login')
Route.post('/login', 'AuthController.login')
Route.get('/logout', 'AuthController.logout')

Route.group(() => {
  Route.get('/edit', async ({ auth, view }) => {
    const user = await auth.authenticate()
    return view.render('profile/edit', { user })
  })
  Route.post('/edit', 'ProfilesController.edit')
  Route.post('/edit/updatePassword', 'ProfilesController.updatePassword')
  Route.get('/:username', 'ProfilesController.show')
})
  .prefix('/profile')
  .middleware('auth')

Route.group(() => {
  Route.get('/create', async ({ auth, view }) => {
    const user = await auth.authenticate()
    return view.render('cours/create', { user })
  })
  Route.post('/create', 'CoursController.create')
})
  .prefix('/cours')
  .middleware('auth')
