'use strict';

const credential = require('credential')
const jwt = require('jsonwebtoken');
const END_POINT = '/v1/accounts'

function hashPassword(password) {
  return new Promise((resolve, reject) => {
    var pw = credential()
    pw.hash(password, (err, hash) => {
      if (err) {
        reject(err)
      } else {
        resolve(hash)
      }
    })
  })
}

function verifyPassword(hash, password) {
  return new Promise(function (resolve, reject) {
    var pw = credential()
    pw.verify(hash, password, (err, isValid) => {
      if (err) {
        reject(err)
      } else {
        resolve(isValid)
      }
    })
  })
}

function findByEmail(email, account) {
  return new Promise(function (resolve, reject) {
    account.findOne({
      where: { email: email }
    }).then(
      account => {
        resolve(account)
      },
      err => {
        reject(err)
      }
    )
  })
}

module.exports = (app, models) => {
  app.post(END_POINT + '/register', (req, res) => {
    var fullname = req.body.fullname;
    var phone = req.body.phone;
    var email = req.body.email;
    findByEmail(email, models.account).then(
      account => {
        if (account) {
          // El email existe
          res.status(401).send() //TODO: Investigar que codigo de error se devuelve por account publicada
        } else {
          // se puede crear la account
          hashPassword(req.body.password).then(
            (hash) => {
              var password = hash;
              models.account.create({
                fullname: fullname,
                phone: phone,
                email: email,
                password: password
              }).then(account => {
                res.status(200).end()
              })
            },
            (err) => {
              console.log(err)
              res.status(500).send
            }
          )
        }
      }
    )
  })

  app.post(END_POINT + '/login', (req, res) => {
    var email = req.body.email;
    var password = req.body.password;
    findByEmail(email, models.account).then(
      account => {
        if (account) {
          var storedHash = account.get('password')
          verifyPassword(storedHash, password).then(
            result => {
              if (result) {
                let token = jwt.sign({email: email},
                  'thisSecretShouldGoInconfig.secret',
                  { expiresIn: '24h' // expires in 24 hours
                  }
                );
                res.status(200).send({
                  success: true,
                  message: 'Authentication successful!',
                  token: token
                })
              } else {
                res.status(401).send() // No coincide el password
              }
            },
            err => {
              console.log("No se puedo verificar el hash: ", err)
              res.status(500).send // No se puedo verificar el hash
            }
          )
        } else {
          res.status(401).send() // No existe el email en la base de datos
        }
      },
      err => {
        console.log("No se pudo hacer la busqueda en la base de datos", err)
        res.status(500).send() // No se pudo hacer la busqueda en la base de datos
      }
    )
  })

  app.get(END_POINT + '/logout', (req, res) => {
    /* 
    if (req.session) {
      req.session.destroy()
      res.status(200).send()
    } else {
      res.status(401).send()
    } 
    */

    /*
    REMOVE JW TOKEN ?
    */
   res.status(200).send()
  })

  app.get(END_POINT + '/check-session', (req, res) => {
    
    //USE TOKEN
    //var sess = req.session
    if (sess && sess.email) {
      res.status(200).send([{ serverTime: (new Date).getTime() }])
    } else {
      res.status(401).send()
    }
  })
}
