'use strict';

let options = {};
if (process.env.NODE_ENV === "production"){
options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ReviewImages', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      spotld: {
        type: Sequelize.INTEGER,
        references: {
          model: "Spots"
        }
      },
      url: {
        type: Sequelize.STRING,
        validate: {
          isUrl: true
        }
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
    });
  },
  async down(queryInterface, Sequelize) {
    options.tableName = "ReviewImages";
    await queryInterface.dropTable(options);
  }
};