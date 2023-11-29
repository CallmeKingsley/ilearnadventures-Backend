const mongoose = require('mongoose')

const completedSessionsSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  courselevel: String,
  userId: String,
  data: String,
  date: String,
  displayName: String,
  gradelevel: String,
  id : String,
  month: String,
  name: String,
  subject: String,
  isDeleted: Boolean,
  dateCompleted: { type: String, default: new Date().toLocaleString() },
})

module.exports = mongoose.model('completedSessionsSchemaModel', completedSessionsSchema)