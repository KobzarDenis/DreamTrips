'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('cronJobs', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      interval: {
        type: Sequelize.STRING,
        allowNull: false
      }
    }, {schema: 'system'});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('cronJobs');
  }
};
