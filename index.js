const express = require('express')
const bodyParser = require('body-parser')
const session = require('express-session')
const SQLiteStore = require('connect-sqlite3')(session)

const models = require('./models')
const router = require('./router')
const app = express()

const env = process.env;
const PORT = env.USRACCNT_PORT;

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(session({
  store: new SQLiteStore({dir: '.sqlite3', db: 'sess.db'}),
  secret: 'aCaTtYpeDTh1sS3kre7',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 }
}))

router(app, models)

//drop and resync with { force: true }
models.sequelize.sync().then(() => {
  console.log('models sync ok')
  app.listen(PORT, () => {
    console.log('APP listening on port:', PORT)
  })
})
