'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('pendingUsers', {
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
      type: {
        type: Sequelize.ENUM("email", "phone-number"),
        allowNull: false,
      },
      state: {
        type: Sequelize.ENUM("contacted", "not-contacted"),
        allowNull: false,
        defaultValue: "not-contacted"
      },
      date: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    }, {schema: 'clients'});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('userStates');
  }
};
