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
const server = require('./src/app.js');
const createRole = require('./src/controllers/roleControllers');
const { findTypesApi } = require('./src/controllers/typesControllers');
const { findPokemonsApi } = require('./src/controllers/pokemonControllers');
const { conn } = require('./src/db.js');
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
