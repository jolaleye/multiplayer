const { getDistance } = require('./services/util');

class Player {
  constructor(id) {
    this.id = id;
    this.pos = { x: 0, y: 0 };
    this.direction = 0;
  }

  move(target) {
    const distance = getDistance(this.pos.x, target.x, this.pos.y, target.y);
    this.direction = Math.atan2(distance.y, distance.x);

    const dx = 5 * Math.cos(this.direction);
    const dy = 5 * Math.sin(this.direction);

    this.pos.x += dx;
    this.pos.y += dy;
  }
}

module.exports = Player;
