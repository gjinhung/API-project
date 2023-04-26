'use strict';

let options = { tableName: "ReviewImages"}
if (process.env.NODE_ENV === "production"){
  options.schema = process.env.SCHEMA;
  }

/** @type {import('sequelize-cli').Migration} */

// const { ReviewImage, Review } = require('../models');

module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert(options, [
      {
        reviewId: 1,
        url: "https://archives.bulbagarden.net/media/upload/4/4f/Cerulean_City_PE.png"
      },
      {
        reviewId: 2,
        url: "https://archives.bulbagarden.net/media/upload/1/11/Pewter_City_PE.png"
      },
      {
        reviewId: 4,
        url: "https://archives.bulbagarden.net/media/upload/4/45/Pallet_Town_PE.png"
      },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'ReviewImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spot: { [Op.in]: ['Cerulean Gym', 'Pewter Gym', "Ash's House"] }
    }, {});
  }
};
