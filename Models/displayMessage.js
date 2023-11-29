const mongoose = require('mongoose')

const displaySchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  displayMessage: String,
  displayType: String,
  displayImageURL: String,
})

module.exports = mongoose.model('displayModel', displaySchema)