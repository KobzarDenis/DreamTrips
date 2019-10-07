'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addIndex({schema: "clients", tableName: "users"}, ["email"], {
      indexName: 'idx_users_email',
      indexType: "HASH"
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeIndex({schema: "clients", tableName: "users"}, "idx_users_email");
  }
};
