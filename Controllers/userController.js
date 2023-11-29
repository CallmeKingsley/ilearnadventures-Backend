const UserModel = require('../Models/userModel')
const AppData  = require('../Models/appDataModel')
const DisplayModel  = require('../Models/displayMessage')
const SubjectModel = require('../Models/subjectModel')
const completedSessions = require('../Models/completedSessions')
const appleReceiptVerify = require('node-apple-receipt-verify');
const Assessmentdata  = require('../AssessmentDate.json')
const { Types } = require('mongoose')
const Vonage = require('@vonage/server-sdk')
const moment = require('moment');  
const { reset } = require('nodemon');
const mongoose = require('mongoose')
//new messager 
const accountSid = "AC988368334fc70b93e65ec467520edf77";
const authToken = '3e24dc99fad4fd5fe3c7647b3e7063cd';
const verifySid = "VA5d8903dcb67eaf1ad8dcb56fb3edbf5f";
const client = require('twilio')(accountSid, authToken);


// appleReceiptVerify.config({
//   secret: '2e1f7385d24a4f4ba36cc33b019279d9',
//   //environment: ['production'],
//   environment: ['sandbox'],
//   excludeOldTransactions: true,
// });

  // appleReceiptVerify.config({
  //   secret: '2e1f7385d24a4f4ba36cc33b019279d9',
  //   //environment: ['production'],
  //   environment: ['sandbox'],
  //   excludeOldTransactions: true,
  // });


const vonage = new Vonage({
      apiKey: "8ea96c57",
      apiSecret: "ZdIaCr3Ot4VyUGCf"
})

