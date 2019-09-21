'use strict';
module.exports = (sequelize, DataTypes) => {
  const DesiredCoordinate = sequelize.define('DesiredCoordinate', {
    latitude: DataTypes.DECIMAL,
    longitude: DataTypes.DECIMAL
  }, {});
  DesiredCoordinate.associate = function(models) {
    // associations can be defined here
  };
  return DesiredCoordinate;
};