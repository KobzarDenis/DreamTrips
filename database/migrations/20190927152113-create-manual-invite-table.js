'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('manualInvites', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,

        references: {
          model: {
            tableName: "users",
            schema: "users"
          },
          key: "id"
        }
      },
      date: {
        type: Sequelize.DATE,
        allowNull: false
      }
    }, {schema: 'users'});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('manualInvites');
  }
};
