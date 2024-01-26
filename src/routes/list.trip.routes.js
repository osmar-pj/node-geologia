import express from 'express'

import { getAllListTrip, getListTrip, getListTripQualityControl, getListTripGeneral, createListTrip, updateListTrip, deleteListTrip } from '../controllers/ListTripController.js'

const router = express.Router()

router.get('/triplist', getAllListTrip)  // Orecontrol
router.get('/triplist/:travel_Id', getListTrip)

router.get('/qualitycontrol', getListTripQualityControl)  // Calidad
router.get('/general', getListTripGeneral) // Lista general

router.post('/triplist', createListTrip)

router.put('/triplist/:travel_Id', updateListTrip)
router.delete('/triplist/:travel_Id', deleteListTrip)

export default router