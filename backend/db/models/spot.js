'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Spot.belongsTo(models.User, {foreignKey: "ownerId"});
      Spot.hasMany(models.Booking, {foreignKey: "spotId"});
      Spot.hasMany(models.SpotImage, {foreignKey: "spotId"});
      Spot.hasMany(models.Review, {foreignKey: "spotId"})
    }
  }
  Spot.init({
    ownerId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lat: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        min: -180,
        max: 180,
        isNumeric: true
      }
    },
    lng: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        min: -180,
        max: 180,
        isNumeric: true
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false
    },
    price: {
      type: DataTypes.STRING,
      allowNull: false
    },
    previewImg: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Spot',
    defaultScope: {
      attributes: {
        exclude: ["createdAt", "previewImg", "updatedAt"]
      }
    }
  });
  return Spot;
};