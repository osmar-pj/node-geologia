import express from 'express'

import * as tajoCtrl from '../controllers/tajo.controller.js'

const router = express.Router()

router.get('/tajo', tajoCtrl.getAllTajo)

router.post('/tajo', tajoCtrl.createTajo)

router.put('/tajo/:tajoId', tajoCtrl.updateTajo)

export default router