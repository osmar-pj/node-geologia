import express from 'express'

import { getPrograms, createProgram, updateProgram, deleteProgram } from '../controllers/program.controller.js'

const router = express.Router()

router.get('/program', getPrograms)

router.post('/program', createProgram)

router.put('/program', updateProgram)

router.delete('/program', deleteProgram)

export default router