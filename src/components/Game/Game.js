import React, { Component, createRef } from 'react';
import { Application } from 'pixi.js';

import './Game.css';

class Game extends Component {
  view = createRef();
  app = null;

  componentDidMount() {
    this.app = new Application({ antialias: true });

    const { renderer, view } = this.app;
    this.view.current.appendChild(view);

    renderer.autoResize = true;
    renderer.backgroundColor = 0x0a0a0a;

    window.addEventListener('resize', this.resize);
    this.resize();
  }

  resize = () => {
    const { renderer, view } = this.app;
    const parent = view.parentNode;
    renderer.resize(parent.clientWidth, parent.clientHeight);
  }

  render = () => <div className="game" ref={this.view} />
}

export default Game;
