import React from 'react';
import ReactDOM from 'react-dom';
import './css/main.css';

class Title extends React.Component {
  render() {
    return (
      <h1 className="title">Dungeon Jam
      <span className="subtext">ver 0.0.1</span>
      </h1>
    );
  }
}

class Game extends React.Component {
  render() {
    return (
      <div className="title-box">
          <Title />
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
