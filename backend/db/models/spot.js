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
      Spot.belongsTo(models.User, {foreignKey: "ownerld"});
      Spot.hasMany(models.Booking, {foreignKey: "spotId"});
      Spot.hasMany(models.SpotImage, {foreignKey: "spotId"});
      Spot.hasMany(models.Review, {foreignKey: "spotId"})
    }
  }
  Spot.init({
    ownerld: DataTypes.INTEGER,
    address: DataTypes.STRING,
    city: DataTypes.STRING,
    state: DataTypes.STRING,
    country: DataTypes.STRING,
    lat: DataTypes.INTEGER,
    Ing: DataTypes.INTEGER,
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    price: DataTypes.STRING,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    previewlmg: DataTypes.BOOLEAN
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