import http from 'http'
import express from 'express'
import morgan from 'morgan'
import bodyParser from 'body-parser'
import socket from './socket.js'
import './database/db.js'
import cors from 'cors'

import { config } from 'dotenv'
config()

import { generateTajo, generateTrip, generateRumas, generateTripsPlanta, generateConfig } from './libs/generateDates.js'
// generateTajo()
generateTrip()
generateRumas()
generateTripsPlanta()
generateConfig()

import tripRoutes from './routes/trip.routes.js'
import pilaRoutes from './routes/pila.routes.js'
import tajoRoutes from './routes/tajo.routes.js'
import authRoutes from './routes/auth.routes.js'
import dataRoutes from './routes/data.routes.js'
import plantaRoutes from './routes/planta.routes.js'
import confiRoutes from './routes/config.routes.js'
import programRoutes from './routes/program.routes.js'

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
    tripRoutes,
    pilaRoutes,
    tajoRoutes,
    authRoutes,
    dataRoutes,
    plantaRoutes,
    confiRoutes,
    programRoutes
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