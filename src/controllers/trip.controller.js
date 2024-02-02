import TripModel from '../models/TripModel.js'
import PilaModel from '../models/PilaModel.js'
import TajoModel from '../models/TajoModel.js'

const socket = require('../socket.js').socket

export const getListTrip = async (req, res) => {
    try {
        const travel_Id = req.params.travel_Id
        const trips = await TripModel.findOne({_id: travel_Id})
        if(!trips) {
            return res.status(200).json({ status: false, message: 'List Trip not found' })
        }
        return res.status(200).json(trips)
    } catch (error) {
        res.json({ message: error.message });
    }
}

// ORE CONTROL
export const getOreControlList = async (req, res) => {
    try {
        const trips = await TripModel.find({$or : [{statusGeology: 'OreControl'}, {statusGeology: 'Giba'}], validGeology: true})
        if (!trips) {
            return res.status(404).json({ message: 'Ore Control sin pendientes' })
        }
        
        const header = [
            { title: 'Id', field: '_id', fn: '', und: '' },
            { title: 'Año', field: 'year', fn: '', und: '' },
            { title: 'Mes', field: 'month', fn: '', und: '' },
            { title: 'Fecha', field: 'date', fn: 'date', und: '' },
            { title: 'Estado', field: 'status', fn: '', und: '' },
            { title: 'Ubicación', field: 'ubication', fn: 'arr', und: '' },
            { title: 'Turno', field: 'turn', fn: '', und: '' },
            { title: 'Vagones', field: 'vagones', fn: '', und: '' },
            { title: 'Mina', field: 'mining', fn: '', und: '' },
            { title: 'Nivel', field: 'level', fn: '', und: '' },
            { title: 'Veta', field: 'veta', fn: '', und: '' },
            { title: 'Tipo', field: 'type', fn: '', und: '' },
            { title: 'Tajo', field: 'tajo', fn: '', und: '' },
            { title: 'Dominio', field: 'dominio', fn: 'arr', und: '' }
        ]
        return res.status(200).json({status: true, data: trips, header: header});
    } catch (error) {
        res.json({ message: error.message });
    }
};

// CONTROL CALIDAD
export const getListTripQualityControl = async (req, res) => {
    try {
        // const pilas = await PilaModel.find({status: 'Muestreo'})
        const pilas = await PilaModel.find({}).sort({createdAt: -1})
        // console.log(pilas[0])
        if(!pilas) {
            return res.status(404).json({ message: 'Control calidad sin pendientes' })
        }
        const header = [
            // { title: 'Año', field: 'year', fn: '', und: '' },
            // { title: 'Mes', field: 'month', fn: '', und: '' },
            // { title: 'Fecha', field: 'date', fn: '', und: '' },
            // { title: 'Estado', field: 'status', fn: '', und: '' },
            { title: 'Mina', field: 'mining', fn: '', und: '' },
            { title: 'Ubicación', field: 'ubication', fn: '', und: '' },
            { title: 'Pila', field: 'pila', fn: '', und: '' },
            { title: 'Viajes', field: 'travels', fn: 'count', und: '' }, // contar el array para tener los viaje
            { title: 'Tajo', field: 'tajo', fn: 'arr', und: '' },
            { title: 'Dominio', field: 'dominio', fn: '', und: '' },
            { title: 'Cod. Tableta', field: 'cod_tableta', fn: '', und: '' },
            { title: 'Cod. Despacho', field: 'cod_despacho', fn: '', und: '' },

            { title: 'Stock mineral', field: 'stock', fn: 'fixed', und: 'TMH' },
            { title: 'Ton. Total', field: 'tonh', fn: 'fixed', und: 'TMH' },
            { title: 'Ley', field: 'ley_ag', fn: 'fixed', und: '' },
            { title: 'Ley', field: 'ley_fe', fn: 'fixed', und: '' },
            { title: 'Ley', field: 'ley_mn', fn: 'fixed', und: '' },
            { title: 'Ley', field: 'ley_pb', fn: 'fixed', und: '' },
            { title: 'Ley', field: 'ley_zn', fn: 'fixed', und: '' },
            // { title: 'Ton*Ley', field: 'tmh_ag', fn: 'fixed', und: '' }
        ]

        return res.status(200).json({status: true, data: pilas, header: header})
    } catch (error) {
        res.json({ message: error.message });
    }
}
// GENERAL LIST
export const getListTripGeneral = async (req, res) => {
    try {
        const trips = await TripModel.find({validGeology: true}).sort({createdAt: -1}).limit(20)
        if(!trips) {
            return res.status(404).json({ message: 'Trip not found' })
        }
        const data = trips
        const filtered = req.body.arr
        const columns = [
            { title: 'Id', field: '_id', fn: '', und: '' },
            { title: 'Año', field: 'year', fn: '', und: '' },
            { title: 'Mes', field: 'month', fn: '', und: '' },
            { title: 'Fecha', field: 'date', fn: 'date', und: '' },
            { title: 'Estado', field: 'status', fn: '', und: '' },
            { title: 'Ubicación', field: 'ubication', fn: 'arr', und: '' },
            { title: 'Pila', field: 'pila', fn: '', und: '' },
            { title: 'Tableta', field: 'cod_tableta', fn: '', und: '' },
            { title: 'Turno', field: 'turn', fn: '', und: '' },
            { title: 'Status', field: 'statusGeology', fn: '', und: '' },
            { title: 'Mina', field: 'mining', fn: '', und: '' },
            { title: 'Nivel', field: 'level', fn: '', und: '' },
            { title: 'Tipo', field: 'type', fn: '', und: '' },
            { title: 'Veta', field: 'veta', fn: '', und: '' },
            { title: 'Tajo', field: 'tajo', fn: '', und: '' },
            { title: 'Dominio', field: 'dominio', fn: 'arr', und: '' },
            { title: 'Rango', field: 'rango', fn: '', und: '' },
            { title: 'Fecha de abastecimiento', field: 'date_abas', fn: 'date', und: '' }
        ]
        
        const staticColumns = [
            // { title: 'Ton', field: 'ton', fn: 'fixed', und: 'TM' },
            { title: 'Tonh', field: 'tonh', fn: 'fixed', und: 'TMH' },
            { title: 'Ley Ag', field: 'ley_ag', fn: 'fixed', und: '' },
            { title: 'Ley Fe', field: 'ley_fe', fn: 'fixed', und: '' },
            { title: 'Ley Mn', field: 'ley_mn', fn: 'fixed', und: '' },
            { title: 'Ley Pb', field: 'ley_pb', fn: 'fixed', und: '' },
            { title: 'Ley Zn', field: 'ley_zn', fn: 'fixed', und: '' }
        ];

        const filterColumns = columns.filter((col) => filtered.includes(col.field));
        const orderColumns = filtered.map((item) => filterColumns.find((col) => col.field === item));
        
        if (filtered.length === 0) {
            const header = [...columns, ...staticColumns]
            return res.status(200).json({status: true, data: data, header: header});
        } else {
            const header = [...orderColumns, ...staticColumns];
            return res.status(200).json({status: true, data: data, header: header});
        }
    } catch (error) {
        res.json({ message: error.message });
    }
}

