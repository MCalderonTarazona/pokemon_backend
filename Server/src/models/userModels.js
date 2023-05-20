const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
   sequelize.define('User', {
      id: {
         type: DataTypes.INTEGER,
         autoIncrement: true,
         allowNull: false,
         primaryKey: true
       },
       name: {
        type: DataTypes.STRING,
        allowNull: false
       },
       email: {
         type: DataTypes.STRING,
         allowNull: false,
         isEmail: true
       },
       password: {
         type: DataTypes.STRING,
         allowNull: false,
       },
       validate: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
      }
   }, { timestamps: false });
};