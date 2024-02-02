import express from 'express'

import * as pilaCtrl from '../controllers/pila.controller.js'

const router = express.Router()

// Lista todas las rumas
router.get('/pila', pilaCtrl.getAllPilas)

// Lista una Pila
router.get('/pila/:pila_Id', pilaCtrl.getPila)

// Crea una nueva Pila
router.post('/pila', pilaCtrl.createPila)

// Actualiza una Pila
router.put('/pila/:pila_Id', pilaCtrl.updatePila)

// Elimina una Pila
router.delete('/pila/:pila_Id', pilaCtrl.deletePila)

export default router