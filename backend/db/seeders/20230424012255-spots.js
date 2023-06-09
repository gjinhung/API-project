'use strict';

let options = { tableName: "Spots"}
if (process.env.NODE_ENV === "production"){
  options.schema = process.env.SCHEMA;
  }

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert(options, [
      {
        ownerId: 1,
        address: "123 Ash Street",
        city: "Pallet Town",
        state: "Kanto",
        country: "USA",
        lat: 35.546242,
        lng: 139.450638,
        name: "Ash's House",
        description: "This house is where the player lives before beginning their journey.",
        price: 30,
        avgRating: 0,
        previewImg: ""
    },
    {
      ownerId: 2,
      address: "123 Brock Street",
      city: "Pewter City",
      state: "Kanto",
      country: "USA",
      lat: 36.392700,
      lng: 139.072693, 
      name: "Pewter Gym",
      description: "The Pewter Gym is the official Gym of Pewter City. It is based on Rock-type Pokémon",
      price: 20,
      avgRating: 0,
      previewImg: ""
    },
    {
      ownerId: 3,
      address: "123 Misty Street",
      city: "Cerulean City",
      state: "Kanto",
      country: "USA",
      lat: 36.549980,
      lng: 139.870010, 
      name: "Cerulean Gym",
      description: "The Cerulean Gym is the official Gym of Cerulean City. It is based on Water-type Pokémon.",
      price: 30,
      avgRating: 0,
      previewImg: ""
    }
  ], {});
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      name: { [Op.in]: ['Cerulean Gym', 'Pewter Gym', "Ash's House"] }
    }, {});
  }
};
