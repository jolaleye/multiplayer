import React, { Component, Fragment } from 'react';
import ReactDOM from 'react-dom';
import 'bulma/css/bulma.css';

import './main.css';
import Controls from './components/Controls/Controls';
import Game from './components/Game/Game';
import AssetManager from './AssetManager';

class App extends Component {
  state = {
    socket: null,
    assets: null,
    ghost: true,
    interpolation: false,
    prediction: false,
    reconciliation: false,
    disparity: false,
  }

  async componentDidMount() {
    // websocket connection
    const url = process.env.NODE_ENV === 'production'
      ? `wss://${window.location.host}` : 'ws://localhost:3001';
    const socket = new WebSocket(url);
    socket.binaryType = 'arraybuffer';
    socket.onopen = () => this.setState({ socket });

    socket.addEventListener('message', packet => {
      const data = JSON.parse(packet.data);
      if (data._ === 'clientID') socket.id = data.id;
    });

    // load assets
    const assets = await AssetManager.load();
    this.setState({ assets });
  }

  handleControlChange = event => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    const { name } = event.target;

    this.setState({ [name]: value });
  }

  updateDisparity = disparity => {
    // the difference between client and server player state
    this.setState({ disparity });
  }

  render = () => {
    const {
      socket, assets, ghost, interpolation, prediction, reconciliation, disparity,
    } = this.state;

    const settings = { ghost, interpolation, prediction, reconciliation };

    return (
      <Fragment>
        <Controls handleChange={this.handleControlChange}
          ghost={ghost} interpolation={interpolation} prediction={prediction}
          reconciliation={reconciliation} disparity={disparity}
        />
        {
          socket && assets
            ? <Game socket={socket} assets={assets} settings={settings}
                updateDisparity={this.updateDisparity}
              />
            : <div>Loading...</div>
        }
      </Fragment>
    );
  };
}

ReactDOM.render(<App />, document.getElementById('root'));
