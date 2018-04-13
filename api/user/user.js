const restful = require('node-restful')
const mongoose = restful.mongoose

const userPermission = new mongoose.Schema({
  permission_name: {
    type: String,
    required: false,
    uppercase: true,
    enum: [
      'ALL',
      'BROWSER',
      'ADD',
      'READ',
      'EDIT',
      'DELETE',
    ]
  }
})

const userRole = new mongoose.Schema({
  role_name: {
    type: String,
    required: false,
    uppercase: true,
    enum: [
      'ADMINISTRATOR',
      'STAFF_AUDITOR',
      'STAFF_FINANCE',
      'STAFF_COMMERCIAL',
      'STAFF_SUPPORT',
      'STAFF_SALE',
      'STAFF_MARKETING',
      'SHOPKEEPER_ADMIN',
      'SHOPKEEPER_EDITOR',
      'SHOPKEEPER_DEVELOP'
    ],
  },
  permissions: [userPermission]
})

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    min:6,
    max: 12,
    required: true
  },
  roles: [userRole],
  created_at: {
    type: Date,
    default: Date.now
  },
  update_at: {
    type: Date,
    default: Date.now
  }
})

module.exports = restful.model('User', userSchema)
