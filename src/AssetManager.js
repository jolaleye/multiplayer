import { loader, Spritesheet } from 'pixi.js';

import atlas from './assets/atlas.json';
import spritesheet from './assets/spritesheet.png';

class AssetManager {
  load = () => new Promise(resolve => {
    loader.add(spritesheet).load(() => {
      const sprites = new Spritesheet(loader.resources[spritesheet].texture.baseTexture, atlas);
      sprites.parse(textures => resolve(textures));
    });
  });
}

export default new AssetManager();
