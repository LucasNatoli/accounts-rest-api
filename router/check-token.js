const MSG_INVALID_TOKEN = 'Invalid authorization header'
const jwt = require('jsonwebtoken');
const jwtSecret = process.env.USRACCNT_JWT_SECRET;

function checkToken (req, res, next) {
  let token = req.headers['x-access-token'] || req.headers['authorization']; // Express headers are auto converted to lowercase
  if (token) {
    if (token.startsWith('Bearer ')) {
      token = token.slice(7, token.length); // Remove Bearer from string
    }
    jwt.verify(token, jwtSecret, (err, decoded) => {
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

module.exports = checkToken