const _ = require('lodash')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('./user')
const env = require('./../../.env')
const dictionary = require('./../../dictionary/dictionary.json')

const emailRegex = /\S+@\S+\.\S+/
const passwordRegex = /((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%]).{6,20})/

const sendErrorsFromDB = (res, dbErrors) => {
  const errors = []
  _.forIn(dbErrors.errors, error => errors.push(error.message))
  return res.status(400).json({ errors })
}

const login = (req, res, next) => {
  const email = req.body.email || ''
  const password = req.body.password || ''

  User.findOne({ email }, (err, user) => {
    if (err) {
      return sendErrorsFromDB(res, err)
    } else if (user && bcrypt.compareSync(password, user.password)) {

      const token = jwt.sign({
        expiresIn: "10h",
        user
      }, env.authSecret );

      const { name, email, roles } = user

      res.json({ name, email, roles, token })
    } else {
      return res.status(400).send({ errors: [dictionary.user_password_invalid] })
    }
  })
}

const validateToken = (req, res, next) => {
  const token = req.body.token || ''
  jwt.verify(token, env.authSecret, function (err, decoded) {
    return res.status(200).send({ valid: !err })
  })
}

const signup = (req, res, next) => {
  const name = req.body.name || ''
  const email = req.body.email || ''
  const password = req.body.password || ''
  const confirmPassword = req.body.confirm_password || ''

  if (!email.match(emailRegex)) {
    return res.status(400).send({ errors: [dictionary.email_invalid] })
  }

  if (!password.match(passwordRegex)) {
    return res.status(400).send({
      errors: [
        dictionary.password_weak_conditions
      ]
    })
  }

  const salt = bcrypt.genSaltSync()
  const passwordHash = bcrypt.hashSync(password, salt)
  if (!bcrypt.compareSync(confirmPassword, passwordHash)) {
    return res.status(400).send({ errors: [dictionary.password_not_match] })
  }

  User.findOne({ email }, (err, user) => {
    if (err) {
      return sendErrorsFromDB(res, err)
    } else if (user) {
      return res.status(400).send({ errors: [dictionary.user_registered] })
    } else {

      const permissionUser = { permission_name: env.userPermissionDefault }
      const roleUser = { role_name: env.userRoleDefaultShopkeeper, permissions: [permissionUser] }
      const newUser = new User({ name, email, password: passwordHash, roles: [roleUser] })

      newUser.save(err => {
        if (err) {
          return sendErrorsFromDB(res, err)
        } else {
          login(req, res, next)
        }
      })
    }
  })
}

module.exports = { login, signup, validateToken }
