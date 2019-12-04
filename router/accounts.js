'use strict';

const env = process.env;
const jwtSecret = env.USRACCNT_JWT_SECRET;
const END_POINT = '/v1/accounts'
const credential = require('credential')
const jwt = require('jsonwebtoken');
const msgs = require('./account.messages')

/**
 * MdiddleWare
 */
const checkToken = require('../middleware').checkToken;
const validateRequestEmail = require('../middleware').validateRequestEmail;
const validateRequestPassword = require('../middleware').validateRequestPassword;

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
      account => { resolve(account) },
      err => { reject(err) }
    )
  })
}

function findById(id, account) {
  return new Promise((resolve, reject) => {
    account.findOne({
      attributes: ['fullname', 'phone', 'email'],
      where: { id: id }
    }).then(
      account => { resolve(account) },
      err => { reject(err) }
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
              res.status(500).send
            }
          )
        }
      }
    )
  })

  app.post(
    END_POINT + '/login',
    (req, res, next) => validateRequestEmail(req, res, next),
    (req, res, next) => validateRequestPassword(req, res, next),
    (req, res) => {
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
                    { id: account.get('id') },
                    jwtSecret,
                    { expiresIn: '24h' }
                  );
                  res.status(200).send({
                    token: token,
                    fullname: account.get('fullname')
                  })
                } else {
                  res.status(403).send(msgs.InvalidCredentials()) // No coincide el password
                }
              },
              err => {
                res.status(500).send // No se puedo verificar el hash
              }
            )
          } else {
            res.status(403).send(msgs.InvalidCredentials()) // No existe el email en la base de datos
          }
        },
        err => {
          res.status(500).send() // No se pudo hacer la busqueda en la base de datos
        }
      )

    })

  app.get(
    END_POINT + '/check-token',
    (req, res, next) => { checkToken(req, res, next) },
    (req, res) => {
      res.status(200).send([{
        serverTime: Math.floor(Date.now() / 1000),
        iat: req.decoded.iat,
        exp: req.decoded.exp
      }])
    })

  app.get(
    END_POINT + '/account-info',
    (req, res, next) => { checkToken(req, res, next) },
    (req, res) => {
      var account_id = req.decoded.id;
      findById(account_id, models.account).then(
        account => {
          res.status(200).send(account)
        },
        err => {
          res.status(500).send()
        }
      )
    }
  )

  app.put(
    END_POINT + '/account-info',
    (req, res, next) => { checkToken(req, res, next) },
    (req, res) => {
      var account_id = req.decoded.id;
      var updateValues = { fullname: req.body.fullname, phone: req.body.phone, email: req.body.email }
      models.account.update(
        updateValues,
        { returning: true, where: { id: account_id } }
      ).then(
        () => {
          res.status(200).send()
        }
      ).catch(
        err => { res.status(500).send() }
      )
    }
  )
}
