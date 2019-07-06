module.exports = {
    server: {
        port: process.env.PORT || 3000
    },
    logger: {
        level: "verbose",
        logsFile: "logs/combined.log",
        errorsFile: "logs/errors.log"
    },
    database: {
        seederStorage: "sequelize",
        migrationStorage: "sequelize",
        url: process.env.DATABASE_URL || "postgres://admin:dreamtrips@localhost:5432/dreamtrips",
        dialect: "postgres",
        dialectOptions: {
            ssl: true
        }
    },
    bot: {
        telegram: {
            token: process.env.TELEGRAM_TOKEN || '884983109:AAE-XHsnKpBt-GOy8_EZcdzpZY4VOKRVcV8'
        },
        facebook: {
            verifyToken: process.env.FACEBOOK_VERIFY_TOKEN || 'tVchDbGwSKHM8VF', // My own token
            token: process.env.FACEBOOK_TOKEN || 'EAAM4dKJ0lCcBAKPqdIYo4MUwHYub0N9g3SZB9rB06T5iO4Yr8jUHxrOnn0oLCx4kS6qVWA2juAe9b2eezCP0AQmfyfubATc78l8tpuEjaLZAZAn2Xt1KPa1VC8iZBDGC6qOw7Be4okKh42daJSJ3PeF0AdNmimZBOmTNJkMpRFQZDZD'
        }
    }
};
