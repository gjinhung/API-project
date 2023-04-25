'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SpotImage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      SpotImage.belongsTo(models.Spots, {foreignKey: "spotId"})
    }
  }
  SpotImage.init({
    spotld: DataTypes.INTEGER,
    url: {
      type: DataTypes.STRING,
    allowNull: false
  }
  }, {
    sequelize,
    modelName: 'SpotImage',
  });
  return SpotImage;
};