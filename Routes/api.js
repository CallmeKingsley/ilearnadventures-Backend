const express = require('express')
const router = express.Router()

const todoRoutes = require('./todoRoutes')

router.use('/access', todoRoutes)

module.exports = router
