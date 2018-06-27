import React, { Component } from 'react';
import { Application } from 'pixi.js';

import Game from './Game';

class GameContainer extends Component {
  state = {
    app: null,
  }

  async componentDidMount() {
    const app = new Application();
    await this.setState({ app });
  }

  render = () => (
    this.state.app
      ? <Game app={this.state.app} assets={this.props.assets} />
      : <div>Loading</div>
  );
}

export default GameContainer;
