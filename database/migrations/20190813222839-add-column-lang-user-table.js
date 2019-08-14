'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((transaction) => {
      return queryInterface.addColumn({tableName: "users", schema: "users"}, "lang", {
        type: Sequelize.ENUM("ua", "ru"),
        allowNull: true,
      }, { transaction })
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((transaction) => {
      return queryInterface.removeColumn({tableName: "users", schema: "users"}, "lang", { transaction })
    })
  }
};
