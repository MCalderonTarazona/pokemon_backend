const { Router } = require('express');

// Importar todos los routers;
const login = require("../controllers/loginControllers");
const createUser = require("../controllers/userControllers");
const { findTypesBd } = require("../controllers/typesControllers");
const { createPokemon, findAllPokemons, findIdPokemons } = require("../controllers/pokemonControllers");

const router = Router();
// Configurar los routers
router.get("/user", login);
router.post("/user", createUser);
router.get("/types", findTypesBd);
router.post("/pokemons", createPokemon);
router.get("/pokemons", findAllPokemons);
router.get("/pokemons/:idPokemon", findIdPokemons);

module.exports = router;
