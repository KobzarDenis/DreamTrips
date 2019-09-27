'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addIndex({schema: "users", tableName: "users"}, ["phoneNumber"], {
      indexName: 'idx_users_phoneNumber',
      indexType: "HASH"
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeIndex({schema: "users", tableName: "users"}, "idx_users_phoneNumber");
  }
};
