import { Schema, model } from 'mongoose'

const ProgramSchema = new Schema({
    mining: String,
    date: Date,
    ton_prog: Number,
    ley_ag_prog: Number,
    ley_fe_prog: Number,
    ley_mn_prog: Number,
    ley_pb_prog: Number,
    ley_zn_prog: Number,
    month: String,
    year: Number,
    user: String
}, {
    versionKey: false
})

const ProgramCanchaModel = model('prog_cancha', ProgramSchema)

export default ProgramCanchaModel