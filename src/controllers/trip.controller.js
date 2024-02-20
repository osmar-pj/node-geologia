import TripModel from '../models/TripModel.js'
import PilaModel from '../models/PilaModel.js'
import TajoModel from '../models/TajoModel.js'
import axios from 'axios'

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
        // find where option 1 and option 2
        const trips = await TripModel.find({$or: [{statusTrip: 'waitComplete'}, {statusTrip: 'waitSplit'}]}).limit(20)
        // console.log(trips)
        if (!trips) {
            return res.status(404).json({ message: 'Ore Control sin pendientes' })
        }
        
        const header = [
            { title: 'Id', field: 'id_trip', fn: '', und: '', type: 'id' },
            // { title: 'Año', field: 'year', fn: '', und: '' },
            // { title: 'Mes', field: 'month', fn: '', und: '' },
            { title: 'Fecha', field: 'date', fn: 'date', und: '', type: 'time' },
            { title: 'Estado', field: 'status', fn: '', und: '', type: 'categorical' },
            { title: 'Ubicación', field: 'ubication', fn: '', und: '', type: 'categorical' },
            { title: 'Pila', field: 'destiny', fn: 'arr', und: '', type: 'categorical' },
            { title: 'Turno', field: 'turn', fn: '', und: '', type: 'categorical' },
            { title: 'Placa', field: 'tag', fn: '', und: '', type: 'categorical' },
            { title: 'Vagones', field: 'vagones', fn: '', und: '', type: 'categorical' },
            { title: 'Mina', field: 'mining', fn: '', und: '', type: 'categorical' },
            { title: 'Zona', field: 'zona', fn: '', und: '', type: 'categorical' },
            { title: 'Nivel', field: 'level', fn: '', und: '', type: 'categorical' },
            { title: 'Veta', field: 'veta', fn: '', und: '', type: 'categorical' },
            { title: 'Tipo', field: 'type', fn: '', und: '', type: 'categorical'},
            { title: 'Tajo', field: 'tajo', fn: '', und: '', type: 'categorical' },
            { title: 'Dominio', field: 'dominio', fn: 'arr', und: '', type: 'categorical' },
            { title: 'Tonelaje', field: 'tonh', fn: '', und: '', type: 'numerical' },
            { title: 'Transition', field: 'statusPila', fn: '', und: '',  }
        ]
        return res.status(200).json({status: true, data: trips, header: header});
    } catch (error) {
        res.json({ message: error.message });
    }
};

// CONTROL CALIDAD isPilas esta enviando Pilas
export const getListTripQualityControl = async (req, res) => {
    try {
        const pilas = await PilaModel.find({statusPila: {$ne: 'Finalizado'}}).sort({createdAt: -1})
        // console.log(pilas)
        if(!pilas) {
            return res.status(404).json({ message: 'Control calidad sin pendientes' })
        }
        const header = [
            // { title: 'Año', field: 'year', fn: '', und: '', type: 'time'},
            // { title: 'Mes', field: 'month', fn: '', und: '', type: 'time'},
            // { title: 'Fecha', field: 'date', fn: '', und: '', type: 'time'},
            // { title: 'Estado', field: 'status', fn: '', und: '', type: 'categorical'},
            { title: 'Mina', field: 'mining', fn: '', und: '', type: 'categorical', filter: false },
            { title: 'Ubicación', field: 'ubication', fn: '', und: '', type: 'categorical', filter: true },
            { title: 'Pila', field: 'pila', fn: '', und: '', type: 'unique', filter: false },
            { title: 'Viajes', field: 'travels', fn: 'count', und: '', type: 'cluster', filter: false }, // contar el array para tener los viaje
            { title: 'Tajo', field: 'tajo', fn: 'arr', und: '', type: 'categorical', filter: true },
            { title: 'Dominio', field: 'dominio', fn: 'arr', und: '', type: 'categorical', filter: true },
            { title: 'Cod. Tableta', field: 'cod_tableta', fn: '', und: '', type: 'unique', filter: false },
            { title: 'Cod. Despacho', field: 'cod_despacho', fn: 'arr', und: '', type: 'cluster', filter: false},
            { title: 'Fecha. Abastecimiento', field: 'dateSupply', fn: '', und: '', type: 'time', filter: false},

            { title: 'Stock mineral', field: 'stock', fn: 'fixed', und: 'TMH', type: 'numerical' },
            { title: 'Ton. Total', field: 'tonh', fn: 'fixed', und: 'TMH', type: 'numerical' },
            { title: 'Ley Ag', field: 'ley_ag', fn: 'fixed', und: '', type: 'numerical' },
            { title: 'Ley Fe', field: 'ley_fe', fn: 'fixed', und: '', type: 'numerical' },
            { title: 'Ley Mn', field: 'ley_mn', fn: 'fixed', und: '', type: 'numerical' },
            { title: 'Ley Pb', field: 'ley_pb', fn: 'fixed', und: '', type: 'numerical' },
            { title: 'Ley Zn', field: 'ley_zn', fn: 'fixed', und: '', type: 'numerical' },
            // { title: 'Ton*Ley', field: 'tmh_ag', fn: 'fixed', und: '' }
        ]
        return res.status(200).json({status: true, data: pilas, header: header})
    } catch (error) {
        res.json({ message: error.message });
    }
}

