'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('meetingRequests', {
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
      isApplied: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      isManual: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      part: {
        type: Sequelize.ENUM("noon", "evening"),
        allowNull: true,
      },
      type: {
        type: Sequelize.ENUM("travel", "business", "both"),
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    }, {schema: 'clients'});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('meetingRequests');
  }
};
