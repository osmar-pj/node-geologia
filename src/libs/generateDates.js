import { readFileSync } from 'fs'
import PilaModel from '../models/PilaModel.js'
import TripModel from '../models/TripModel.js'
import TajoModel from '../models/TajoModel.js'
import PlantaModel from '../models/PlantaModel.js'

export const generateTajo = async (req, res) => {
    try {
        const count = await TajoModel.estimatedDocumentCount()
        
        if (count == 0) {
            const data = await readFileSync('src/libs/tajos.json', 'utf-8')
            const tajosData = JSON.parse(data)
            const tajos = tajosData.map((item, index) => {
                return {
                    tajoId: index + 1,
                    name: item.tajo,
                    valid: true,
                    level: item.level,
                    veta: item.veta,
                    mineral: item.mineral,
                    zona: item.zona
                }
            })
            await TajoModel.insertMany(tajos)
            console.log('TAJOS SAVED')

        }
    }
    catch (error) {
        res.json({ message: error.message })
    }
}

export const generateTrip = async (req, res) => {
    try {
        const count = await TripModel.estimatedDocumentCount()
        if (count == 0) {
            const data = await readFileSync('src/libs/canchas.json', 'utf-8')
            const trips = JSON.parse(data)
            for (let i = 0; i < trips.length; i++) {
                const newTrip = await new TripModel(trips[i])
                newTrip.history = [{work: 'CREATE from client', date: new Date(), user: 'System'}]
                newTrip.statusTrip = newTrip.status == 'Cancha' ? 'waitBeginDespacho' : 'Finalizado'
                newTrip.statusMina = 'Completo'
                newTrip.splitRequired = false
                await newTrip.save()
            }
            console.log('TRIPS SAVED')
        }
    } catch (error) {
        
    }
}

export const generateRumas = async (req, res) => {
    try {
        const count = await PilaModel.estimatedDocumentCount()
        if (count == 0) {
            const data = await readFileSync('src/libs/pilas2.json', 'utf-8')
            const pilas = JSON.parse(data)
            
            for (let i = 0; i < pilas.length; i++) {
                const newPila = await new PilaModel(pilas[i])
                newPila.pila = newPila.cod_tableta
                newPila.cod_tableta = newPila.cod_tableta
                newPila.samples = [{Muestra: ''}]
                newPila.typePila = 'Pila' // Change to StockPile
                newPila.statusPila = newPila.status == 'Cancha' ? 'waitBeginDespacho' : 'Finalizado'
                newPila.history = [{work: 'CREATE from client', date: new Date(), user: 'System'}]
                newPila.statusBelong = 'No Belong'
                newPila.stock = newPila.tonh
                newPila.x = 20
                newPila.y = 20
                newPila.native = 'CIA'
                await newPila.save()
            }
            console.log('PILAS SAVED')
            // Create 4 gibas called G1, G2, G3, G4
            const gibas = [
                { name: 'G1' },
                { name: 'G2' },
                { name: 'G3' },
                { name: 'G4' }
            ]
            const gibasSaved = gibas.forEach(async (giba, index) => {
                const newPila = await new PilaModel(giba)
                newPila.pila = giba.name
                newPila.mining = 'UCHUCCHACUA',
                newPila.ubication = 'Cancha 2'
                newPila.samples = []
                newPila.typePila = 'Giba'
                newPila.statusPila = 'Acumulando'
                newPila.history = [{work: 'CREATE gibas en cero', date: new Date(), user: 'System'}]
                newPila.statusBelong = 'No Belong'
                newPila.x = 50
                newPila.y = 50
                newPila.native = 'CIA'
                newPila.stock = 0
                newPila.tonh = 0
                newPila.ton = 0
                
                await newPila.save()
            })
            console.log('GIBAS SAVED')
        }
    }
    catch (error) {
        res.json({ message: error.message })
    }
}

export const generateTripsPlanta = async (req, res) => {
    try {
        const count = await PlantaModel.estimatedDocumentCount()

        if (count == 0) {
            const data = await readFileSync('src/libs/planta.json', 'utf-8')
            const trips = JSON.parse(data)
            const tripPromises = trips.map(async trip => {
                const newTrip = await new PlantaModel(trip)
                newTrip.dominio = [trip.dominio]
                newTrip.tajo = [trip.tajo]
                newTrip.zona = [trip.zona]
                newTrip.veta = [trip.veta]
                newTrip.timestamp = trip.date/1000
                newTrip.dateCreatedAt = trip.date
                newTrip.nro_month = new Date(trip.date).getMonth() + 1
                newTrip.statusMina = 'Completo'
                newTrip.validMina = true
                return newTrip.save()
            })
            const result = await Promise.all(tripPromises)
            console.log('TRIPS PLANTA SAVED')
        }
    } catch (error) {
        
    }
}