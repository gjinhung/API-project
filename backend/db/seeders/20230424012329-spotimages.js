'use strict';

const bcrypt = require('bcryptjs')

let options = { tableName: "Users"}
if (process.env.NODE_ENV === "production"){
  options.schema = process.env.SCHEMA;
  }

  const { SpotImage, Spot } = require('../models');

  const spotImages = [
    {
      review: "Cerulean Gym",
      url: "https://archives.bulbagarden.net/media/upload/8/80/Cerulean_Gym_anime.png"
    },
    {
      review: "Pewter Gym",
      url: "https://archives.bulbagarden.net/media/upload/6/63/Pewter_Gym_Battlefield.png"
    },
    {
      review: "Ash's House",
      url: "https://satoshipedia.altervista.org/wp-content/uploads/2016/04/2wgymio.jpg.png"
    },
  ]

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      for (let spotImgInfo of spotImages) {
        const {url} = spotImgInfo;
        const foundSpot = await Spot.findOne({
          where: { name: spotImgInfo.review}
        });
        await SpotImage.create({
          url,
          spotId: foundSpot.id
        });
      
      }
    } catch(err) {
      console.error(err);
      throw err;
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('SpotImages', {}, {});
  }
};
