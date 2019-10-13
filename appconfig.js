module.exports = {
    server: {
        port: process.env.PORT || 8080
    },
    logger: {
        level: "verbose",
        logsFile: "logs/combined.log",
        errorsFile: "logs/errors.log"
    },
    database: {
        seederStorage: "sequelize",
        migrationStorage: "sequelize",
        url: process.env.DATABASE_URL || "postgres://localhost:5432/dreamtrips",
        dialect: "postgres",
        dialectOptions: {
            ssl: process.env.NODE_ENV !== 'dev'
        }
    },
    redis: {
        url: process.env.REDIS_URL || "redis://127.0.0.1:6379"
    },
    bot: {
        telegram: {
            token: process.env.TELEGRAM_TOKEN || '884983109:AAE-XHsnKpBt-GOy8_EZcdzpZY4VOKRVcV8'
        },
        facebook: {
            verifyToken: process.env.FACEBOOK_VERIFY_TOKEN || 'tVchDbGwSKHM8VF', // My own token
            token: process.env.FACEBOOK_TOKEN || 'EAAM4dKJ0lCcBAKPqdIYo4MUwHYub0N9g3SZB9rB06T5iO4Yr8jUHxrOnn0oLCx4kS6qVWA2juAe9b2eezCP0AQmfyfubATc78l8tpuEjaLZAZAn2Xt1KPa1VC8iZBDGC6qOw7Be4okKh42daJSJ3PeF0AdNmimZBOmTNJkMpRFQZDZD'
        },
        system: {
            token: process.env.SYSTEM_BOT_TOKEN || "885095720:AAF9yfMzw2rR9ZzAZ3d1JZsUg4yGyKiffiE"
        }
    },
    socialLinks: {
        telegram: process.env.TELEGRAM_LINK || "https://t.me/dream_trips_team",
        facebook: process.env.FACEBOOK_LINK || "https://www.facebook.com/dreamtripsteam.ua/",
        instagram: process.env.INSTAGRAM_LINK || "https://www.instagram.com/dreamtrips_team.ua/"
    },
    awsCredentials: {
        accessKeyID : process.env.AWS_KEY_ID || "AKIA4AG7ZVSK2JQFX6FB",
        accessKeySecret : process.env.AWS_KEY_SECRET || "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"
    },
    mediaResources: {
        videoAbout: `video/dreamtrips.mp4`
    }
};
