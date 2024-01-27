import express from 'express'

import { getAllListTrip, createListTrips, getListGeology, getGroup, getDataAnalysis } from '../controllers/data.controller.js'

const router = express.Router()

router.get('/geology', getAllListTrip)

router.post('/geology', createListTrips)

router.post('/listgeology', getGroup) // List

router.get('/analysis', getDataAnalysis)

export default router