'use strict';

let options = {};
if (process.env.NODE_ENV === "production"){
options.schema = process.env.SCHEMA;
}


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      await queryInterface.addColumn('Users', 'firstName', {
        type: Sequelize.STRING
      });
      await queryInterface.addColumn('Users', 'lastName', {
        type: Sequelize.STRING
      });
      return Promise.resolve();
    } catch (e) {
      return Promise.reject(e);
    }
  },
async down(queryInterface, Sequelize) {
  try{
  await queryInterface.removeColumn('Users', 'firstName');
  await queryInterface.removeColumn('Users', 'lastName');
  return Promise.resolve();
} catch (e) {
  return Promise.reject(e);
}
}
}