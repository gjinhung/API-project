'use strict';

let options = { tableName: "Users"}
if (process.env.NODE_ENV === "production"){
  options.schema = process.env.SCHEMA;
  }

  const { Spot, User } = require('../models');

  const spots = [
    {
      owner: "ashketchum",
      address: "123 Ash Street",
      city: "Pallet Town",
      state: "Kanto",
      country: "USA",
      lat: 35.546242,
      lng: 139.450638,
      name: "Ash's House",
      description: "This house is where the player lives before beginning their journey.",
      price: "10",
      previewImg: true
  },
  {
    owner: "brockharrison",
    address: "123 Brock Street",
    city: "Pewter City",
    state: "Kanto",
    country: "USA",
    lat: 36.392700,
    lng: 139.072693, 
    name: "Pewter Gym",
    description: "The Pewter Gym is the official Gym of Pewter City. It is based on Rock-type Pokémon",
    price: '20',
    previewImg: true
  },
  {
    owner: "mistywilliams",
    address: "123 Misty Street",
    city: "Cerulean City",
    state: "Kanto",
    country: "USA",
    lat: 36.549980,
    lng: 139.870010, 
    name: "Cerulean Gym",
    description: "The Cerulean Gym is the official Gym of Cerulean City. It is based on Water-type Pokémon.",
    price: '30',
    previewImg: true
  }
]

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      for (let spotInfo of spots) {
        const { address, city, state, country, lat, lng, name, description, price} = spotInfo;
        const foundUser = await User.findOne({
          where: { username: spots.owner}
        });
        await Spot.create({
          address,
          city,
          state,
          country,
          lat,
          lng,
          name,
          description,
          price,
          previewImg,
          ownerId: foundUser.id
        });
      
      }
    } catch(err) {
      console.error(err);
      throw err;
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Spots', {name: spots.map(spot => spot.name)}, {});
  }
};
