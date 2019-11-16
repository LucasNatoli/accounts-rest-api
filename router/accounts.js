'use strict';

const credential = require('credential')

function hashPassword (password) {
  return new Promise((resolve, reject) => {
    var pw = credential()
    pw.hash(password, (err, hash)=>{
      if (err) {
        reject(err)
      }else{
        resolve(hash)
      }
    })
  })
}

function verifyPassword(hash, password) {
  return new Promise(function(resolve, reject) {
    var pw = credential()
    pw.verify(hash, password, (err, isValid)=>{
      if (err) {
        reject(err)
      }else {
        resolve(isValid)
      }
    })
  })
}

function findByEmail(email, account){
  return new Promise(function(resolve, reject) {
    account.findOne({
      where: {email: email}
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

module.exports = (app, db) => {
  app.post('/register', (req, res) => {
    var fullname = req.body.fullname;
    var phone = req.body.phone;
    var email = req.body.email;
    findByEmail(email, db.account).then(
      account => {
        if(account){
          // El email existe
          res.status(401).send() //TODO: Investigar que codigo de error se devuelve por account publicada
        } else {
          // se puede crear la account
          hashPassword(req.body.password).then(
            (hash)=>{
              var password = hash;
              db.account.create({
                fullname: fullname,
                phone: phone,
                email: email,
                password: password
              }).then(account => {
                res.status(200).end()
              })
            },
            (err)=>{
              console.log(err)
              res.status(500).send
            }
          )
        }
      }
    )
  })

  app.post('/login', (req, res) =>{
    var email = req.body.email;
    var password = req.body.password;
    findByEmail(email, db.account).then(
      account => {
        if (account) {
          var storedHash = account.get('password')
          verifyPassword(storedHash, password).then(
            result => {
              if (result) {
                //SESSION SUPPORT temporalmente deshabilitado
/*                 var sess = req.session
                sess.email = email
                sess.fullname = result.fullname
                sess.save */
                res.status(200).end()
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

  app.get('/logout', (req, res) => {
    req.session = null
    res.status(200).send()
  })

  app.get('/check-session', (req, res) => {
    // SESSION SUPPORT 
    var sess = req.session
    if (sess && sess.email) {   
      res.status(200).send([
        {
          serverTime: (new Date).getTime()
        }
      ])      
    } else {
      res.status(401).send()
    }
  })


/*   app.post('/checkmail', (req, res) => {
    var email = req.body.email;
    // chequear si ya existe el email
    findByEmail(email, db.account).then(
      account => {
        res.send(account)
      },
      err => {
        console.log('error findByEmail', err);
        res.status(500)
      }
    )

  }) */  
}
