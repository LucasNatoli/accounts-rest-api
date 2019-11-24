'use strict';

const credential = require('credential')
const jwt = require('jsonwebtoken');
const END_POINT = '/v1/accounts'
const MSG_INVALID_TOKEN = 'Invalid authorization header'
const MSG_INVALID_CREDENTIALS = 'The credentials you priveded are not valid. Please try again'

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

let checkToken = (req, res, next) => {
  let token = req.headers['x-access-token'] || req.headers['authorization']; // Express headers are auto converted to lowercase
  if (token) {
    if (token.startsWith('Bearer ')) {
      token = token.slice(7, token.length); // Remove Bearer from string
    }
    jwt.verify(token, 'thisSecretShouldGoInconfig.secret', (err, decoded) => {
      if (err) {
        return res.status(400).send({ error: MSG_INVALID_TOKEN });
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    return res.status(400).send({ error: MSG_INVALID_TOKEN });
  }
};


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
                let token = jwt.sign(
                  { email: email },
                  'thisSecretShouldGoInconfig.secret',
                  { expiresIn: '24h' }
                );
                res.status(200).send({
                  token: token,
                  fullname: account.get('fullname')
                })
              } else {
                res.status(403).send({message: MSG_INVALID_CREDENTIALS}) // No coincide el password
              }
            },
            err => {
              res.status(500).send // No se puedo verificar el hash
            }
          )
        } else {
          res.status(403).send( { message: MSG_INVALID_CREDENTIALS}) // No existe el email en la base de datos
        }
      },
      err => {
        res.status(500).send() // No se pudo hacer la busqueda en la base de datos
      }
    )
  })

  app.get(
    END_POINT + '/check-session',
    (req, res, next) => { checkToken(req, res, next) },
    (req, res) => {
      res.status(200).send([{
        serverTime: (new Date).getTime(),
        decoded: req.decoded
      }])
    })
}
