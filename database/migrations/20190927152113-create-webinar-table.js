'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('webinars', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      link: {
        type: Sequelize.STRING,
        allowNull: true
      },
      date: {
        type: Sequelize.DATE
      }
    }, {schema: 'clients'});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('webinars');
  }
};