export const createListTrip = async (req, res) => {
    try {
        const trips = req.body
        for (let i = 0; i < trips.length; i++) {
            const trip = trips[i]
            const newTrip = await new TripModel(trip)
            const tripSaved = await newTrip.save()
            socket.io.emit('OreControl', tripSaved)
            const carriage = trip.carriage
            if (carriage == 'Vagones') {
                const isSplitRequired = trip.splitRequired
                if (!isSplitRequired) {
                    const tripId = tripSaved._id
                    const giba = trip.pila
                    const tonh = trip.tonh
                    const pila = await PilaModel.findOne({pila: giba})
                    pila.travels = [...pila.travels, tripId]
                    pila.stock = pila.stock + tonh
                    pila.tonh = pila.tonh + tonh
                    pila.ton = pila.ton + tonh * 0.94
                    const pilaUpdated = await PilaModel.findOneAndUpdate({_id: pila._id}, {stock: pila.stock, tonh: pila.tonh, ton: pila.ton, travels: pila.travels}, {new: true})
                    socket.io.emit('pilas', [pilaUpdated])
                }
            }
        }
        return res.status(200).json({ status: true, message: 'Trips created successfully' })
    } catch (error) {
        res.json({ message: error.message })
    }
}

export const updateListTrip = async (req, res) => {
    // SE ACTUALIZA EL TRIP PERO TAMBIEN LA PILA PARA LA DINAMICA DE STOCK
    try {
        const travel_Id = req.params.travel_Id
        const trip = await TripModel.findOne({_id: travel_Id})
        if(!trip) {
            return res.status(200).json({ status: false, message: 'Trip not found' })
        }
        const data = req.body
        const isCamion = trip.carriage === 'Camion'
        const isSplitRequired = trip.splitRequired
        if (isCamion) {
            // ACTUALIZAR TRIP CAMION
            for (let i = 0; i < data.length; i++) {
                const tajo = await TajoModel.findOne({name: data[i].tajo})
                data[i].statusTrip = 'Actualizado'
                data[i].veta = tajo ? tajo.veta : "V_CACHIPAMPA"
                data[i].level = tajo ? tajo.level : 3920
                const tripUpdate = await TripModel.findOneAndUpdate({_id: travel_Id}, data[i], {new: true})
                socket.io.emit('OreControl', tripUpdate)
                const pila = await PilaModel.findOne({pila: data[i].pila})
                const tripId = tripUpdate._id
                pila.travels = [...pila.travels, tripId]
                pila.stock = pila.stock + trip.tonh
                pila.tonh = pila.tonh + trip.tonh
                pila.ton = pila.ton + trip.tonh * 0.94
                const pilaUpdated = await PilaModel.findOneAndUpdate({_id: pila._id}, {stock: pila.stock, tonh: pila.tonh, ton: pila.ton, travels: pila.travels}, {new: true})
                // console.log('CAMION PILA UPDATED', pilaUpdated)
                socket.io.emit('pilas', [pilaUpdated])
            }
            // console.log('UPDATED MANY', tripUpdated)
            console.log('CAMION TRIP UPDATED')
            return res.status(200).json({ status: true, message: 'Trip camion updated' })
        }

        if (isSplitRequired) {
            // CREATE TRIP
            let newTrips = []
            for (let i = 0; i < data.length; i++) {
                const tajo = await TajoModel.findOne({name: data[i].tajo})
                const newTrip = await new TripModel(data[i])
                newTrip.statusTrip = 'Actualizado'
                newTrip.splitRequired = false
                newTrip.level = tajo ? tajo.level : null
                newTrip.veta = tajo ? tajo.veta : null
                newTrip.zone = tajo ? tajo.zone : null
                newTrip.code = trip.code
                newTrip.month = trip.month
                newTrip.year = trip.year
                newTrip.date = trip.date
                newTrip.status = trip.status
                newTrip.ubication = trip.ubication
                newTrip.turn = trip.turn
                newTrip.mining = trip.mining
                newTrip.operator = trip.operator
                newTrip.tag = trip.tag
                newTrip.contract = trip.contract
                newTrip.nro_month = trip.nro_month
                newTrip.timestamp = trip.timestamp
                newTrip.carriage = trip.carriage
                newTrip.tonh = data[i].vagones * 8
                newTrip.ton = data[i].vagones * 8 * 0.94
                const tripSaved = await newTrip.save()
                newTrips.push(tripSaved)
                socket.io.emit('OreControl', tripSaved)
            }
           
            const tripUpdatedFalse = await TripModel.findOneAndUpdate({_id: travel_Id}, {validGeology: false, splitRequired: false, statusGeology: 'Splitted', trips: newTrips.map(i => i._id) }, {new: true})
            socket.io.emit('RemoveList', tripUpdatedFalse)
            // UPDATE PILA
            const pilasToUpdate = await newTrips.map(async (i) => {
                const pila = await PilaModel.findOne({pila: i.pila})
                const tripId = i._id
                pila.travels = [...pila.travels, tripId]
                pila.stock = pila.stock + i.tonh
                pila.tonh = pila.tonh + i.tonh
                pila.ton = pila.ton + i.tonh * 0.94
                const pilaUpdated = await PilaModel.findOneAndUpdate({_id: pila._id}, {stock: pila.stock, tonh: pila.tonh, ton: pila.ton, travels: pila.travels}, {new: true})
                return pilaUpdated
            })
            const pilasUpdated = await Promise.all(pilasToUpdate)
            // console.log('SPLITREQUIRED PILAS UPDATED', pilasUpdated)
            socket.io.emit('pilas', pilasUpdated)
            return res.status(200).json({ status: true, message: 'Trip updated'})
        }

        if (!isCamion && !isSplitRequired) {
            const promiseTrips = data.map(async (i) => {
                const tajo = await TajoModel.findOne({name: i.tajo})
                i.statusTrip = 'Actualizado'
                i.level = tajo ? tajo.level : 3920
                i.veta = tajo ? tajo.veta : "V_CACHIPAMPA"
                i.zone = tajo ? tajo.zone : "Socorro Bajo"
                const tripUpdated = await TripModel.findOneAndUpdate({_id: travel_Id}, i, {new: true})
                return tripUpdated
            })
            const tripUpdate = await Promise.all(promiseTrips)
            // console.log('UPDATED not MANY', tripUpdate)
            // NO SE ACTUALIZA LA PILA
            return res.status(200).json({ status: true, message: 'Trip updated', data: tripUpdate })
        }
    } catch (error) {
        res.json({ message: error.message });
    }
}

export const updateManyTrip = async (req, res) => {
    try {
        const tableta = req.body.cod_tableta
        const rumas = await PilaModel.find({cod_tableta: tableta})
        const rumasId = rumas.map((i) => {
            return i._id
        })
        const tripsUpdated = await TripModel.updateMany({ruma: {$in: rumasId}}, req.body.data)
        // socket.io.emit('ControlCalidad', tripUpdated)
        return res.status(200).json({ status: true, message: 'List Trip updated', data: tripsUpdated })
    } catch (error) {
        res.json({ message: error.message });
    }
}

export const deleteListTrip = async (req, res) => {
    try {
        const travel_Id = req.params.travel_Id
        const listTrip = await TripModel.findOne({_id: travel_Id})
        if(!listTrip) {
            return res.status(404).json({ status: false, message: 'List Trip not found' })
        }
        await TripModel.deleteOne({_id: travel_Id})
        return res.status(200).json({ status: true, message: 'Ore Control deleted' })
    } catch (error) {
        res.json({ message: error.message });
    }
}