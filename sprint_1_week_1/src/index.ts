import { app } from './setting' 
import { runDb } from './repositories/db'

const port = process.env.PORT || 3000

export const server = async () => {
  await runDb()
app.listen(port, () => {
    console.log(`App listening on port ${port}`)
  })
}

server()