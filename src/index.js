import React from 'react';
import ReactDOM from 'react-dom';
import * as twitchbot from './twitchbot.js'; 
import Game from './components/game.js';
import './css/main.css';

//Initial Loading Screen Title
class Title extends React.Component {
  render() {
    return (
      <h1 className="title">Dungeon Jam
      <span className="subtext">ver 0.0.11</span>
      </h1>
    );
  }
}


ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
