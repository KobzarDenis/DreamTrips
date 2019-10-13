'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createSchema('admin');
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropSchema('admin');
  }
};
