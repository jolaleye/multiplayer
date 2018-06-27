import { loader } from 'pixi.js';

import activePlayer from './assets/active-player.png';
import activeGhost from './assets/active-ghost.png';
import otherPlayer from './assets/other-player.png';
import otherGhost from './assets/other-ghost.png';

class AssetManager {
  load = () => (
    new Promise(resolve => {
      loader
        .add('activePlayer', activePlayer)
        .add('activeGhost', activeGhost)
        .add('otherPlayer', otherPlayer)
        .add('otherGhost', otherGhost)
        .load(() => resolve(loader.resources));
    })
  )
}

export default new AssetManager();
