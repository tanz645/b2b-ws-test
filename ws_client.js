const WebSocket = require('ws');
const config = require('./config');

const connectToServer = async () => {
    const ws = new WebSocket(`${config.ws.host}:${config.ws.port}`);
    return new Promise((resolve, reject) => {
        const timer = setInterval(() => {
            if (ws.readyState === 1) {
                clearInterval(timer)
                resolve(ws);
            }
        }, 10);
    });
}

(async () => {

    const ws = await connectToServer();

    ws.send(JSON.stringify({ type: "Subscribe" }));
    ws.send(JSON.stringify({ type: "Subscribe" }));
    ws.send(JSON.stringify({ type: "Subscribe" }));
    ws.send(JSON.stringify({ type: "Subscribe" }));
    ws.send(JSON.stringify({ type: "Unscubscribe" }));
    ws.send(JSON.stringify({ type: "Unscubscribe" }));

    setTimeout(() => {
        ws.send(JSON.stringify({ type: "CountSubscribers" }));
        ws.send(JSON.stringify({ type: "Subscribe" }));
    }, 10000);
    setTimeout(() => {
        ws.send(JSON.stringify({ type: "CountSubscribers" }));
    }, 12000);
    setTimeout(() => {
        ws.send(JSON.stringify({ type: "error" }));
    }, 14000);
    setTimeout(() => {
        ws.send(JSON.stringify(''));
    }, 16000);

    ws.onmessage = (msg) => {
        const messageBody = JSON.parse(msg.data);
        console.log({
            messageFromServer: messageBody
        });
    };

})()