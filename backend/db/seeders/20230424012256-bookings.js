'use strict';

let options = { tableName: "Bookings"}
if (process.env.NODE_ENV === "production"){
  options.schema = process.env.SCHEMA;
  }

  const { Booking, User } = require('../models');

  const bookings = [
    {
      user: "ashketchum",
      spotId: 3,
      startDate: "2024-01-01",
      endDate:"2024-01-07"
    },
    {
      user: "ashketchum",
      spotId: 2,
      startDate: "2024-01-07",
      endDate: "2024-01-14"
    }
  ]

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      for (let bookingInfo of bookings) {
        const { startDate, endDate, spotId} = bookingInfo;
        const foundUser = await User.findOne({
          where: { username: bookingInfo.user}
        });
        await Booking.create({
          startDate,
          endDate,
          userId: foundUser.id,
          spotId
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
