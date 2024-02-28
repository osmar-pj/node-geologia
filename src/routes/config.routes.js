import express from 'express'

import { getConfiguration, createConfiguration, updateConfiguration } from '../controllers/config.controller.js'

const router = express.Router()

router.get('/config', getConfiguration)

router.post('/config', createConfiguration)

router.put('/config', updateConfiguration)

// router.delete('/config', deleteConfiguration)

export default router