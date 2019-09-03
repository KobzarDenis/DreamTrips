'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((transaction) => {
      return queryInterface.addColumn({tableName: "users", schema: "users"}, "mood", {
        type: Sequelize.ENUM("unknown", "agree", "uncertainty", "block", "discard"),
        allowNull: true,
        defaultValue: "unknown"
      }, { transaction })
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((transaction) => {
      return queryInterface.removeColumn({tableName: "users", schema: "users"}, "mood", { transaction })
    })
  }
};
