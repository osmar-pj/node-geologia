import express from 'express'

import { getProgramsCancha, getProgramsPlanta, createProgram, updateProgram, deleteProgram, createProgramPlanta } from '../controllers/program.controller.js'

const router = express.Router()

router.get('/program/cancha', getProgramsCancha)
router.get('/program/planta', getProgramsPlanta)

router.post('/program', createProgram)
router.post('/program/planta', createProgramPlanta)

router.put('/program', updateProgram)

router.delete('/program', deleteProgram)

export default router