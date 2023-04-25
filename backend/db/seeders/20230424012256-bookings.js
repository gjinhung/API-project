'use strict';

let options = { tableName: "Users"}
if (process.env.NODE_ENV === "production"){
  options.schema = process.env.SCHEMA;
  }

  const { Booking, User, Spot } = require('../models');

  const bookings = [
    {
      user: "ashketchum",
      spot: "Cerulean Gym",
      startDate: "January 1, 2024",
      endDate: "January 7, 2024"
    },
    {
      user: "ashketchum",
      spot: "Pewter Gym",
      startDate: "January 7, 2024",
      endDate: "January 14, 2024"
    }
  ]

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      for (let bookingInfo of bookings) {
        const { startDate, endDate} = bookingInfo;
        const foundUser = await User.findOne({
          where: { username: bookingInfo.owner}
        });
        const foundSpot = await Spot.findOne({
          where: { name: bookings.spot}
        })
        await Booking.create({
          startDate,
          endDate,
          spotid: foundSpot.id,
          userId: foundUser.id
        });
      
      }
    } catch(err) {
      console.error(err);
      throw err;
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Bookings', { user: bookings.map(booking => booking.user) }, {});
  }
};