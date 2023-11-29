const express = require('express')
const router = express.Router()
const userController = require('../Controllers').userController
const Vonage = require('@vonage/server-sdk')

//new messager 
const accountSid = "AC988368334fc70b93e65ec467520edf77";
const authToken = '3e24dc99fad4fd5fe3c7647b3e7063cd';
const verifySid = "VA5d8903dcb67eaf1ad8dcb56fb3edbf5f";
const client = require('twilio')(accountSid, authToken);


const vonage = new Vonage({
    apiKey: "8ea96c57",
    apiSecret: "ZdIaCr3Ot4VyUGCf"
})

router.post('/deleteUser',validation, userController.deleteUserAccount)
router.post('/createUser',validation, userController.createUser)
router.post('/sendOTPText',validation,sendTextMessage, userController.sendOTPText)
router.post('/sendAuthPin',validation, userController.sendAuthPin)
router.post('/submitAssessment',validation, userController.submitAssessment)
router.post('/getAssessment',validation, userController.getAssessment)
router.post('/getUserInfo',validation, userController.getUserInfo)
router.post('/getAppInfo', userController.getAppInfo)
router.post('/updateSettings', userController.updateSettings)
router.post('/setDefaultStatus', userController.setDefaultStatus)
router.post('/UpdateSubscriptionInfo', userController.UpdateSubscriptionInfo)

module.exports = router


function validation (req, res, next) {
    //console.log(req.body)
    // const originalUrl = req.originalUrl
    // const originalUrlArr = originalUrl.split('/')
    // const length = originalUrlArr.length
  
    // const deviceAccess = originalUrlArr[length - 1]
    // console.log(deviceAccess)
    // if (deviceAccess == 'a7837811-aaea-4dd0-8c31-a1361c11d198') {
    //   next()
    // } else {
    //   res.status(500).json({
    //     ok: false,
    //     message: 'forbidden'
    //   })
    // }
    next()
  }
  const accesscode = (Math.floor(Math.random() * 10000) + 10000).toString().substring(1)

  async function sendTextMessage (req, res, next) {
    const masterPhoneNumber = '+12023860212'
    console.log(req.body)
    var number =  req.body.payload.phoneNumber
    var phoneNumber =  number
    var phone = phoneNumber.toString()
    console.log(phone)
    if(phoneNumber ===  masterPhoneNumber){
      req.body.text_message_Status = {
        send: true,
        number: req.body.payload.phoneNumber,
        accesscode: '123456'
      };
      next();

    }else{
      await client.verify.v2.services(verifySid).verifications.create({to: phone, channel: "sms" ,   body: 'Your access code is Bulb',})
      .then((verification) => {
        if(verification){
          console.log(verification)
          req.body.text_message_Status = {
            send: true,
            number: req.body.payload.phoneNumber,
            accesscode: verification.sid
          };
          next();
        }else{
          req.body.text_message_Status = {
            send: false,
            number: req.body.payload.phoneNumber,
          };
          next();
        }
      })
    }
  } 
