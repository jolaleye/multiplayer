import React, { Component, createRef } from 'react';

import './Game.css';

class Game extends Component {
  view = createRef();

  componentDidMount() {
    const { view, renderer } = this.props.app;
    this.view.current.appendChild(view);

    renderer.autoResize = true;
    window.addEventListener('resize', this.resize);
    this.resize();

    renderer.backgroundColor = 0x0a0a0a;
  }

  resize = () => {
    const { view, renderer } = this.props.app;
    const parent = view.parentNode;
    renderer.resize(parent.clientWidth, parent.clientHeight);
  }

  render = () => <div className="game" ref={this.view} />
}

export default Game;
