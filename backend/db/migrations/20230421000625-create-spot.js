'use strict';

let options = {};
if (process.env.NODE_ENV === "production"){
options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Spots', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      ownerId: {
        allowNull:false,
        type: Sequelize.INTEGER,
        references: {
          model: "Users"
        },
        onDelete: "CASCADE",
      },
      address: {
        type: Sequelize.STRING,
        allowNull: false,
        
      },
      city: {
        type: Sequelize.STRING,
        allowNull: false,
        
      },
      state: {
        type: Sequelize.STRING,
        allowNull: false,
        
      },
      country: {
        type: Sequelize.STRING,
        allowNull: false,
        
      },
      lat: {
        type: Sequelize.FLOAT,
        validate: {
          min: -90,
          max: 90,
          isNumeric: true
        }
      },
      lng: {
        type: Sequelize.FLOAT(9,6),
        validate: {
          min: -180,
          max: 180
        }
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        
      },
      description: {
        type: Sequelize.STRING,
        allowNull: false,
        
      },
      price: {
        type: Sequelize.FLOAT(6, 2),
        allowNull: false,
        
      },
      avgRating: {
        type: Sequelize.FLOAT(6,2),
        defaultValue: 0
      },
      previewImg: {
        type: Sequelize.STRING,
        defaultValue: "N/A"
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
      }
    },options);
  },
  async down(queryInterface, Sequelize) {
    options.tableName = "Spots";
    await queryInterface.dropTable(options);
  }
};