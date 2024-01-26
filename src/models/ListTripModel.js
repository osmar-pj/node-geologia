import mongoose from 'mongoose'

const listTripSchema = new mongoose.Schema({
    // DATA DE SISTEMA MINA (CSV)
    month: String,
    year: String,
    date: String,
    status: String,
    ubication: String,
    turn: String,
    mining: String,
    operator: String,
    tag: String,
    contract: String,
    level: Number,
    type: String,
    veta: String,
    tajo: String,
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
    week: Number,
    nro_month: Number,
    // DATA DE SISTEMA GEOLOGY
    travel_Id: Number,
    // name: String,
    // vehiculo: String,
    ruma: String,
    cod_tableta: String,
    fecha_abast: String,
    statusMina: String,  // Completo, Incompleto
    validMina: Boolean,
    statusGeology: String, // General, QualityControl
    validGeology: Boolean
},
{
    timestamps: true,
    versionKey: false,
}
)

const ListTripModel = mongoose.model('listTrip', listTripSchema)

export default ListTripModel