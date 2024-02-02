import mongoose from 'mongoose'

const tajoSchema = new mongoose.Schema({
    tajoId: Number,
    name: String,
    valid: Boolean,
    level: Number,
    veta: String,
    mineral: String,
    zona: String
},
{
    timestamps: true,
    versionKey: false,
}
)

const TajoModel = mongoose.model('tajo', tajoSchema)

export default TajoModel