// GENERAL LIST ALL (falta trabajar el inifinity scroll)
export const getListTripGeneral = async (req, res) => {
    try {
        const trips = await TripModel.find({statusTrip: {$ne: 'Dividido'}}).sort({createdAt: -1}).limit(50)
        if (!trips) return res.status(404).json({ message: 'No trips found' })
        const data = trips
        const columns = [
            { title: 'Id', field: 'id_trip', fn: '', und: '', type: 'unique', group: false},
            { title: 'Año', field: 'year', fn: '', und: '', type: 'time', group: false},
            { title: 'Mes', field: 'month', fn: '', und: '', type: 'time', group: false},
            { title: 'Fecha', field: 'date', fn: 'date', und: '', type: 'time', group: false},
            { title: 'Estado', field: 'status', fn: '', und: '', type: 'categorical', group: true},
            { title: 'Ubicación', field: 'ubication', fn: 'arr', und: '', type: 'categorical', group: true},
            { title: 'Pila', field: 'pila', fn: '', und: '', type: 'unique', group: false},
            { title: 'Tableta', field: 'cod_tableta', fn: '', und: '', type: 'unique', group: false},
            { title: 'Turno', field: 'turn', fn: '', und: '', type: 'categorical', group: true},
            { title: 'Status', field: 'statusTrip', fn: 'status', und: '', type: 'categorical', group: true},
            { title: 'Mina', field: 'mining', fn: '', und: '', type: 'categorical', group: false},
            { title: 'Nivel', field: 'level', fn: '', und: '', type: 'categorical', group: true},
            { title: 'Tipo', field: 'type', fn: '', und: '', type: 'categorical', group: true},
            { title: 'Veta', field: 'veta', fn: '', und: '', type: 'categorical', group: true},
            { title: 'Tajo', field: 'tajo', fn: '', und: '', type: 'categorical', group: true},
            { title: 'Cod Despacho', field: 'cod_despacho', fn: '', und: '', type: 'unique', group: false},
            { title: 'Dominio', field: 'dominio', fn: 'arr', und: '', type: 'categorical', group: true},
            { title: 'Rango', field: 'rango', fn: '', und: '', type: 'categorical', group: true},
            { title: 'Fecha de abastecimiento', field: 'dateSupply', fn: 'date', und: '', type: 'time', group: false},
        ]
        
        const staticColumns = [
            // { title: 'Ton', field: 'ton', fn: 'fixed', und: 'TM' },
            { title: 'Tonh', field: 'tonh', fn: 'fixed', und: 'TMH' },
            { title: 'Ley Ag', field: 'ley_ag', fn: 'fixed', und: '' },
            { title: 'Ley Fe', field: 'ley_fe', fn: 'fixed', und: '' },
            { title: 'Ley Mn', field: 'ley_mn', fn: 'fixed', und: '' },
            { title: 'Ley Pb', field: 'ley_pb', fn: 'fixed', und: '' },
            { title: 'Ley Zn', field: 'ley_zn', fn: 'fixed', und: '' },
        ];
;
        const header = [...columns, ...staticColumns];
        return res.status(200).json({status: true, data: data, header: header, grouped: columns.filter(i => i.group === true)} )
    } catch (error) {
        res.json({ message: error.message });
    }
}

