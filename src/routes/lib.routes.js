import express from 'express'

import * as helpCtrl from '../controllers/lib.controller.js'

const router = express.Router()

// Lista todas las rumas
router.post('/csv', helpCtrl.csvAnalysis)

export default router