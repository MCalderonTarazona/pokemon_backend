const {User} = require("../db");

const createUser = async (req, res) => {
    try {
        const {name, email, password } = req.body;
        console.log(req.body);
        if( !name || !email || !password ){
            return res.status(404).json({msg: "Missing data for registration"});
        }

        const [newUser, created] = await User.findOrCreate({
            where: { email },
            defaults: { name, email, password }
        });

        if (!created){ res.status(404).json({msg: "User already exists"});
        }else{
            await newUser.setRole(2);
            res.status(200).json({access: true});  
        }
        
    } catch (error) {
        res.status(500).json({access: false});
    }
    
}


module.exports = createUser;