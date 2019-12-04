const msgs = require('../router/account.messages')
const jwt = require('jsonwebtoken');
const jwtSecret = process.env.USRACCNT_JWT_SECRET;

const middlewares = {

  validateRequestEmail : (req, res, next) => {

    const email = req.body.email;
    const emailType = typeof (email)
    if (emailType === 'string' && email.length < 320) {
      next()
    } else {
      res.status(403).send(msgs.InvalidCredentials())
    }        
  },

  validateRequestPassword : (req, res, next) => {

    const password = req.body.password;
    const passwordType = typeof (password)
    if (passwordType === 'string' && password.length === 128) {
      next()
    } else {
      res.status(403).send(msgs.InvalidCredentials())
    }    
  }, 

  checkToken : (req, res, next) => {
    let token = req.headers['x-access-token'] || req.headers['authorization']; // Express headers are auto converted to lowercase
    if (token) {
      if (token.startsWith('Bearer ')) {
        token = token.slice(7, token.length); // Remove Bearer from string
      }
      jwt.verify(token, jwtSecret, (err, decoded) => {
        if (err) {
          return res.status(400).send(msgs.InvalidToken());
        } else {
          req.decoded = decoded;
          next();
        }
      });
    } else {
      return res.status(400).send(msgs.InvalidToken());
    }    
  }
}

module.exports = middlewares