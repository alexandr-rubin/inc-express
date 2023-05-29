import { app } from './setting' 
import { runDb } from './repositories/db'
import { Ngrok } from '@ngrok/ngrok-api'

const ngrok = new Ngrok({
  apiToken: 'ak_2QTH6TUiAwu7ko0rJrWmRh3aS8h',
  baseUrl: 'https://api.ngrok.com'
})

const port = process.env.PORT || 3000

const startApp = async () => {
  await runDb()
app.listen(port, () => {
    console.log(`App listening on port ${port}`)
  })
}

startApp()