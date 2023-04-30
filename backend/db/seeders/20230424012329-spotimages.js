'use strict';

const bcrypt = require('bcryptjs')

let options = { tableName: "Users"}
if (process.env.NODE_ENV === "production"){
  options.schema = process.env.SCHEMA;
  }

  const { SpotImage, Spot } = require('../models');

  const spotImages = [
    {
      spot: "Cerulean Gym",
      url: "https://archives.bulbagarden.net/media/upload/8/80/Cerulean_Gym_anime.png",
      preview: true
    },
    {
      spot: "Pewter Gym",
      url: "https://archives.bulbagarden.net/media/upload/6/63/Pewter_Gym_Battlefield.png",
      preview: true
    },
    {
      spot: "Ash's House",
      url: "https://satoshipedia.altervista.org/wp-content/uploads/2016/04/2wgymio.jpg.png",
      preview: true
    },
  ]

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      for (let spotImgInfo of spotImages) {
        const {url, preview} = spotImgInfo;
        const foundSpot = await Spot.findOne({
          where: { name: spotImgInfo.spot}
        });
        await SpotImage.create({
          url,
          spotId: foundSpot.id,
          preview
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
