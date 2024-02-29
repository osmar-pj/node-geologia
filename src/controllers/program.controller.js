import ProgramCanchasModel from '../models/ProgramCanchasModel.js'

export const getPrograms = async (req, res) => {
    try {
        const response = await ProgramCanchasModel.find()
        return res.status(200).json(response)
    } catch (error) {
        res.json({ message: error.message })
    }
}

export const createProgram = async (req, res) => {
    try {
        const programs = req.body
        const months = ['ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO','JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE','DICIEMBRE']
        const month = programs.data.map(i => months[new Date(i.date).getMonth()])
        const year = programs.data.map(i => new Date(i.date).getFullYear())
        const modaData = (data) => {
            if (data.length === 0) return ""
            const dataCount = {}
            let max = 0
            let moda = 0
            data.forEach((i) => {
              if (dataCount[i]) {
                dataCount[i]++
              } else {
                dataCount[i] = 1
              }
            })
            for (const i in dataCount) {
              if (dataCount[i] > max) {
                moda = i
                max = dataCount[i]
              }
            }
            return moda
          }
        programs.data.forEach(async (program) => {
            const data = {
                mining: program.mining,
                date: program.date,
                ton_prog: program.ton_prog,
                ley_ag_prog: program.ley_ag_prog,
                ley_fe_prog: program.ley_fe_prog,
                ley_mn_prog: program.ley_mn_prog,
                ley_pb_prog: program.ley_pb_prog,
                ley_zn_prog: program.ley_zn_prog,
                user: programs.user,
                month: modaData(month),
                year: modaData(year)
            }
            const newProgram = await new ProgramCanchasModel(data)
            const programSaved =  await newProgram.save()
        })
        return res.status(200).json({ status: true, message: 'Programa de Canchas creado exitosamente' })
    }
    catch (error) {
        res.json({ message: error.message })
    }
}

export const updateProgram = async (req, res) => {
    try {
        const { mining, status, date, ton_prog, ley_prog, user } = req.body
        const existingRecord = await ProgramCanchasModel.findOne({ mining})

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
        const existingRecord = await ProgramCanchasModel.findOne({ mining })

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