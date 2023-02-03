const WebSocket = require('ws');
const { v4: uuidv4 } = require('uuid');
const SubscriberService = require('./services/subscriberService'); 
const UtilService = require('./services/utilService'); 
const config = require('./config');

const wss = new WebSocket.Server({ port: config.ws.port });

const subscriberService = new SubscriberService();

wss.on('connection', (ws) => {
    console.log('client connected')
    ws.on('message',async (msg) => {

        let outboundMsg = {};

        try {
            const message = UtilService.parseValidJson(msg);
            if(!message){
                throw "Bad formatted payload, non JSON"
            }
            console.log({
                messageFromClient: message
            });
            if (!subscriberService.isValidMethod(message.type)) {
                throw "Requested method not implemented"
            }
            outboundMsg = await subscriberService.handleMethod(message.type)
            
        } catch (err) {
            outboundMsg = {
                type: "Error",
                error: err || 'Can not process request',
                updatedAt: Date()
            }
        }
        ws.send(JSON.stringify(outboundMsg));
    });
});

const interval = setInterval(() => {
    wss.clients.forEach((ws) => {
        ws.send(JSON.stringify({
            type: "Heartbeat",
            updatedAt: Date()
        }));
    });
  }, 1000);

wss.on('close', () => {
    console.log('ws server closed')
    clearInterval(interval);
});

module.exports = wss;

