import { readFileSync } from 'fs'
import RumaModel from '../models/RumaModel.js'
import ListTripModel from '../models/ListTripModel.js'
import TajoGeologyModel from '../models/TajoGeologyModel.js'

export const generateTajo = async (req, res) => {
    try {
        const count = await TajoGeologyModel.estimatedDocumentCount()

        if (count == 0) {

            const tajosData = [
                { name: 'TJ6383', valid: 1 },
                { name: 'TJ6430', valid: 1 },
                { name: 'TJ6431', valid: 1 },
                { name: 'TJ6431-1', valid: 1 },
                { name: 'TJ6432', valid: 1 },
                { name: 'TJ6432-1', valid: 1 },
                { name: 'TJ6488', valid: 1 },
                { name: 'TJ6490-1', valid: 1 },
                { name: 'TJ6506', valid: 1 },
                { name: 'TJ6507', valid: 1 },
                { name: 'TJ6508', valid: 1 },
                { name: 'TJ6543', valid: 1 },
                { name: 'TJ6544', valid: 1 },
                { name: 'TJ6608', valid: 1 },
                { name: 'TJ6609', valid: 1 },
                { name: 'TJ6613', valid: 1 },
                { name: 'TJ6614', valid: 1 },
                { name: 'TJ6618', valid: 1 },
                { name: 'TJ6660', valid: 1 },
                { name: 'TJ6662', valid: 1 },
                { name: 'TJ6790', valid: 1 },
                { name: 'TJ7090', valid: 1 },
                { name: 'TJ7090-1', valid: 1 },
                { name: 'TJ7390', valid: 1 },
                { name: 'TJ7392', valid: 1 },
                { name: 'TJ7393', valid: 1 }
            ];

            const tajos = tajosData.map((tajo, index) => {
                return {
                    tajoId: index + 1,
                    name: tajo.name,
                    valid: tajo.valid
                }
            })

            await TajoGeologyModel.insertMany(tajos)

        }
    }
    catch (error) {
        res.json({ message: error.message })
    }
}

export const generateTrip = async (req, res) => {
    try {
        const count = await ListTripModel.estimatedDocumentCount()
        if (count == 0) {
            const data = await readFileSync('src/libs/main.json', 'utf-8')
            const trips = JSON.parse(data)
            for (let i = 0; i < trips.length; i++) {
                const newTrip = await new ListTripModel(trips[i])
                newTrip.statusGeology = 'General'
                newTrip.statusMina = 'Completo'
                newTrip.validMina = true
                newTrip.validGeology = true
                // newTrip.tonh = newTrip.ton / newTrip.n_travels
                await newTrip.save()
            }
            console.log('TRIPS SAVED')
        }
    } catch (error) {
        
    }
}

export const generateRumas = async (req, res) => {
    try {
        const count = await RumaModel.estimatedDocumentCount()
        if (count == 0) {
            const data = await readFileSync('src/libs/ruma.json', 'utf-8')
            const ruma = JSON.parse(data)
            for (let i = 0; i < ruma.length; i++) {
                const newRuma = await new RumaModel(ruma[i])
                newRuma.ruma_Id = newRuma.cod_tableta
                newRuma.statusBelong = 'Single'
                newRuma.statusTransition = 'Cancha Muestreo'
                newRuma.valid = false
                newRuma.x = 100
                newRuma.y = 50
                newRuma.native = 'CIA'
                await newRuma.save()
            }
            console.log('RUMAS SAVED')
        }
    }
    catch (error) {
        res.json({ message: error.message })
    }
}
