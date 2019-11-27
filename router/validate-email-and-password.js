const MSG_INVALID_CREDENTIALS = 'The credentials you priveded are not valid. Please try again';

function validateEmailAndPassword(req, res, next) {
  const email = req.body.email;
  const password = req.body.password;
  const emailType = typeof (email)
  const passwordType = typeof (password)
  if (
    emailType === 'string' && passwordType === 'string' &&
    password.length === 128 &&  email.length < 320
  ) {
    next()
  } else {
    res.status(403).send({ message: MSG_INVALID_CREDENTIALS })
  }
}

module.exports = validateEmailAndPassword