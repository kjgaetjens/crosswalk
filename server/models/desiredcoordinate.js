'use strict';
module.exports = (sequelize, DataTypes) => {
  const DesiredCoordinate = sequelize.define('DesiredCoordinate', {
    latitude: DataTypes.DECIMAL,
    longitude: DataTypes.DECIMAL
  }, {});
  DesiredCoordinate.associate = function(models) {
    DesiredCoordinate.belongsTo(models.Session, {as : 'Session', foreignKey: 'sessionId'})
  };
  return DesiredCoordinate;
};