import mongoose from 'mongoose'

const rumaSchema = new mongoose.Schema({
    ruma_Id: String,
    muestra: JSON,
    ubication: String,
    mining: String,
    cod_tableta: String,
    tajo: [],
    dominio: String,
    ton: Number,
    tonh: Number,
    ley_ag: Number,
    tmh_ag: Number,
    statusBelong: String,
    statusTransition: String,
    valid: Boolean,
    rumas_united: JSON,
    travels: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'listTrip'
        }
    ],
    n_travels: Number,
    x: Number,
    y: Number,
    native: String
},
{
    timestamps: true,
    versionKey: false,
}
)

const RumaModel = mongoose.model('ruma', rumaSchema)

export default RumaModel