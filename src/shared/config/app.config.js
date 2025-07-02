module.exports = {
    port: process.env.PORT || 5000,
    host: process.env.NODE_ENV || 'http://localhost',
    nodeEnv: process.env.NODE_ENV || 'development',
    databaseUrl: process.env.DATABASE_URL,
};