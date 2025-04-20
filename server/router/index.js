const express = require('express')
const { vcController } = require('../controller')
const router = express.Router()

router.post('/getToken', vcController.getToken)

module.exports = router