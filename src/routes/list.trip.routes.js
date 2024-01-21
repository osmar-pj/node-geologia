import express from 'express'

import { getAllListTrip, getListTrip, getListTripQualityControl, getListTripGeneral, createListTrip, updateListTrip, deleteListTrip } from '../controllers/ListTripController.js'

const router = express.Router()

router.get('/triplist', getAllListTrip)
router.get('/triplist/:travel_Id', getListTrip)

router.get('/qualitycontrol', getListTripQualityControl)
router.get('/general', getListTripGeneral)

router.post('/triplist', createListTrip)

router.put('/triplist/:travel_Id', updateListTrip)
router.delete('/triplist/:travel_Id', deleteListTrip)

export default router