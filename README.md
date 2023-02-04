
## Node.js Web Socket Server/Client Demo

A simple web socket client/server demonstration using  [ws](https://github.com/websockets/ws) websocket library.

### Install
#### Use min node version `v14.17.4`

```bash
npm install
```
### Add a `.env` file to your project with below vars

```bash
WS_PORT=5000
WS_HOST=ws://localhost
```

### Tests

After installation run the tests.

```bash
npm run test
```
#### Test Cases
- Should send heartbeat event every second
- Should send Subscribed status after Subscribe event
- Should send Unsubscribed status after Unsubscribe event
- Should send Subscriber Count after CountSubscribers event
- Should send Error type for unrecognized method
- Should send Error type for malformed json
### Run Server

```bash
node ws_server.js
```

### Run Client

```bash
node ws_client.js
```

### Client payload
To increment subscriber count.
```js
{
  type: "Subscribe" 
}
```

To decrement subscriber count.
```js
{
  type: "Unscubscribe" 
}
```

To get subscriber count.
```js
{
  type: "CountSubscribers" 
}
```
