'use strict';

const bcrypt = require('bcryptjs')

let options = { tableName: "Users"}
if (process.env.NODE_ENV === "production"){
  options.schema = process.env.SCHEMA;
  }

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert(options, [
      {
        email: 'ash@pokemon.io',
        username: 'ashketchum',
        hashedPassword: bcrypt.hashSync('password'),
        firstName: 'Ash',
        lastName: "Ketchum"
      },
      {
        email: 'brock@pokemon.io',
        username: 'brockharrison',
        hashedPassword: bcrypt.hashSync('password2'),
        firstName: "Brock",
        lastName: "Harrison"
      },
      {
        email: 'misty@pokemon.io',
        username: 'mistywilliams',
        hashedPassword: bcrypt.hashSync('password3'),
        firstName: "Misty",
        lastName: "Williams"
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Users';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      username: { [Op.in]: ['ashketchum', 'brockharrison', 'mistywilliams'] }
    }, {});
  }
};

