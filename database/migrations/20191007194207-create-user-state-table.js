'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('userStates', {
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
            schema: "clients"
          },
          key: "id"
        }
      },
      state: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      mood: {
        type: Sequelize.ENUM("unknown", "agree", "uncertainty", "block", "discard"),
        allowNull: false,
        defaultValue: "unknown"
      }
    }, {schema: 'clients'});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('userStates');
  }
};
