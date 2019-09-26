'use strict';
module.exports = (sequelize, DataTypes) => {
  const Session = sequelize.define('Session', {
    param: { type: DataTypes.STRING, unique: true},
    status: { type: DataTypes.STRING}
  }, {});
  Session.associate = function(models) {
    Session.hasMany(models.DesiredCoordinate, {as : 'DesiredCoordinate', foreignKey: 'sessionId'})
    Session.belongsTo(models.User, {as : 'User', foreignKey: 'userId'})
  };
  return Session;
};