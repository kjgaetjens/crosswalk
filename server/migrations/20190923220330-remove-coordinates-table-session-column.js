'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('DesiredCoordinates', 'session')
  },

  down: (queryInterface, Sequelize) => {

  }
};

