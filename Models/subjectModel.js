const mongoose = require('mongoose')

const subjectSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  subjectName: String,
  subjectImage: String,
  gradeExemptStr: String,
})

module.exports = mongoose.model('subjectModel', subjectSchema)