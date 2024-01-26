import ListTripModel from '../models/ListTripModel.js'
import RumaModel from '../models/RumaModel.js'
import axios from 'axios'

export const getAllRumas = async (req, res) => {
    try {
        const rumas = await RumaModel.find({valid: true, statusBelong: 'Single'}, { _id: 0, travels: 0, data: 0, rumas_united: 0})
        return res.status(200).json(rumas)
        
    } catch (error) {
        res.json({ message: error.message });
    }
}

export const getRuma = async (req, res) => {
    try {

        const ruma_Id = req.params.ruma_Id

        const ruma = await RumaModel.findOne({ruma_Id: ruma_Id})

        if(!ruma) {
            return res.status(200).json({ status: false, message: 'Ruma not found' })
        }

        return res.status(200).json(ruma)
        
    } catch (error) {
        res.json({ message: error.message });
    }
}

export const createRuma = async (req, res) => {
    try {
        const lastRuma = await RumaModel.findOne({native: 'GUNJOP'}).sort({ _id: -1 }).limit(1)

        let newRumaId

        if (lastRuma) {
            const currentYear = new Date().getFullYear();

            // const lastRumaYear = parseInt(lastRuma.ruma_Id.split('-')[1], 10);
            const lastRumaYear = new Date(lastRuma.createdAt).getFullYear()

            let newRumaNumber;

            if (currentYear === lastRumaYear) {
                const lastRumaNumber = parseInt(lastRuma.ruma_Id.split('-')[1], 10);
                newRumaNumber = lastRumaNumber + 1;
            } else {
                newRumaNumber = 1;
            }

            // ultimas 2 cifras de currentYear
            const year = currentYear.toString().slice(-2);

            newRumaId = `R${year}-${('00' + newRumaNumber).slice(-3)}`;
        } else {
            newRumaId = 'R24-001';
        }

        const newRuma = new RumaModel({
            ruma_Id: newRumaId,
            valid: true,
            statusBelong: 'Single',
            statusTransition: 'Cancha',
            ton: 0,
            tonh: 0,
            x: 50,
            y: 50,
            native: 'GUNJOP'
        });

        await newRuma.save();

        return res.status(200).json({ status: true, message: 'Ruma creada exitosamente' });

    } catch (error) {
        res.json({ message: error.message });
    }
};

export const updateRuma = async (req, res) => {
    try {
        const ruma_Id = req.params.ruma_Id

        const rumaUpdated = await RumaModel.findOneAndUpdate({_id: ruma_Id}, req.body)

        return res.status(200).json({ status: true, message: 'Ruma updated', data: rumaUpdated})

    } catch (error) {
        res.json({ message: error.message });
    }
}

export const deleteRuma = async (req, res) => {
    try {

        const ruma_Id = req.params.ruma_Id

        const rumaDeleted = await RumaModel.findOne({ruma_Id: ruma_Id})

        if(!rumaDeleted) {
            return res.status(200).json({ status: false, message: 'No existe la ruma' })
        }

        await RumaModel.deleteOne({ruma_Id: ruma_Id})

        return res.status(200).json({ status: true, message: 'Ruma deleted' })

    } catch (error) {
        res.json({ message: error.message });
    }
}

export const getListRumas = async (req, res) => {
    try {
        const rumas = await RumaModel.find({}, { data: 0 });
        
        return res.status(200).json({rumas});

    } catch (error) {
        res.json({ message: error.message });
    }
};

export const updateOrCreateRumas = async (req, res) => {
    try {
        const rumas = req.body.rumas;

        const rumaIds = rumas.map(ruma => ruma.ruma_Id)
        const ton = rumas.map(ruma => ruma.ton)
        const tonh = rumas.map(ruma => ruma.tonh)
        const n_travels = rumas.map(ruma => ruma.n_travels)

        const updateRumas = await Promise.all(rumas.map(async ruma => {
            const updateRuma = await RumaModel.updateOne({ ruma_Id: ruma.ruma_Id }, { $set: { valid: 0, statusTransition: 'unido' } });
            return updateRuma;
        }));

        const lastRuma = await RumaModel.findOne().sort({ _id: -1 }).limit(1);
        let newRumaId;

        if (lastRuma) {
            const currentYear = new Date().getFullYear();
            const lastRumaYear = parseInt(lastRuma.ruma_Id.split('-')[1], 10);
            let newRumaNumber;

            if (currentYear === lastRumaYear) {
                const lastRumaNumber = parseInt(lastRuma.ruma_Id.split('-')[2], 10);
                newRumaNumber = lastRumaNumber + 1;
            } else {
                newRumaNumber = 1;
            }

            newRumaId = `CA-${currentYear}-${('000' + newRumaNumber).slice(-3)}`;
        } else {
            newRumaId = 'R24-0001';
        }

        const newRuma = new RumaModel({
            ruma_Id: newRumaId,
            valid: 1,
            statusBelong: 'Multiple',
            statusTransition: 'Planta',
            rumas_united: rumaIds,
            ton: ton.reduce((acc, cur) => acc + cur, 0),
            tonh: tonh.reduce((acc, cur) => acc + cur, 0),
            n_travels: n_travels.reduce((acc, cur) => acc + cur, 0),
        });

        await newRuma.save();

        return res.status(200).json({ status: true, message: 'Las rumas antiguas se han unido y se ha creado una nueva ruma' });

    } catch (error) {
        res.json({ message: error.message });
    }
};