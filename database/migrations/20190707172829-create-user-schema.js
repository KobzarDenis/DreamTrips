'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createSchema('clients');
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.dropSchema('clients');
    }
};
