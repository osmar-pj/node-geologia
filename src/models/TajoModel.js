import mongoose from 'mongoose'

const tajoSchema = new mongoose.Schema({
    name: String,
    valid: Boolean,
    level: Number,
    veta: String,
    mineral: String,
    zona: String,
    user: String
},
{
    timestamps: true,
    versionKey: false,
}
)

const TajoModel = mongoose.model('tajo', tajoSchema)

export default TajoModel