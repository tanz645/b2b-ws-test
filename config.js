require('dotenv').config();

const env = process.env
module.exports = {
    ws: {
        port: env.WS_PORT,
        host: env.WS_HOST
    }
}