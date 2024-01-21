import mongoose from 'mongoose'

const listTripSchema = new mongoose.Schema({
    travel_Id: String,
    fecha: String,
    hora: String,
    turno: String,
    operador: String,
    vehiculo: String,
    vagones: Number,
    mina: String,
    tipo: String,
    tajo: String,
    ton: Number,
    tonh: Number,
    material: String,
    ruma: String,
    ley_ag: Number,
    ley_fe: Number,
    ley_mn: Number,
    ley_pb: Number,
    ley_zn: Number,
    fecha_abast: String,
    datetime: Date,
    statusMina: String,
    validMina: Number,
    statusGeology: String,
    validGeology: Number,
    createdAt: {
        type: Date,
        default: Date.now
    }
},
{
    versionKey: false,
}
)

const ListTripModel = mongoose.model('list-trip', listTripSchema)

export default ListTripModel