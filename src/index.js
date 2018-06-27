import React, { Component, Fragment } from 'react';
import ReactDOM from 'react-dom';
import 'bulma/css/bulma.css';

import './main.css';
import Controls from './components/Controls/ControlsContainer';
import Game from './components/Game/GameContainer';
import AssetManager from './AssetManager';

class App extends Component {
  state = {
    socket: null,
  }

  async componentDidMount() {
    // websocket connection
    const url = process.env.NODE_ENV === 'production'
      ? `wss://${window.location.host}` : 'ws://localhost:3001';
    const socket = new WebSocket(url);
    socket.binaryType = 'arraybuffer';
    this.setState({ socket });

    // load assets
    const assets = await AssetManager.load();
    this.setState({ assets });
  }

  render = () => {
    const { socket, assets } = this.state;

    return (
      <Fragment>
        <Controls />
        {
          socket && assets
            ? <Game assets={assets} /> : <div>Loading</div>
        }
      </Fragment>
    );
  };
}

ReactDOM.render(<App />, document.getElementById('root'));
