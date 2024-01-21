import axios from 'axios'

export const signin = async (req, res) => {
    try {

        const {data} = await axios.post(`${process.env.NODE_WAPSI_URL}/auth/${process.env.API_VERSION}/signin`, req.body)

        return res.status(200).json(data)
        
    } catch (error) {
        res.json({ message: error.message });
    }
}

export const signup = async (req, res) => {
    try {

        const {data} = await axios.post(`${process.env.NODE_WAPSI_URL}/auth/${process.env.API_VERSION}/signup`, req.body)

        return res.status(200).json(data)
        
    } catch (error) {
        res.json({ message: error.message });
    }
}