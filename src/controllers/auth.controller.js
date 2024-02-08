import axios from 'axios'

export const signin = async (req, res) => {
    try {
        const {data} = await axios.post(`${process.env.NODE_WAPSI_URL}/auth/${process.env.API_VERSION}/signin`, req.body)
        const user = {
            userId: data.userId,
            name: data.user,
            token: data.token,
            empresa: data.empresa,
            roles: data.roles.map(role => role.name),
            status: data.status
        }
        return res.status(200).json(user)
        
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