export const csvAnalysis = async (req, res) => {
    try {
        
        res.status(200).json({status: true});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}