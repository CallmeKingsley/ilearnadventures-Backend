const mongoose = require('mongoose')

const resultsSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  resultID: String,
  ownerID: String,
  rightAnswer: String,
  actualAnswer: String,
  questions: String,
  option1: String,
  option2: String,
  option3: String,
  option4: String,
  curriculum: String,
  gradeLevel: String,
  subject: String,
  dateCreated: { type: String, default: new Date().toLocaleString() },
  sessionID: String,
  explanation: String,
  questionNumber: String,
  questionsTotal: String,
  questionType: String,
  image: String,
})

module.exports = mongoose.model('resultsModel', resultsSchema)