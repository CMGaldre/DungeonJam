import React from 'react';
import ReactDOM from 'react-dom';
import * as twitchbot from './twitchbot.js'; 
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

class Player extends React.Component{
  render(){
    return(
      <div className="player"></div>
    );
  }
}

class Narrator extends React.Component{
  render(){
    return(
      <div className="narrator-box"></div>
    );
  }
}


class Map extends React.Component{
  renderTile = (i) => {
    return <Tile />;
  }

  loadMap = () => {
  let tiles = []

    for (let i = 0; i < 400; ++i)
    {
     tiles.push(<li>{this.renderTile(i)}</li>)
    }
    return tiles
  }

  render(){
    return(
      <ul className="map" style={{left:this.props.value.x+'px', top:this.props.value.y+'px'}}>
      {this.loadMap()}
      </ul>
    )
  }
}

class Tile extends React.Component{
  render(){
    return(
      <div className="tile"></div>
    )
  }
}


class Game extends React.Component {
  constructor(props)
  {
    super(props);
    //this.handleMove = this.handleMove.bind(this);

    //todo:load state from current active character
    this.state = {coords:{x: 0, y: 0}};
  }
  
//Temporary movement Code
  handleMove = (event) => {
    this.setState({coords:this.processCoords(event.key, this.state.coords.x, this.state.coords.y)});  
  }

  processCoords = (direction, x, y) =>
  {
    var speed = 5;

     switch(direction) {
    case 'w': y= y+speed;
      return {x: x, y: y};
    case 'q': x = x+speed; 
              y = y+speed;
      return {x: x, y: y};
    case 'e': x = x-speed; 
              y = y+speed;
      return {x: x, y: y};
    case 'a': x = x-speed; 
      return {x: x, y: y};
    case 's': y = y-speed;
      return {x: x, y: y};
    case 'd': x = x+speed; 
      return {x: x, y: y};
    case 'z': x = x+speed; 
              y = y-speed;
      return {x: x, y: y};
    case 'x': x = x-speed; 
              y = y-speed;
     return {x: x, y: y};
    default:
       return {x: x, y: y};
    }
  }
    componentDidMount(){
    document.addEventListener("keydown", this.handleMove, false);
  }
  componentWillUnmount(){
    document.removeEventListener("keydown", this.handleMove, false);
  }
  
//End of Temporary Movement Code


  render() {
    return (
      <div className="game-ui">
      <Title />
      <div className="map-wrap">
      <Player />
      <Map value={this.state.coords}/>
      </div>
      <Narrator />
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
