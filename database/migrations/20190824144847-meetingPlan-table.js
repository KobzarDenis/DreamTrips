'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('meetingPlans', {
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
      isApplied: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false
      },
      date: {
        type: Sequelize.DATE,
        allowNull: false
      },
      part: {
        type: Sequelize.ENUM("noon", "evening"),
        allowNull: false
      },
      type: {
        type: Sequelize.ENUM("travel", "business", "both"),
        allowNull: false
      },
    }, {schema: 'users'});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('meetingPlans');
  }
};