module.exports = {

  createUser: async (req, res) => {
    try {
     const UserInfo = await UserModel.findOneAndUpdate({ phoneNumber: req.body.payload.phoneNumber, isDeleted: false  }, { $set: { email: req.body.payload.email , userName: req.body.payload.userName, gradeLevel: req.body.payload.gradelevel }}, { new: true })
     const user = await UserModel.findOne({  phoneNumber: req.body.payload.phoneNumber, isDeleted: false }).populate({ path: 'userAssessments', model: 'completedSessionsSchemaModel' })
     res.status(200).json({
      message: "user Info",
      response: user,
      ok: true
    })
     console.log(UserInfo)
    } catch (e) {
      res.status(500).json({
        user: e,
        ok: false,
        message: 'could\'t update password'
      })
    }
  },

  sendOTPText: async (req, res) => {
    try {  
      const userInfo = await UserModel.findOne({ phoneNumber: req.body.payload.phoneNumber, isDeleted: false }).populate({ path: 'userAssessments', model: 'completedSessionsSchemaModel' })
     if(req.body.text_message_Status.send)
     { 
      if(userInfo && (userInfo.userName == 'New User')){
        res.status(200).json({
          message: "success user needs update",
          response: userInfo,
          ok: true
        })

      }else if(userInfo && userInfo.userName !== 'New User'){
        res.status(200).json({
          message: "success user account found",
          response: userInfo,
          ok: true
        })
      }else{
        const user = new UserModel({
          _id : new Types.ObjectId(), 
          userName: 'New User',
          phoneNumber: req.body.payload.phoneNumber,
          email: 'New User',
          platform: req.body.payload.platform,
          DeviceOS: req.body.payload.deviceOS,
          pin:  req.body.text_message_Status.accesscode,
          isSubscribe: false,
          studentGradeLevel: req.body.payload.gradelevel , 
          deviceId: req.body.payload.deviceId ,
          dark: false,
          sound: true,
          isDeleted: false,
          notification: true,
        })

        const newUser = await user.save()
        res.status(200).json({
            message: "success created user account",
            response: newUser,
            ok: true
        })
      }}else{
        res.status(200).json({
          message: "we have an issue ",
          response: newUser,
          ok: false
      })
      }

    } catch (e) {
      res.status(500).json({
        error: e
      })
    }
  },
  sendAuthPin: async (req, res) => {
    try {
      //  readline.question('Please enter the OTP:', otpCode => {
    //    client.verify.v2
    //      .services(verifySid)
    //      .verificationChecks.create({ to: "+12023860202", code: otpCode })
    //      .then((verification_check) => console.log(verification_check.status))
    //      .then(() => readline.close());
    //  });
       const masterPhoneNumber = '+12023860212'
        var number =  req.body.payload.phoneNumber
        var phoneNumber = number
        var phone = phoneNumber.toString()

         const userInfo = await UserModel.findOne({ phoneNumber: req.body.payload.phoneNumber, isDeleted: false   }).populate({ path: 'userAssessments', model: 'completedSessionsSchemaModel' })

         if(masterPhoneNumber == phone){
          res.status(200).json({
            message: "success found user account",
            ok: true,
            response: userInfo
          })
         }else{
         client.verify.v2.services(verifySid).verificationChecks.create({ to: phone, code: req.body.payload.pin })
         .then((verification_check) => {
            console.log('verification_check',verification_check)
            if(verification_check.valid){
              res.status(200).json({
                message: "success found user account",
                ok: true,
                response: userInfo
              })
            }else{
              res.status(200).json({
                message: "invalid pin",
                ok: false,
                response: userInfo
              })
            }
         })
         }
        
      
    } catch (e) {
      res.status(500).json({
        message: "try again later",
        ok: false,
        response: []
      })
    }
  },

  submitAssessment: async (req, res) => {
    const completedObj = new completedSessions({
      _id: new mongoose.Types.ObjectId(),
      courselevel: req.body.courselevel,
      userId: req.body.userId,
      data: req.body.data,
      date: req.body.date,
      displayName: req.body.displayName,
      gradelevel: req.body.gradelevel,
      id : req.body.id,
      month: req.body.month,
      name: req.body.name,
      subject: req.body.subject,
      isDeleted: 'false',
    })
    await completedObj.save()
    const userInfo = await UserModel.findOne({ _id: req.body.userId, isDeleted: false }).populate({ path: 'userAssessments', model: 'completedSessionsSchemaModel' })
    userInfo.curriculumKey = req.body.progressKey
    userInfo.userAssessments.unshift(completedObj)
    await userInfo.save()
    try {
        res.status(200).json({
            response: userInfo
        })
    } catch (e) {
      res.status(500).json({
        error: e
      })
    }
  },
  updateSettings: async (req, res) => {
    try {
      const key = req.body.payload.key
      const value = req.body.payload.value
       
      await UserModel.findOneAndUpdate({ _id: req.body.payload._id, isDeleted: false  }, { $set: {  [key] : value } }, { new: true })
      const userInfo = await UserModel.findOne({ _id: req.body.payload._id , isDeleted: false}).populate({ path: 'userAssessments', model: 'completedSessionsSchemaModel' })
      console.log(userInfo)
      res.status(200).json({
        message: "success uodate user account",
        response: userInfo,
        ok: true
      })
    } catch (e) {
      res.status(500).json({
        error: e
      })
    }
  },
  getAssessment: async (req, res) => {
     
    try {
         console.log(Assessmentdata)
        res.status(200).json({
            response: Assessmentdata
        })
    } catch (e) {
      res.status(500).json({
        error: e
      })
    }
  },
  deleteUserAccount: async (req, res) => {
    console.log(req.body)
    const id  = req.body._id.trim()
    try {
        await UserModel.findOneAndUpdate({ _id: id, isDeleted: false  }, { $set: {isDeleted: true  }}, { new: true }) 
        res.status(200).json({
            response: {user : "that user", instruction: 'deleted'}
        })
    } catch (e) {
      res.status(500).json({
        error: e
      })
    }
  },
  setDefaultStatus: async (req, res) => {
    const key = req.body.payload.key
    const value = req.body.payload.value
    const status = req.body.payload.status
    const id = req.body.payload._id 
    try {
      if(status){
        await DisplayModel.findOneAndUpdate({ _id:  id}, { $set: {  [key] : value } }, { new: true })
        res.status(200).json({
            response: true
        })
      }else{
        const userInfo = await UserModel.findOne({ _id: id, isDeleted: false})
        const temp = new DisplayModel({
          displayMessage: value,
          displayType: key
        })
        userInfo.defaultStatus.push(temp)
        userInfo.save()
      }
      
    } catch (e) {
      res.status(500).json({
        error: e
      })
    }
  },
  getUserInfo: async (req, res) => {
    try {
        //const userInfo = await UserModel.findOne({ _id: req.body._id }).populate({ path: 'completedSessions', model: 'completedSessionsSchemaModel' })
        const userInfo = await UserModel.findOne({ _id: req.body._id , isDeleted: false}).populate({ path: 'defaultStatus', model: 'displayModel' }).populate({ path: 'userAssessments', model: 'completedSessionsSchemaModel' })
        res.status(200).json({
            response: userInfo,
            message: 'user info'
        })
    } catch (e) {
      res.status(500).json({
        error: e
      })
    }
  },

  UpdateSubscriptionInfo: async (req, res) => {
    const id  = req.body.userInfo.id.trim()
    const receipt  = req.body.userInfo.receipt
    const shareSecret  = req.body.userInfo.shareSecret
    const graded  = req.body.userInfo.graded

    console.log('products ==>',receipt )
    if(graded){
      await appleReceiptVerify.config({
        secret: shareSecret,
        //environment: ['production'],
        environment: ['sandbox'],
        excludeOldTransactions: true,
      });
    }else{
      await appleReceiptVerify.config({
        secret: '447141944bcc4beaa1f1e5a3632f594f',
        environment: ['production'],
        //environment: ['sandbox'],
        excludeOldTransactions: true,
      });
    }

    try {
      const products = await appleReceiptVerify.validate({
        excludeOldTransactions: true,
        receipt: receipt
      });

      console.log('products',products )
      if(products.length > 0){
        const expirationDate = moment(products[0].expirationDate).format("DD MMM YYYY hh:mm a")
        const user  = await UserModel.findOneAndUpdate({ _id: id , isDeleted: false}, { $set: {subscriptionType: products[0].transactionId, subscriptionDate: expirationDate, subscriptionReceipt: products[0].productId,  isSubscribe: true}}, {
          new: true
        }).populate({ path: 'userAssessments', model: 'completedSessionsSchemaModel' })
        res.status(200).json({
          ok: true,
          user
        })
      }else{
        const userInfo = await UserModel.findOne({ _id: id , isDeleted: false}).populate({ path: 'userAssessments', model: 'completedSessionsSchemaModel' })
        if(userInfo.freeTrialActive){
          const user = userInfo
          res.status(200).json({
            ok: true,
            user
          })
        }else{
          const user  = await UserModel.findOneAndUpdate({  _id: id , isDeleted: false}, { $set: {isSubscribe: false}}, {
            new: true
          }).populate({ path: 'userAssessments', model: 'completedSessionsSchemaModel' })
          res.status(200).json({
            ok: true,
            user
          })
        }

        
      }
  
    } catch (e) {
      console.log(e)
      res.status(500).json({
        ok: false,
        message: 'issue getting errors',
        error: e
      })
    }
  },
  getAppInfo: async (req, res) => {
    try {
       // const appInfo = await AppData.findOne({ _id: req.body._id }).populate({ path: 'displayMessage', model: 'displayModel' }).populate({ path: 'subjects', model: 'subjectModel' })
       const appInfo = await AppData.findOne({ _id: req.body._id })
        const Data = {
          appInfo,
          assessmentData: Assessmentdata
        }
        res.status(200).json({
            response: Data,
            message: 'app info'
        })
    } catch (e) {
      res.status(500).json({
        error: e
      })
    }
  }
}