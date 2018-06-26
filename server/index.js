const path = require('path');
const express = require('express');
const WebSocket = require('uws');

const app = express();
const server = app.listen(3001);
const ws = new WebSocket.Server({ server, clientTracking: true });

app.use(express.static(path.join(__dirname, '../build')));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../build', 'index.html'));
});
