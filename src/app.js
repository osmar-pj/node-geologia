import http from 'http'
import express from 'express'
import morgan from 'morgan'
import bodyParser from 'body-parser'
import socket from './socket.js'
import './database/db.js'
import cors from 'cors'

import { config } from 'dotenv'
config()

import { generateTajo, generateTrip, generateRumas } from './libs/generateDates.js'
generateTajo()
generateTrip()
generateRumas()

import listTripRoutes from './routes/list.trip.routes.js'
import rumaRoutes from './routes/ruma.routes.js'
import tajoGeologyRoutes from './routes/tajo.geology.routes.js'
import authRoutes from './routes/auth.routes.js'

import dataRoutes from './routes/data.routes.js'

const app = express()

const corsOptions = {
    origin: '*'
    // origin: process.env.ORIGIN_URL_CLIENT
}

app.use(bodyParser.json({limit: '2gb', extended: true}))
app.use(morgan('dev'))
app.use(cors(corsOptions))
app.use(express.json())

const routes = [
    listTripRoutes,
    rumaRoutes,
    tajoGeologyRoutes,
    authRoutes,
    dataRoutes
]

app.use('/', routes)

app.get('/', (req, res) => {
    res.send({message : 'Welcome to the API GEOLOGY'})
})

const httpServer = http.createServer(app)
socket.connect(httpServer)
httpServer.listen(process.env.PORT)

// app.listen(process.env.PORT, () => {
//     console.log('Server up running')
// })