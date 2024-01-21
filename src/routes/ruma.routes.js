import express from 'express'

import { getAllRumas, getListRumas, getRuma, createRuma, updateRuma, deleteRuma, updateOrCreateRumas } from '../controllers/RumaController.js'

const router = express.Router()

// Lista todas las rumas
router.get('/ruma', getAllRumas)

// Lista una ruma
router.get('/ruma/:ruma_Id', getRuma)

// Crea una nueva ruma
router.post('/ruma', createRuma)

// Actualiza una ruma
router.put('/ruma/:ruma_Id', updateRuma)

// Elimina una ruma
router.delete('/ruma/:ruma_Id', deleteRuma)

// Lista las rumas para poder unirlas
router.get('/rumalist', getListRumas)

// Actualiza y crea una nueva ruma
router.post('/updateruma', updateOrCreateRumas)

export default router