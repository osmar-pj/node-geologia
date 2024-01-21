import express from 'express'
import morgan from 'morgan'
import bodyParser from 'body-parser'

import './database/db.js'

import cors from 'cors'

import { config } from 'dotenv'
config()

import { generateTajo } from './libs/generateDates.js'
generateTajo()

import listTripRoutes from './routes/list.trip.routes.js'
import rumaRoutes from './routes/ruma.routes.js'
import tajoGeologyRoutes from './routes/tajo.geology.routes.js'
import authRoutes from './routes/auth.routes.js'

import dataRoutes from './routes/data.routes.js'

const app = express()

const corsOptions = {
    origin: '*'
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

app.listen(process.env.PORT, () => {
    console.log('Server up running')
})