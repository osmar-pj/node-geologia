import { readFileSync } from 'fs'
import PilaModel from '../models/PilaModel.js'
import TripModel from '../models/TripModel.js'
import TajoModel from '../models/TajoModel.js'

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
            const data = await readFileSync('src/libs/main.json', 'utf-8')
            const trips = JSON.parse(data)
            for (let i = 0; i < trips.length; i++) {
                const newTrip = await new TripModel(trips[i])
                newTrip.statusTrip = newTrip.status == 'Cancha' ? 'Muestreado' : 'Despachando'
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
            const data = await readFileSync('src/libs/pila.json', 'utf-8')
            const pilas = JSON.parse(data)
            for (let i = 0; i < pilas.length; i++) {
                const newPila = await new PilaModel(pilas[i])
                newPila.pila = newPila.cod_tableta
                newPila.cod_tableta = newPila.cod_tableta
                newPila.samples = [{Muestra: ''}]
                newPila.typePila = 'Pila'
                newPila.statusPila = newPila.status == 'Cancha' ? 'Muestreado' : 'Despachado'
                newPila.actionPila = newPila.status == 'Cancha' ? 'Muestreado' : 'Listo para despachar'
                newPila.statusBelong = 'No Belong'
                newPila.x = 100
                newPila.y = 50
                newPila.native = 'CIA'
                newPila.stock = newPila.tonh
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
                newPila.samples = [{Muestra: ''}]
                newPila.typePila = 'Giba'
                newPila.statusPila = 'Creado'
                newPila.actionPila = 'Acumulando'
                newPila.statusBelong = 'No Belong'
                newPila.x = 120
                newPila.y = 70
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
