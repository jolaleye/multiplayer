import React, { Component, createRef } from 'react';
import { Application } from 'pixi.js';
import _ from 'lodash';

import './Game.css';
import PlayerManager from './PlayerManager';

class Game extends Component {
  view = createRef();
  app = null;

  tick = 0;
  playerManagers = [];
  targetQueue = [];
  elapsedSinceSnapshot = 0;

  componentDidMount() {
    this.app = new Application({ antialias: true });
    const { renderer, view, ticker } = this.app;

    this.view.current.appendChild(view);

    renderer.autoResize = true;
    renderer.backgroundColor = 0x0a0a0a;

    window.addEventListener('resize', this.resize);
    this.resize();

    this.inputTick = window.setInterval(this.inputTicker, 15);
    ticker.add(this.update);

    const { socket } = this.props;

    socket.addEventListener('message', packet => {
      const data = JSON.parse(packet.data);
      if (data._ === 'snapshot') this.sync(data);
    });

    socket.addEventListener('close', () => {
      window.clearInterval(this.inputTick);
    });
  }

  resize = () => {
    const { renderer, view } = this.app;
    const parent = view.parentNode;
    renderer.resize(parent.clientWidth, parent.clientHeight);
  }

  render = () => <div className="game" ref={this.view} />;


  update = () => {
    const { socket, settings } = this.props;

    this.elapsedSinceSnapshot += this.app.ticker.elapsedMS;
    this.playerManagers.forEach(manager => {
      if (!(manager.origin && manager.next)) return;

      // interpolate other players between the last two snapshots
      // only interpolate the current player if prediction is off
      if ((manager.id !== socket.id) || !settings.prediction) {
        const smoothPeriod = manager.next.timestamp - manager.origin.timestamp;
        const delta = this.elapsedSinceSnapshot / smoothPeriod;
        manager.interpolate(_.clamp(delta, 0, 1), settings.interpolation);
      }

      manager.update();
    });
  }

  inputTicker = () => {
    const { socket, settings } = this.props;
    this.tick += 1;

    const target = this.app.renderer.plugins.interaction.mouse.global;
    socket.send(JSON.stringify({ _: 'command', target, tick: this.tick }));

    // client prediction
    if (settings.prediction) {
      const manager = this.playerManagers.find(({ id }) => id === socket.id);
      if (settings.reconciliation) manager.history.push({ target, tick: this.tick });
      manager.predict(target);
    }
  }

  sync = snapshot => {
    const { socket, settings } = this.props;

    // remove managers for players who are no longer present
    this.playerManagers.forEach(manager => {
      if (snapshot.players.some(({ id }) => id === manager.id)) return;

      // remove the manager if no player shares the id
      this.app.stage.removeChild(manager.player, manager.ghost);
      this.playerManagers = this.playerManagers.filter(mngr => mngr.id !== manager.id);
    });

    snapshot.players.forEach(player => {
      let manager = this.playerManagers.find(({ id }) => id === player.id);

      // create a manager if this player doesn't have one
      if (!manager) {
        const { assets } = this.props;

        const playerTexture = player.id === socket.id
          ? assets['active-player.png'] : assets['other-player.png'];
        const ghostTexture = player.id === socket.id
          ? assets['active-ghost.png'] : assets['other-ghost.png'];

        manager = new PlayerManager(player.id, playerTexture, ghostTexture);
        this.playerManagers.push(manager);
        this.app.stage.addChild(manager.player, manager.ghost);
      }

      manager.sync(player, snapshot.timestamp, this.props.settings.ghost);

      // if this manager belongs to the active player and prediction & reconciliation are on...
      // then reconcile with the server's state
      if (manager.id === socket.id && settings.prediction && settings.reconciliation) {
        manager.reconcile(player, snapshot.lastAcknowledged);
      }
    });

    this.elapsedSinceSnapshot = 0;
  }
}

export default Game;
