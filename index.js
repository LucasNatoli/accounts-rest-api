const express = require('express')
const models = require('./models')
const router = require('./router')
const bodyParser = require('body-parser')
const app = express()

const env = process.env;

const PORT = env.MYAPP_PORT

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

router(app, models)

//drop and resync with { force: true }
models.sequelize.sync().then(() => {
  console.log('models sync ok')
  app.listen(PORT, () => {
    console.log('APP listening on port:', PORT)
  })
})
