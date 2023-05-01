'use strict';

let options = {};
if (process.env.NODE_ENV === "production"){
options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Spots', 'firstName', {
        type: Sequelize.STRING,
        allowNull: false
  },options)
  await queryInterface.addColumn('Spots', 'lastName', { 
    type: Sequelize.STRING,
    allowNull: false
  },options);
},
async down(queryInterface, Sequelize) {
  options.tableName = 'Spots';
  await queryInterface.removeColumn('Spots', "firstName", options)
}
};