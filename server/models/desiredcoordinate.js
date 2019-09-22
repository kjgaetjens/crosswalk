'use strict';
module.exports = (sequelize, DataTypes) => {
  const DesiredCoordinate = sequelize.define('DesiredCoordinate', {
    session: DataTypes.STRING,
    latitude: DataTypes.DECIMAL,
    longitude: DataTypes.DECIMAL
  }, {});
  DesiredCoordinate.associate = function(models) {
    // associations can be defined here
  };
  return DesiredCoordinate;
};