'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'DesiredCoordinates',
      'sessionId',
      {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Sessions",
          key: "id"
        }
      }
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'DesiredCoordinates',
      'sessionId'
      )
  }
};
