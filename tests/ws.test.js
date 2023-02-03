const WebSocket = require('ws');
const config = require('../config');

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
};

describe('Websocket Subscription Integration Tests', () => {

    let wsServer;
    beforeAll(() => {
        wsServer = require('../ws_server');
    });
    afterAll(() => {
        wsServer.close()
        return new Promise(resolve => {
            setTimeout(() => {
                resolve(1)
            }, 1000)
        })
    });

    it('Should send heartbeat event every second', async () => {
        const wsClient = await connectToServer();
        wsClient.on('close', () => {
            console.log('client connection closed test 1')
        });
        return new Promise((resolve,reject) => {
            wsClient.onmessage = (msg) => {
                const messageBody = JSON.parse(msg.data);                
                try {
                    expect(messageBody.type).toEqual('Heartbeat');
                } catch (error) {                    
                    reject(error)
                } finally {
                    wsClient.terminate()
                    setTimeout(() => {
                        resolve(1)
                    },100)
                }
            };
        })
    });

    it('Should send Subscribed status after Subscribe event', async () => {
        const wsClient = await connectToServer();
        let counter = 0;
        wsClient.on('close', () => {
            console.log('client connection closed test 2')
        });
        wsClient.send(JSON.stringify({ type: "Subscribe" }));
        return new Promise((resolve, reject) => {
            wsClient.onmessage = (msg) => {
                const messageBody = JSON.parse(msg.data);                
                try {
                    if(counter === 10){ // wait 10 seconds
                        throw 'Max Counter reached'
                    }
                    if(messageBody.status){
                        expect(messageBody.status).toEqual('Subscribed');
                        wsClient.terminate()
                        setTimeout(() => {
                            resolve(1)
                        },100)
                    }
                    counter++;
                } catch (error) {                   
                    reject(error)
                    wsClient.terminate()
                    setTimeout(() => {
                        resolve(1)
                    },100)
                }
            };
        })
    });

    it('Should send Unsubscribed status after Unsubscribe event', async () => {
        const wsClient = await connectToServer();
        let counter = 0;
        wsClient.on('close', () => {
            console.log('client connection closed test 3')
        });
        wsClient.send(JSON.stringify({ type: "Unscubscribe" }));
        return new Promise((resolve, reject) => {
            wsClient.onmessage = (msg) => {
                const messageBody = JSON.parse(msg.data);                
                try {
                    if(counter === 10){ // wait 10 seconds
                        throw 'Max Counter reached'
                    }
                    if(messageBody.status){
                        expect(messageBody.status).toEqual('Unsubscribed');
                        wsClient.terminate()
                        setTimeout(() => {
                            resolve(1)
                        },100)
                    }
                    counter++;
                } catch (error) {                   
                    reject(error)
                    wsClient.terminate()
                    setTimeout(() => {
                        resolve(1)
                    },100)
                }
            };
        })
    });

    it('Should send Subscriber Count after CountSubscribers event', async () => {
        const wsClient = await connectToServer();
        let counter = 0;
        wsClient.on('close', () => {
            console.log('client connection closed test 4')
        });
        wsClient.send(JSON.stringify({ type: "Subscribe" }));
        wsClient.send(JSON.stringify({ type: "Subscribe" }));
        wsClient.send(JSON.stringify({ type: "Subscribe" }));
        wsClient.send(JSON.stringify({ type: "Unscubscribe" }));
        setTimeout(() => {
            wsClient.send(JSON.stringify({ type: "CountSubscribers" }));
        },1000 * 30)
        return new Promise((resolve, reject) => {
            wsClient.onmessage = (msg) => {
                const messageBody = JSON.parse(msg.data);                
                try {
                    if(counter === 35){ // wait 35 seconds
                        throw 'Max Counter reached'
                    }
                    if(messageBody.count){
                        expect(messageBody.count).toEqual(2);
                        wsClient.terminate()
                        setTimeout(() => {
                            resolve(1)
                        },100)
                    }
                    counter++;
                } catch (error) {                   
                    reject(error)
                    wsClient.terminate()
                    setTimeout(() => {
                        resolve(1)
                    },100)
                }
            };
        })
    });
    
    it('Should send Error type for unrecognized method', async () => {
        const wsClient = await connectToServer();
        let counter = 0;
        wsClient.on('close', () => {
            console.log('client connection closed test 5')
        });
        wsClient.send(JSON.stringify({ type: "test" }));
        return new Promise((resolve, reject) => {
            wsClient.onmessage = (msg) => {
                const messageBody = JSON.parse(msg.data);                
                try {
                    if(counter === 10){ // wait 10 seconds
                        throw 'Max Counter reached'
                    }
                    if(messageBody.error){
                        expect(messageBody.type).toEqual('Error');
                        expect(messageBody.error).toEqual('Requested method not implemented');
                        wsClient.terminate()
                        setTimeout(() => {
                            resolve(1)
                        },100)
                    }
                    counter++;
                } catch (error) {                   
                    reject(error)
                    wsClient.terminate()
                    setTimeout(() => {
                        resolve(1)
                    },100)
                }
            };
        })
    });

    it('Should send Error type for malformed json', async () => {
        const wsClient = await connectToServer();
        let counter = 0;
        wsClient.on('close', () => {
            console.log('client connection closed test 6')
        });
        wsClient.send(JSON.stringify(''));
        return new Promise((resolve, reject) => {
            wsClient.onmessage = (msg) => {
                const messageBody = JSON.parse(msg.data);                
                try {
                    if(counter === 10){ // wait 10 seconds
                        throw 'Max Counter reached'
                    }
                    if(messageBody.error){
                        expect(messageBody.type).toEqual('Error');
                        expect(messageBody.error).toEqual('Bad formatted payload, non JSON');
                        wsClient.terminate()
                        setTimeout(() => {
                            resolve(1)
                        },100)
                    }
                    counter++;
                } catch (error) {                   
                    reject(error)
                    wsClient.terminate()
                    setTimeout(() => {
                        resolve(1)
                    },100)
                }
            };
        })
    });
});