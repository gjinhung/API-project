'use strict';

let options = { tableName: "Users"};
if (process.env.NODE_ENV === "production"){
options.schema = process.env.SCHEMA;
}


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
  await queryInterface.addIndex(options, ['username', 'email']);
  },

  async down (queryInterface, Sequelize) {
  await queryInterface.removeIndex(options, ['username', 'email']);
  }
};
