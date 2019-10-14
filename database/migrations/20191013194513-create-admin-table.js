'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('admins', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      email: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true
      },
      phoneNumber: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true
      },
      botId: {
        type: Sequelize.STRING,
        allowNull: true
      },
      password: {
        allowNull: true,
        type: Sequelize.TEXT
      },
      firstName: {
        allowNull: true,
        type: Sequelize.STRING
      },
      lastName: {
        allowNull: true,
        type: Sequelize.STRING
      },
      uuid: {
        type: Sequelize.TEXT(100),
        defaultValue: Sequelize.fn('uuid_generate_v4'),
        unique: true,
        allowNull: false
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      lastLogin: {
        type: Sequelize.DATE
      }
    }, {schema: 'admin'});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('admins');
  }
};
