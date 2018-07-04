import { Sprite } from 'pixi.js';
import _ from 'lodash';

import { lerp, angleLerp, getDistance } from '../../services/util';

class PlayerManager {
  constructor(id, playerTexture, ghostTexture) {
    this.id = id;
    this.history = [];

    this.player = new Sprite(playerTexture);
    this.player.anchor.set(0.5, 0.5);

    this.ghost = new Sprite(ghostTexture);
    this.ghost.anchor.set(0.5, 0.5);
  }

  sync = (player, timestamp, ghost) => {
    // update interpolation points
    this.origin = this.next ? this.next : { timestamp, ...player };
    this.next = { timestamp, ...player };

    // if this manager does not yet have local data, set it
    if (!this.local) this.local = player;

    // show the server position if the ghost is turned on
    if (ghost) {
      this.ghost.visible = true;
      this.ghost.position.set(player.pos.x, player.pos.y);
      this.ghost.rotation = player.direction + (Math.PI / 2);
    } else this.ghost.visible = false;
  }

  interpolate = (delta, interpolate) => {
    if (!(this.local && this.origin && this.next)) return;

    // either interpolate between origin and next or sync with the server depending on the setting
    if (interpolate) {
      this.local.pos.x = lerp(this.origin.pos.x, this.next.pos.x, delta);
      this.local.pos.y = lerp(this.origin.pos.y, this.next.pos.y, delta);
      this.local.direction = angleLerp(this.origin.direction, this.next.direction, delta);
    } else {
      this.local = this.next;
    }
  }

  predict = target => {
    const distance = getDistance(this.local.pos.x, target.x, this.local.pos.y, target.y);
    this.local.direction = Math.atan2(distance.y, distance.x);

    const dx = 5 * Math.cos(this.local.direction);
    const dy = 5 * Math.sin(this.local.direction);

    this.local.pos.x += dx;
    this.local.pos.y += dy;
  }

  reconcile = (player, lastAcknowledged) => {
    // discard history up to the last acknowledged command
    this.history = _.dropWhile(this.history, ({ tick }) => tick <= lastAcknowledged);

    // apply unacknowledged commands to the server's state
    const serverState = player;
    this.history.forEach(({ target }) => {
      const distance = getDistance(serverState.pos.x, target.x, serverState.pos.y, target.y);
      const direction = Math.atan2(distance.y, distance.x);

      const dx = 5 * Math.cos(direction);
      const dy = 5 * Math.sin(direction);

      serverState.pos.x += dx;
      serverState.pos.y += dy;
      serverState.direction = direction;
    });

    // the difference between the local state and the server state + unacknowledged input
    this.disparity = {
      pos: getDistance(this.local.pos.x, serverState.pos.x, this.local.pos.y, serverState.pos.y),
      direction: this.local.direction - serverState.direction,
    };

    if (this.disparity.pos > 3) this.local = serverState;
  }

  update = () => {
    if (!this.local) return;

    this.player.position.set(this.local.pos.x, this.local.pos.y);
    this.player.rotation = this.local.direction + (Math.PI / 2);
  }
}

export default PlayerManager;
