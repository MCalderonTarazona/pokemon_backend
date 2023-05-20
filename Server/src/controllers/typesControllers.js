const axios = require("axios");
const { Type } = require("../db");

const findTypesApi = async () => {
    try {
        // response.data.results[{name,url},{name,url}...]
        const { data } = await axios.get('https://pokeapi.co/api/v2/type');
        const { results } = data;
        
        for (const element of results) {
            await Type.findOrCreate({
                where: {name: element.name},
            });
        }
        console.log("Tipos cargados con exito");
        return true
    } catch (error) {
        console.log("Problemas con la carga de tipos");
        return false
    }
}

const findTypesBd = async (req, res) => {
    try {
        const types = await Type.findAll({
            attributes: ['name'],
        });
        // [{name},{name},....]
        const typeNames = types.map(element => element.name);
        res.status(200).json(typeNames);
    } catch (error) {
        res.status(500).json({ msg: 'Problems with the data of Pokemons' });
    }

}

module.exports = {
    findTypesApi,
    findTypesBd
};