const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  userName: String,
  phoneNumber: String,
  email: String,
  pin: String,
  lastLogin: String,
  isSubscribe: Boolean,
  subscriptionType: String,
  subscriptionDate: String,
  subscriptionReceipt: String,
  expirationDate: String,
  curriculumKey: String,
  platform: String,
  DeviceOS: String,
  strick: String,
  gradeLevel: String,
  dark: Boolean,
  studentGradeLevel: String,
  deviceId: String,
  sound: Boolean,
  flag: { type: Boolean, default: false },
  isDeleted:  { type: Boolean, default: false },
  notification: Boolean,
  freeTrialActive: { type: Boolean, default: false },
  defaultStatus: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'displayModel'
    }
  ],
  completedSessions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'completedSessionsSchemaModel'
    }
  ],
  userAssessments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'completedSessionsSchemaModel'
    }
  ],
  Created: { type: String, default: new Date().toLocaleString() }
})

module.exports = mongoose.model('User', userSchema)