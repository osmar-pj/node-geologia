import express from 'express'

import * as tajoCtrl from '../controllers/tajo.controller.js'

const router = express.Router()

router.get('/tajo', tajoCtrl.getAllTajo)

export default router