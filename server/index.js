const path = require('path');
const express = require('express');
const WebSocket = require('uws');
const _ = require('lodash');

const { ID } = require('./services/util');
const Player = require('./Player');

const app = express();
const server = app.listen(3001);
const ws = new WebSocket.Server({ server, clientTracking: true });

app.use(express.static(path.join(__dirname, '../build')));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

let players = [];
const commandQueue = [];

ws.on('connection', client => {
  // assign an ID
  client.id = ID();
  client.send(JSON.stringify({ _: 'clientID', id: client.id }));

  // assign a player
  client.player = new Player(client.id);
  players.push(client.player);

  client.on('message', packet => {
    const data = JSON.parse(packet);
    if (data._ === 'commands') {
      data.targets.forEach(target => commandQueue.push({ id: client.id, target }));
    }
  });

  // remove players when they disconnect
  client.on('close', () => {
    players = players.filter(({ id }) => id !== client.id);
  });
});

// apply client requests
const simulate = () => {
  ws.clients.forEach(client => {
    if (!client.player) return;

    // find all the commands by this client
    const commands = commandQueue.filter(({ id }) => id === client.id);

    // apply commands
    commands.forEach(command => {
      client.player.move(command.target);
    });

    // remove all of this client's commands from the queue
    _.remove(commandQueue, ({ id }) => id === client.id);
  });
};

// take a snapshot of the game state & send to clients
const snapshot = () => {
  ws.clients.forEach(client => {
    client.send(JSON.stringify({ _: 'snapshot', timestamp: Date.now(), players }));
  });
};

setInterval(simulate, 15);
setInterval(snapshot, 50);
