const database = {
    seederStorage: "sequelize",
    migrationStorage: "sequelize",
    logging: process.env.DATABASE_LOGGING,
    url: process.env.DATABASE_URL || "postgres://localhost:5432/dreamtrips",
    dialect: 'postgres',
    dialectOptions: {
        ssl: process.env.NODE_ENV !== 'dev'
    }
};

module.exports = database;
