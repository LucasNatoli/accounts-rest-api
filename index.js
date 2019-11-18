const express = require('express')
const bodyParser = require('body-parser')

const models = require('./models')
const router = require('./router')
const app = express()

const env = process.env;
const PORT = env.USRACCNT_PORT;

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Add CORS headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
  next();
});

router(app, models)

//drop and resync with { force: true }
models.sequelize.sync().then(() => {
  console.log('models sync ok')
  app.listen(PORT, () => {
    console.log('APP listening on port:', PORT)
  })
})
