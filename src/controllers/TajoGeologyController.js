import TajoGeologyModel from '../models/TajoGeologyModel.js'

export const getAllTajoGeology = async (req, res) => {
    try {

        const tajoGeology = await TajoGeologyModel.find({}, {tajoId: 1, name: 1, valid: 1, _id: 0})
        return res.status(200).json(tajoGeology)

    } catch (error) {
        res.json({message: error.message})
    }
}