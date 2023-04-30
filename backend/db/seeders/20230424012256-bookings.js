'use strict';

let options = { tableName: "Bookings"}
if (process.env.NODE_ENV === "production"){
  options.schema = process.env.SCHEMA;
  }

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    return queryInterface.bulkInsert(options, [
  
    {
      userId: 1,
      spotId: 3,
      startDate: "2024-01-01",
      endDate:"2024-01-07"
    },
    {
      userId: 1,
      spotId: 2,
      startDate: "2024-01-07",
      endDate: "2024-01-14"
    }
  ]
    )
  },

  async down (queryInterface, Sequelize) {
  
    options.tableName = 'Bookings';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [3, 2] }
    }, {});

  }
};
