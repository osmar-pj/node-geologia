import express from 'express'

import * as plantaCtrl from '../controllers/planta.controller.js'

const router = express.Router()

router.get('/planta', plantaCtrl.getPlantaList)
router.get('/planta/:planta_Id', plantaCtrl.getPlanta)
router.post('/planta/filtered', plantaCtrl.getListFiltered)
router.post('/planta', plantaCtrl.createPlanta)
router.put('/planta/:planta_Id', plantaCtrl.updatePlanta)
router.delete('/planta/:planta_Id', plantaCtrl.deletePlanta)

export default router