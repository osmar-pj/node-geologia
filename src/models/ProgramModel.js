import { Schema, model } from 'mongoose'

const ProgramSchema = new Schema({
    mining: String,
    status: String,
    date: Date,
    ton_prog: Number,
    ley_prog: Number,
    user: String
})

const ProgramModel = model('program', ProgramSchema)

export default ProgramModel