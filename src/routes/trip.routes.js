import express from 'express'

import * as tripCtrl from '../controllers/trip.controller.js'

const router = express.Router()

router.get('/orecontrol', tripCtrl.getOreControlList)  // Orecontrol
router.get('/trip/:travel_Id', tripCtrl.getListTrip)

router.get('/qualitycontrol', tripCtrl.getListTripQualityControl)  // Calidad
router.post('/listGeneral', tripCtrl.getListTripGeneral) // Lista general

router.post('/trip', tripCtrl.createListTrip)

router.put('/trip/:travel_Id', tripCtrl.updateListTrip)
router.put('/trip/:travel_Id/qualitycontrol', tripCtrl.updateManyTrip)
router.delete('/trip/:travel_Id', tripCtrl.deleteListTrip)

export default router