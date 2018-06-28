import { Sprite } from 'pixi.js';

import { lerp, angleLerp } from '../../services/util';

class PlayerManager {
  constructor(id, playerTexture, ghostTexture) {
    this.id = id;

    this.player = new Sprite(playerTexture);
    this.player.anchor.set(0.5, 0.5);

    this.ghost = new Sprite(ghostTexture);
    this.ghost.anchor.set(0.5, 0.5);
  }

  sync = (player, timestamp) => {
    // update interpolation points
    this.origin = this.next ? this.next : { timestamp, ...player };
    this.next = { timestamp, ...player };

    // if this manager does not yet have local data, set it
    if (!this.local) this.local = player;

    // show the server position
    this.ghost.position.set(player.pos.x, player.pos.y);
    this.ghost.rotation = player.direction + (Math.PI / 2);
  }

  interpolate = delta => {
    if (!(this.local && this.origin && this.next)) return;

    this.local.pos.x = lerp(this.origin.pos.x, this.next.pos.x, delta);
    this.local.pos.y = lerp(this.origin.pos.y, this.next.pos.y, delta);
    this.local.direction = angleLerp(this.origin.direction, this.next.direction, delta);
  }

  update = () => {
    if (!this.local) return;

    this.player.position.set(this.local.pos.x, this.local.pos.y);
    this.player.rotation = this.local.direction + (Math.PI / 2);
  }
}

export default PlayerManager;
