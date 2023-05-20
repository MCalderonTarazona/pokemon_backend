const {Role} = require("../db");

const createRole = async () => {
    try {
        const newRoles = ["Admin", "User", "Manager"];

        for (const element of newRoles) {
            await Role.findOrCreate({
                where: {name: element},
            });
        }

        /*newRoles.forEach(async (element) => {
            await Role.findOrCreate({
                where: {name: element},
            });
        })*/
    
        console.log("Roles cargados con exito");
        return true
        
    } catch (error) {
        console.log("Problemas con la carga de los roles");
        return false
    }
    
}


module.exports = createRole;