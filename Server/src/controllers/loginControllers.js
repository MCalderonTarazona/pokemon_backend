const {User} = require("../db");

const login = async (req, res) => {  
    try {
        const {email, password} = req.query;
        if (email && password) {
            const emailFind = await User.findOne({ where: { email: email } });
                if (!emailFind) {
                    res.status(404).json({msg: "User does not exist"});
                } else {
                    const passFind = await User.findOne({ where: { email: email, password: password } });
                    if (!passFind) {
                        res.status(404).json({msg: "Incorrect password"});
                    } else {
                        res.status(200).json({access: true})
                    }
                }   
        } else {
            res.status(404).json({msg: "Missing data for validation"})
        }
        
    } catch (error) {
        res.status(500).json({access: false})
    }
}

module.exports = login;