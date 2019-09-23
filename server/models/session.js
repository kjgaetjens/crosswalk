'use strict';
module.exports = (sequelize, DataTypes) => {
  const Session = sequelize.define('Session', {
    param: DataTypes.STRING,
    status: DataTypes.STRING
  }, {});
  Session.associate = function(models) {
    Session.hasMany(models.DesiredCoordinate, {as : 'DesiredCoordinates', foreignKey: 'sessionId'})
  };
  return Session;
};