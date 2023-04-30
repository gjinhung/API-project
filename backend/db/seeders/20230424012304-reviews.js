'use strict';

let options = { tableName: "Reviews"}
if (process.env.NODE_ENV === "production"){
  options.schema = process.env.SCHEMA;
  }

  // const { Review, Spot, User, ReviewImage } = require('../models');

  // const reviews = [
    
  // ]

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    return queryInterface.bulkInsert(options, [
      {
        userId: 1,
        spotId: 3,
        review: "Great view of the water",
        stars: 4
      },
      {
        userId: 1,
        spotId: 2,
        review: "Great view of the mountains",
        stars: 4
      },
      {
        userId: 3,
        spotId: 2,
        review: "Too much water, my pokemon didn't like that",
        stars: 1
      },
      {
        userId: 2,
        spotId: 1,
        review: "Very clean, except for the one giant mouse running around",
        stars: 5
      }
    // try {
    //   for (let reviewInfo of reviews) {
    //     const { review, stars } = reviewInfo;
    //     const foundSpot = await Spot.findOne({
    //       where: { name: reviewInfo.spot }
    //     });
    //     const foundUser = await User.findOne({
    //       where: { username: reviewInfo.user}
    //     });
    //     await Review.create({
    //       review,
    //       stars,
    //       spotId: foundSpot.id,
    //       userId: foundUser.id,
    //     });
    //   }
    // } catch(err) {
    //   console.error(err);
    //   throw err;
    // }
    ])
  },

  async down (queryInterface, Sequelize) {

    options.tableName = 'Reviews';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [3, 2, 1] }
    }, {});

  }
};
