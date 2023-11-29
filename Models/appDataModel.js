const mongoose = require('mongoose')

const appDataSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  appLogoURL: String,
  contactSupportURL: String,
  lastUpdate: { type: String, default: new Date().toLocaleString() },
  privacyPolicyURL: String,
  mightNeed: String,
  displayMessage: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'displayModel'
    }
  ],
  subjects: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'subjectModel'
    }
  ],
  assessmentData: String,
  accessKey: String,
})

module.exports = mongoose.model('appDataModel', appDataSchema)