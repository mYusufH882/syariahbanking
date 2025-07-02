require('dotenv').config();
const app = require('./src/app');
const appConfig = require('./src/shared/config/app.config');

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || 'http://localhost';

app.listen(PORT, () => {
    console.log(`Server running on ${appConfig.host}:${appConfig.port}`);
    console.log(`Environment: ${appConfig.nodeEnv}`);
});