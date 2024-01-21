import express from 'express'

import { getAllListTrip, createListTrips, getListGeology, getGroup } from '../controllers/data.controller.js'

const router = express.Router()

router.get('/geology', getAllListTrip)

router.post('/geology', createListTrips)

router.get('/listgeology', getListGeology)

router.post('/listgeology', getGroup)

export default router