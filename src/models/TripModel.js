import mongoose from 'mongoose'

const tripSchema = new mongoose.Schema({
    // DATA DE SISTEMA MINA (CSV)
    code: Number,
    month: String,
    year: Number,
    date: Date,
    status: String, // Cancha / Planta
    ubication: String,
    turn: String,
    mining: String,
    operator: String,
    tag: String,
    contract: String,
    level: String,
    type: String,
    veta: String,
    tajo: String,
    zone: String,
    material: String,
    dominio: String,
    ton: Number,
    tonh: Number, 
    vagones: Number,
    ley_ag: Number,
    ley_fe: Number,
    ley_mn: Number,
    ley_pb: Number,
    ley_zn: Number,
    tmh_ag: Number,
    tmh_fe: Number,
    tmh_mn: Number,
    tmh_pb: Number,
    tmh_zn: Number,
    rango: String,
    timestamp: Number,
    dateCreatedAt: Date,
    dateSupply: Date,
    week: Number,
    nro_month: Number,
    cod_despacho: String,
    cod_tableta: String,
    pila: String,
    // DATA DE SISTEMA GEOLOGY
    statusMina: String,  // Completo, Incompleto
    statusTrip: String, // Creado (APP truck, wagon) / Falta dividir (APP wagon) / Actualizado (QC) / Laboratorio (QC) / Muestreado (QC) / Despachando (QC) / Finalizado (AUTO)
    history: [], // {work: statusTrip, date: Date, user: String}
    sampleGiba: [],
    carriage: String, // wagon, truck
    splitRequired: Boolean,
    destiny: [],
    materials: [],
    wagons: [],
    trips: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Trip'
        }
    ],
    temp: {
        default: 0,
        type: Number
    },
},
{
    timestamps: true,
    versionKey: false,
}
)

const TripModel = mongoose.model('Trip', tripSchema)

export default TripModel