export const getTripsGrouped = async (req, res) => {
    try {
        const {ts, arr, category} = req.body
        const limit = arr.length === 0 ? 10 : 10000
        const trips = await TripModel.find({statusTrip: {$ne: 'Dividido'}}).sort({createdAt: -1}).limit(limit)
        if (arr.length === 0) return res.status(404).json({ message: 'No trips grouped' })
        if (!trips) return res.status(404).json({ message: 'No trips found' })
        const data = trips
        const columns = [
            // { title: 'Id', field: '_id', fn: '', und: '', type: 'unique', filter: false},
            { title: 'Año', field: 'year', fn: '', und: '', type: 'time', group: false},
            { title: 'Mes', field: 'month', fn: '', und: '', type: 'time', group: false},
            { title: 'Fecha', field: 'date', fn: 'date', und: '', type: 'time', group: false},
            { title: 'Estado', field: 'status', fn: '', und: '', type: 'categorical', group: true},
            { title: 'Ubicación', field: 'ubication', fn: 'arr', und: '', type: 'categorical', group: true},
            { title: 'Pila', field: 'pila', fn: '', und: '', type: 'unique', group: false},
            { title: 'Tableta', field: 'cod_tableta', fn: '', und: '', type: 'unique', group: false},
            { title: 'Turno', field: 'turn', fn: '', und: '', type: 'categorical', group: true},
            { title: 'Status', field: 'statusTrip', fn: 'status', und: '', type: 'categorical', group: true},
            { title: 'Mina', field: 'mining', fn: '', und: '', type: 'categorical', group: false},
            { title: 'Nivel', field: 'level', fn: '', und: '', type: 'categorical', group: true},
            { title: 'Tipo', field: 'type', fn: '', und: '', type: 'categorical', group: true},
            { title: 'Veta', field: 'veta', fn: '', und: '', type: 'categorical', group: true},
            { title: 'Tajo', field: 'tajo', fn: '', und: '', type: 'categorical', group: true},
            { title: 'Cod Despacho', field: 'cod_despacho', fn: '', und: '', type: 'unique', group: false},
            { title: 'Dominio', field: 'dominio', fn: 'arr', und: '', type: 'categorical', group: true},
            { title: 'Rango', field: 'rango', fn: '', und: '', type: 'categorical', group: true},
            { title: 'Fecha de abastecimiento', field: 'dateSupply', fn: 'date', und: '', type: 'time', group: false},
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

        const filterColumns = columns.filter((col) => arr.includes(col.field));
        const orderColumns = arr.map((item) => filterColumns.find((col) => col.field === item));
        const response = await axios.post(`${process.env.FLASK_URL}/analysis`, {ts: Math.floor(ts/1000), arr, trips: trips.filter(i => i.statusTrip === 'waitBeginDespacho'), category});
        const header = [...orderColumns, ...staticColumns];
        return res.status(200).json({status: true, data: response.data, header: header })
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
                    const data = {
                        stock: pila.stock + tonh,
                        tonh: pila.tonh + tonh,
                        ton: pila.ton + tonh * 0.94,
                        travels: [...pila.travels, tripId],
                        dominio: [...pila.dominio, tripSaved.dominio],
                        history: [...pila.history, {work: 'CREATE waitBeginAnalysis', date: new Date(), user: trip.name}]
                    }
                    const pilaUpdated = await PilaModel.findOneAndUpdate({_id: pila._id}, data, {new: true})
                    socket.io.emit('pilas', [pilaUpdated])
                    const tripUpdated = await TripModel.findOneAndUpdate({_id: tripId}, {temp: pilaUpdated.cod_despacho.length}, {new: true})
                    socket.io.emit('OreControl', tripUpdated)
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
                const dataTripToUpdate = {
                    statusTrip: 'waitBeginAnalysis',
                    history: [...trip.history, {work: 'UPDATE waitBeginAnalysis', date: new Date(), user: data[i].name}],
                    veta: tajo.veta,
                    level: tajo.level,
                    zona: tajo.zona,
                    cod_tableta: data[i].pila,
                    pila: data[i].pila,
                    dominio: data[i].dominio
                }
                const tripUpdate = await TripModel.findOneAndUpdate({_id: travel_Id}, dataTripToUpdate, {new: true})
                socket.io.emit('trips', [tripUpdate])
                const pila = await PilaModel.findOne({pila: data[i].pila})
                const tripId = tripUpdate._id
                const dataToUpdate = {
                    stock: pila.stock + trip.tonh,
                    tonh: pila.tonh + trip.tonh,
                    ton: pila.ton + trip.tonh * 0.94,
                    travels: [...pila.travels, tripId],
                    tajo: [...pila.tajo, data[i].tajo],
                    dominio: [...pila.dominio, data[i].dominio],
                    history: [...pila.history, {work: 'UPDATE waitBeginAnalysis', date: new Date(), user: data.name}]
                }
                const pilaUpdated = await PilaModel.findOneAndUpdate({_id: pila._id}, dataToUpdate, {new: true})
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
                newTrip.statusTrip = 'waitBeginAnalysis'
                newTrip.history = [...trip.history, {work: 'UPDATE waitBeginAnalysis', date: new Date(), user: data[i].name}]
                newTrip.splitRequired = false
                newTrip.level = tajo ? tajo.level : 'NOT_NIVEL'
                newTrip.veta = tajo ? tajo.veta : 'NOT_VETA'
                newTrip.zona = tajo ? tajo.zona : 'NOT_ZONA'
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
                // OreControl es para agregar nuevos viajes
                socket.io.emit('OreControl', tripSaved)
            }
            
            const tripUpdatedFalse = await TripModel.findOneAndUpdate({_id: travel_Id}, { splitRequired: false, statusTrip: 'Dividido', trips: newTrips.map(i => i._id) }, {new: true}) // Para que no se muestre en OreControl
            socket.io.emit('RemoveTrip', tripUpdatedFalse)
            // UPDATE PILA
            const pilasToUpdate = await newTrips.map(async (i) => {
                const pila = await PilaModel.findOne({pila: i.pila})
                const tripId = i._id
                const dataToUpdate = {
                    stock: pila.stock + i.tonh,
                    tonh: pila.tonh + i.tonh,
                    ton: pila.ton + i.tonh * 0.94,
                    travels: [...pila.travels, tripId],
                    tajo: [...pila.tajo, i.tajo],
                    dominio: [...pila.dominio, i.dominio],
                    history: [...pila.history, {work: 'UPDATE waitBeginAnalysis', date: new Date(), user: data.name}]
                }
                const pilaUpdated = await PilaModel.findOneAndUpdate({_id: pila._id}, dataToUpdate, {new: true})
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
                const dataToUpdate = {
                    statusTrip: 'waitBeginAnalysis',
                    history: [...trip.history, {work: 'UPDATE waitBeginAnalysis', date: new Date(), user: i.name}],
                    tajo: i.tajo,
                    type: i.type,
                    level: tajo ? tajo.level :"NOT_NIVEL",
                    veta: tajo ? tajo.veta : "NOT_VETA",
                    zona: tajo ? tajo.zona : "NOT_TAJO"
                }
                const tripUpdated = await TripModel.findOneAndUpdate({_id: travel_Id}, dataToUpdate, {new: true})
                return tripUpdated
            })
            const tripUpdate = await Promise.all(promiseTrips)
            socket.io.emit('trips', tripUpdate)
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