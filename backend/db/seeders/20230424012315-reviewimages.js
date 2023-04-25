'use strict';

let options = { tableName: "Users"}
if (process.env.NODE_ENV === "production"){
  options.schema = process.env.SCHEMA;
  }

/** @type {import('sequelize-cli').Migration} */

const { ReviewImage, Review } = require('../models');

const reviewImages = [
  {
    reviewId: "Cerulean Gym",
    url: "https://archives.bulbagarden.net/media/upload/4/4f/Cerulean_City_PE.png"
  },
  {
    reviewId: "Pewter Gym",
    url: "https://archives.bulbagarden.net/media/upload/1/11/Pewter_City_PE.png"
  },
  {
    reviewId: "Ash's House",
    url: "https://archives.bulbagarden.net/media/upload/4/45/Pallet_Town_PE.png"
  },
]

module.exports = {
  async up (queryInterface, Sequelize) {
    await ReviewImage.bulkCreate(reviewImages)
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('ReviewImages', {name: spots.map(spot => spot.name)}, {});
  }
};
