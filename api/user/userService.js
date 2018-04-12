const _ = require('lodash')
const User = require('./user')
const dictionary = require('./../../dictionary/dictionary.json')

User.methods(['get', 'post', 'put', 'delete'])
User.updateOptions({new: true, runValidators: true})

User.after('post', sendErrorsOrNext)
  .after('put', sendErrorsOrNext)
  .after('get', sendErrorsOrNext)

function sendErrorsOrNext(req, res, next) {
  const bundle = res.locals.bundle

  if(bundle.code === 11000) {
    res.status(422).json({errors: [dictionary.email_unique]})
  } else if(bundle.status === 404) {
    res.status(404).json({errors: [dictionary.not_found]})
  } else if(bundle.errors) {
    let errors = parseErrors(bundle.errors)
    res.status(500).json({errors})
  } else {
    next()
  }

}

function parseErrors(nodeRestfulErrors) {
  const errors = []
  _.forIn(nodeRestfulErrors, error => errors.push(error.message))
  return errors
}

User.route('count', function(req, res, next) {
  User.count(function(error, value) {
    if(error) {
      res.status(500).json({errors: [error]})
    } else {
      res.json({value})
    }
  })
})

module.exports = User
