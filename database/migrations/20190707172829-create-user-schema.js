'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createSchema('users');
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.dropSchema('users');
    }
};
