import mongoose from 'mongoose'
import AutoIncrementFactory from 'mongoose-sequence'

import { config } from 'dotenv'
config()

const db = mongoose.connect(process.env.MONGO_URL, {
    // auth: {
    //     username: process.env.MONGO_USER,
    //     password: process.env.MONGO_PASS
    // },
    // authSource: 'admin'
})
.then(() => {
    console.log('Connected to BD')
})
.catch((error) => {
    console.error('Error al conectar a la base de datos:', error)
})

const AutoIncrement = AutoIncrementFactory(mongoose)

export default {db, AutoIncrement}