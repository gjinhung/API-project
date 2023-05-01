'use strict';

let options = { tableName: "Users"};
if (process.env.NODE_ENV === "production"){
options.schema = process.env.SCHEMA;
}


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Users', 'firstName', {
        type: Sequelize.STRING,
        allowNull: false
  },options)
  await queryInterface.addColumn('Users', 'lastName', { 
    type: Sequelize.STRING,
    allowNull: false
  },options);
},
async down(queryInterface, Sequelize) {
  await queryInterface.removeColumn('Users', "firstName", options)
}
};