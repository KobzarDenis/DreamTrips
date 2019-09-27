'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createSchema('system');
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropSchema('system');
  }
};
