import express from 'express'

import { getAllTajoGeology } from '../controllers/TajoGeologyController.js'

const router = express.Router()

router.get('/tajoGeo', getAllTajoGeology)

export default router