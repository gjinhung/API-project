'use strict';

let options = {};
if (process.env.NODE_ENV === "production"){
options.schema = process.env.SCHEMA;
}


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      await queryInterface.addColumn('User', 'firstName', {
        type: Sequelize.STRING
      });
      await queryInterface.addColumn('User', 'lastName', {
        type: Sequelize.STRING
      });
      return Promise.resolve();
    } catch (e) {
      return Promise.reject(e);
    }
  },
async down(queryInterface, Sequelize) {
  try{
  await queryInterface.removeColumn('User', 'firstName');
  await queryInterface.removeColumn('User', 'lastName');
  return Promise.resolve();
} catch (e) {
  return Promise.reject(e);
}
}
}