import TajoModel from '../models/TajoModel.js'

export const getAllTajo = async (req, res) => {
    try {

        const tajoGeology = await TajoModel.find({valid: true}, {_id: 0, valid: 0})
        return res.status(200).json(tajoGeology)

    } catch (error) {
        res.json({message: error.message})
    }
}