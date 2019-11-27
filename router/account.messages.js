const MSG_INVALID_TOKEN = 'Invalid authorization header.'
const MSG_INVALID_CREDENTIALS = 'The credentials you provided are not valid. Please try again.'

module.exports = {
  InvalidToken: () => {
    return { message: MSG_INVALID_TOKEN}
  }, 
  InvalidCredentials: () => {
    return { message: MSG_INVALID_CREDENTIALS}
  }
}