const axios = require("axios");
const { Pokemon, Type } = require("../db");


let pokemonsCache = null;

const findPokemonsDB = async () => {
    try {
      const pokemons = await Pokemon.findAll({
        attributes: ['id', 'name', 'image', 'hp', 'attack', 'defense', 'speed', 'height', 'weight'],
        include: [
          {
            model: Type,
            attributes: ['name'],
            through: { attributes: [] },
          },
        ],
      });
      
    return pokemons.map(element => {
        const { Types, ...allAttributes } = element.get();
        const typeNames = Types.map(type => type.name);
        return { ...allAttributes, types: typeNames };
    });
      
    } catch (error) {
      return [];
    }
};

const  findPokemonsApi = async () => {
    if (pokemonsCache) {
        return pokemonsCache;
    }

    let pokemonsApi = [];
    let nextUrl = 'https://pokeapi.co/api/v2/pokemon?limit=100';

    while(nextUrl){
        try {
            const { data } = await axios.get(nextUrl);
            const { results, next } = data;

            // [{name,url},{name,url},...]
            const pokemonData = await Promise.all(results.map(async (element) => {
                try {
                    const pokemonUrl = await axios.get(element.url);
                    return pokemonUrl.data;
                } catch (error) {
                    console.log("Problemas al obtener detalles del pokemon");
                    return false
                }
            }));

            for (const element of pokemonData) {
                const { id, name, height, weight, sprites, stats, types } = element;
                const typeNames = types.map((type) => type.type.name);
                const pokemonDetails = {
                id,
                name,
                image: sprites.other.dream_world.front_default,
                hp: stats[0].base_stat,
                attack: stats[1].base_stat,
                defense: stats[2].base_stat,
                speed: stats[5].base_stat,
                height,
                weight,
                types: typeNames
                };

                pokemonsApi.push(pokemonDetails);
            }
            nextUrl = next;  

        } catch (error) {
            console.log("Problemas al obtener detalles del pokemon");
            nextUrl = null; 
        }
    }
    pokemonsCache = pokemonsApi;
    console.log("Pokemons cargados con exito");
    return pokemonsApi;

}

const findAllPokemons = async (req, res) => {
    try {
        const pokemonsBD = await findPokemonsDB();
        const pokemonsApi = await findPokemonsApi();
        const allPokemons = [...pokemonsBD, ...pokemonsApi];
        const {name} = req.query;

        if(!name) {
            res.status(200).json(allPokemons);
        } else {
            //let pokemonDetail = allPokemons.find(element => element.name.toLowerCase() === name.toLowerCase());
            let pokemonDetail = allPokemons.filter(element => element.name.match(name.toLowerCase()));
            if (pokemonDetail.length > 0) {
                res.status(200).json(pokemonDetail);
            } else {
                res.status(404).json({ msg: 'The pokemon with the given name does not exist' });
            }
        }    
    } catch (error) {
        res.status(500).json({ msg: 'Problems with the data of Pokemons' });
    }

  
  
};

const findIdPokemons = async (req, res) => {
    try {
        const pokemonsBD = await findPokemonsDB();
        const pokemonsApi = await findPokemonsApi();
        const allPokemons = [...pokemonsBD, ...pokemonsApi];
        const {idPokemon} = req.params;
        let pokemonDetail = {};

        for (const element of allPokemons) {
            if (element.id === Number(idPokemon)) {
                pokemonDetail = element;
                break;
            } 
        }

        if (pokemonDetail.id) {
            res.status(200).json(pokemonDetail);
        } else {
            res.status(404).json({ msg: 'The pokemon with the provided id does not exist' });
        }
    } catch (error) {
        res.status(500).json({ msg: 'The pokemon with the provided id does not exist' });    
    }
    
};

const createPokemon = async (req, res) => {
    try {
        const { name, image, hp, attack, defense, speed, height, weight, types } = req.body;
        if( !name || !image || !hp || !attack || !defense || !types){
            return res.status(404).json({msg: "Missing data for registration"});
        }
        let id;
        const idInitial = await Pokemon.findByPk(20000);
        if (idInitial === null) {
            id = 20000;
        } else {
        const lastPokemon = await Pokemon.findOne({ order: [['id', 'DESC']] });
            id = lastPokemon.dataValues.id + 1;
        }
        const [newPokemon, created] = await Pokemon.findOrCreate({
            where: { name },
            defaults: { id, name, image, hp, attack, defense, speed, height, weight }
        });

        if (!created){ res.status(404).json({msg: "Pokemon already exists"});
        }else{
            for (const element of types) {
                const idType = await Type.findOne({ where: { name: element } });
                await newPokemon.addType(idType);
            }
            res.status(200).json({access: true});  
        }
        
    } catch (error) {
        res.status(500).json({access: false});
    }
    
}

module.exports = {
    createPokemon,
    findPokemonsApi,
    findAllPokemons,
    findIdPokemons
};
