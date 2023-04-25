'use strict';

let options = { tableName: "Users"}
if (process.env.NODE_ENV === "production"){
  options.schema = process.env.SCHEMA;
  }

  const { Review, Spot, User, ReviewImage } = require('../models');

  const reviews = [
    {
      user: "ashketchum",
      spot: "Cerulean Gym",
      review: "Great view of the water",
      stars: 4
    },
    {
      user: "ashketchum",
      spot: "Pewter Gym",
      review: "Great view of the mountains",
      stars: 4
    },
    {
      user: "brockharrison",
      spot: "Cerulean Gym",
      review: "Too much water, my pokemon didn't like that",
      stars: 1
    }
  ]

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      for (let reviewInfo of reviews) {
        const { review, stars } = reviewInfo;
        const foundSpot = await Spot.findOne({
          where: { name: reviewInfo.spot }
        });
        const foundUser = await User.findOne({
          where: { user: reviewInfo.user}
        });
        const foundImage = await ReviewImage.findOne({
          where: { reviewId: reviewInfo.spot}
        })
        await Review.create({
          review,
          stars,
          reviewImg: foundImage ? foundImage.url : null,
          spotId: foundSpot.id,
          userId: foundUser.id,
        });
      }
    } catch(err) {
      console.error(err);
      throw err;
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Reviews', {user: reviews.map(review => review.user) }, {});
  }
};
