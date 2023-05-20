//                       _oo0oo_
//                      o8888888o
//                      88" . "88
//                      (| -_- |)
//                      0\  =  /0
//                    ___/`---'\___
//                  .' \\|     |// '.
//                 / \\|||  :  |||// \
//                / _||||| -:- |||||- \
//               |   | \\\  -  /// |   |
//               | \_|  ''\---/''  |_/ |
//               \  .-\__  '-'  ___/-. /
//             ___'. .'  /--.--\  `. .'___
//          ."" '<  `.___\_<|>_/___.' >' "".
//         | | :  `- \`.;`\ _ /`;.`/ - ` : | |
//         \  \ `_.   \_ __\ /__ _/   .-` /  /
//     =====`-.____`.___ \_____/___.-`___.-'=====
//                       `=---='
//     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const server = require('./app.js');
const createRole = require('./controllers/roleControllers');
const { findTypesApi } = require('./controllers/typesControllers');
const { findPokemonsApi } = require('./controllers/pokemonControllers');
const { conn } = require('./db.js');
const PORT = 3001;



// Sincronizar la base de datos con los modelos
conn.sync({ force: true }).then(async () => {
    console.log('Database connected');
    
    await createRole();
    await findTypesApi();
    await findPokemonsApi();


    server.listen(PORT, () => {
      console.log('Server raised in port: ' + PORT);
    });
});
