import ProgramModel from '../models/program.model.js'

export const getPrograms = async (req, res) => {
    try {
        const response = await ProgramModel.find()
        return res.status(200).json(response)
    } catch (error) {
        res.json({ message: error.message })
    }
}

export const createProgram = async (req, res) => {
    try {
        console.log(req.body)
        const programs = req.body
        programs.forEach(async (program) => {
            const { mining, status, date, ton_prog, ley_prog, user } = program
            const newProgram = new ProgramModel({ mining, status, date, ton_prog, ley_prog, user })
            await newProgram.save()
        })
        return res.status(200).json({ status: true, message: 'Programa creado exitosamente' })
    }
    catch (error) {
        res.json({ message: error.message })
    }
}

export const updateProgram = async (req, res) => {
    try {
        const { mining, status, date, ton_prog, ley_prog, user } = req.body
        const existingRecord = await ProgramModel.findOne({ mining})

        if (!existingRecord) {
            return res.status(200).json({ status: false, message: 'Este programa no está registrado' })
        }

        existingRecord.mining = mining
        existingRecord.status = status
        existingRecord.date = date
        existingRecord.ton_prog = ton_prog
        existingRecord.ley_prog = ley_prog
        existingRecord.user = user
        await existingRecord.save()
        return res.status(200).json({ status: true, message: 'Programa actualizado exitosamente' })

    } catch (error) {
        res.json({ message: error.message })
    }
}

export const deleteProgram = async (req, res) => {
    try {
        const { mining } = req.body
        const existingRecord = await ProgramModel.findOne({ mining })

        if (!existingRecord) {
            return res.status(200).json({ status: false, message: 'Este programa no está registrado' })
        }
        
        await existingRecord.remove()
        return res.status(200).json({ status: true, message: 'Programa eliminado exitosamente' })
    }
    catch (error) {
        res.json({ message: error.message })
    }
}