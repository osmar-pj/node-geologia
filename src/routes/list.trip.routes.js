import express from 'express'

import * as listTripCtrl from '../controllers/ListTripController.js'

const router = express.Router()

router.get('/triplist', listTripCtrl.getAllListTrip)  // Orecontrol
router.get('/triplist/:travel_Id', listTripCtrl.getListTrip)

router.get('/qualitycontrol', listTripCtrl.getListTripQualityControl)  // Calidad
router.get('/general', listTripCtrl.getListTripGeneral) // Lista general

router.post('/triplist', listTripCtrl.createListTrip)

router.put('/triplist/:travel_Id', listTripCtrl.updateListTrip)
router.put('/triplist/:travel_Id/qualitycontrol', listTripCtrl.updateManyTrip)
router.delete('/triplist/:travel_Id', listTripCtrl.deleteListTrip)

export default router