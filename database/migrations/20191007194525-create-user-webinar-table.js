'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('userWebinars', {
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
            webinarId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: {
                        tableName: "webinars",
                        schema: "clients"
                    },
                    key: "id"
                }
            },
            requestId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: {
                        tableName: "meetingRequests",
                        schema: "clients"
                    },
                    key: "id"
                }
            }
        }, {schema: 'clients'})
            .then(() => {
                queryInterface.addConstraint(
                    'userWebinars',
                    ['userId', 'meetingId'],
                    {
                        type: 'primary key',
                        name: 'pk_userMeeting'
                    }
                )
            });
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('userMeetings');
    }
};
