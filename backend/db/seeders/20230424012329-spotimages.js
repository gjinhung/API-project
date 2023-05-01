'use strict';

const bcrypt = require('bcryptjs')

let options = { tableName: "SpotImages"}
if (process.env.NODE_ENV === "production"){
  options.schema = process.env.SCHEMA;
  }

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert(options, [
    {
      spotId: 3,
      url: "https://archives.bulbagarden.net/media/upload/8/80/Cerulean_Gym_anime.png",
      preview: true
    },
    {
      spotId: 2,
      url: "https://archives.bulbagarden.net/media/upload/6/63/Pewter_Gym_Battlefield.png",
      preview: true
    },
    {
      spotId: 1,
      url: "https://satoshipedia.altervista.org/wp-content/uploads/2016/04/2wgymio.jpg.png",
      preview: true
    }
  ], {});
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'SpotImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};
