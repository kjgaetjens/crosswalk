'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn(
      'Sessions',
      'param',
      {
        type: Sequelize.STRING,
        unique: true
      }
    )
  },

  down: (queryInterface, Sequelize) => {

  }
};
