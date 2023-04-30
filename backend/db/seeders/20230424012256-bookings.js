'use strict';

let options = { tableName: "Bookings"}
if (process.env.NODE_ENV === "production"){
  options.schema = process.env.SCHEMA;
  }

  const { Booking, User, Spot } = require('../models');

  const bookings = [
    {
      user: "ashketchum",
      spot: "Cerulean Gym",
      startDate: "2024-01-01",
      endDate: "2024-01-07"
    },
    {
      user: "ashketchum",
      spot: "Pewter Gym",
      startDate: "2024-01-07",
      endDate: "2024-01-14"
    }
  ]

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      for (let bookingInfo of bookings) {
        const { startDate, endDate} = bookingInfo;
        const foundUser = await User.findOne({
          where: { username: bookingInfo.user}
        });
        const foundSpot = await Spot.findOne({
          where: { name: bookingInfo.spot}
        });
        await Booking.create({
          startDate,
          endDate,
          userId: foundUser.id,
          spotId: foundSpot.id
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
