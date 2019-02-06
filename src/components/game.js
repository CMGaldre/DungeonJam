import React from 'react';
import Player from './player.js';
import {Narrator} from './narrator.js'; //TODO: Move to Game UI Component
import {GameMap} from './gamemap.js';
import {Options} from './options.js'; //TODO: Move to Game UI Component

class Game extends React.Component {
  generateZone = (size) => {
    var tiles = Array();
   
    //if(!size){

      //A new game! Generate a Starting point //ToDo: randomize Starts
      var startTile = {type: "forest", level:0, position:{x:0,y:0} };
      tiles.push(startTile);
    //}

    return tiles;

  }

  generateTile = (parent, position) => {
    //using information of the bordering tile (parent) generate a new tile.
    //ToDo: add random tile generation

    //generate type
    // based on the parent type create a probability array and pass it to a randomizing return function
    //console.log(parent);

    var types = [];

    switch(parent.type)
    {
      case "field":
        types.push(...["field","field","field","forest","forest","mountain"]);
      break;
      case "forest":
        types.push(...["forest","forest","forest","field","mountain","mountain"])
      break;
      case "mountain":
        types.push(...["mountain","mountain","mountain","field","forest"])
        break;
      default:
      break;
    }

    return {type: this.getModType(types), level:0, position:{x:position.x,y:position.y} }
  }

  //return a random object from an array passed in
  getModType = (types) => {
  var mod = Math.floor(Math.random() * types.length);
  return types[mod];
  }

  //call events that occur on each tick
  intervalFunc = () => {

  //Get Action from Twitch Queue
  }

  constructor(props)
  {
    super(props);
    //this.handleMove = this.handleMove.bind(this);

    var startZone = this.generateZone();

    //todo:load state from current active character
    this.state = {
    coords:{x: 0, y: 0},
    mapcoords:{x:0, y:0},
    map: startZone,
    player: {name: "test", class:"fighter"},
    
    };

    //start the interval timer
    //setInterval(this.intervalFunc, 3000);
  }
  
  //Movement and Map Code
  handleMove = (event) => {
    var updatedCoords = this.processCoords(event.key, this.state.coords, this.state.mapcoords)
    console.log(updatedCoords);

    var updatedMap = this.updateMap(this.state.map, updatedCoords.newcoords);

    this.setState({coords:updatedCoords.newcoords, mapcoords:updatedCoords.newmap});  
  }

  //Using updated Coords refresh the los and add tiles to map array
  //todo: map should eventually be a document collection in mongo
  updateMap = (map, coords) =>{

  //Get Tile nearest player defined by its origin
    this.baseTile = this.getClosestTile(coords,map); 
    let newMap = map;

    var template = this.getTemplateLos(this.baseTile);

    var newLos = Array();

    template.forEach(function(tile){

    //Check if the six border tiles exist, if they do not, generate them
      var foundTile = map.find(mTile => mTile.position.x == tile.position.x && mTile.position.y==tile.position.y);
      //console.log(foundTile);

      if(foundTile){
        //newLos.push(foundTile);
      }
      else{
        var newTile = this.generateTile(this.baseTile,tile.position);

        newMap.push(newTile);
      }

    },this)

    this.setState({map:newMap});

  }

  getTemplateLos = (baseTile) =>{

    //empty array for our new los
    var tiles = Array();
    //new los should have set coords based on baseTile
    //North
    tiles.push({position:{x:baseTile.position.x, y:baseTile.position.y+72}});
    //North East
    tiles.push({position:{x:baseTile.position.x+48, y:baseTile.position.y+36}});
    //East
    tiles.push({position:{x:baseTile.position.x+96, y:baseTile.position.y}});
    //South East
    tiles.push({position:{x:baseTile.position.x+48, y:baseTile.position.y-36}});
    //South
    tiles.push({position:{x:baseTile.position.x, y:baseTile.position.y-72}});
    //South West
    tiles.push({position:{x:baseTile.position.x-48, y:baseTile.position.y-36}});
    //West
    tiles.push({position:{x:baseTile.position.x-96, y:baseTile.position.y}});
    //North West
    tiles.push({position:{x:baseTile.position.x-48, y:baseTile.position.y+36}});

    return tiles;
  }

  getClosestTile = (player,map) =>{
    var closestTile;
    var distance = 900;

    map.forEach(function(tile){
        var tempDist = this.getDistance(player,tile.position);
        console.log(player,tempDist,distance,tile);

        if (distance>tempDist)
        {
          distance = tempDist;
          closestTile = tile;
        }

      },this)

    return closestTile;
  }

  getDistance = (a,b) =>{
    var xDiff = Math.pow(a.x - b.x,2);
    var yDiff = Math.pow(a.y-b.y,2);   
    
    return Math.sqrt(xDiff+yDiff);
  }

  processCoords = (direction, coords, mapcoords) =>
  {
    var speed = 5;
    var y = coords.y;
    var x = coords.x;
    var mapy=mapcoords.y;
    var mapx=mapcoords.x;

     switch(direction) {
    case 'w': y= y+speed;
              mapy=mapy-speed;
      break;
    case 'q': x = x+speed; 
              y = y+speed;
              mapx = mapx-speed;
              mapy = mapy-speed;
      break;
    case 'e': x = x-speed; 
              y = y+speed;
              mapx = mapx+speed;
              mapy = mapy-speed;
      break;
    case 'a': x = x-speed;
              mapx = mapx+speed; 
      break;
    case 's': y = y-speed;
              mapy = mapy+speed;
      break;
    case 'd': x = x+speed; 
              mapx = mapx-speed;
      break;
    case 'z': x = x+speed; 
              y = y-speed;
              mapx = mapx-speed;
              mapy = mapy+speed;
      break;
    case 'x': x = x-speed; 
              y = y-speed;
              mapx = mapx+speed;
              mapy = mapy+speed;
       break;
    default:
       break;
    }

    return{newcoords:{x:x,y:y}, newmap:{x:mapx,y:mapy}}
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
       {/* -<Title /> --> */}
      <div className="scan-line"/>
      <Options value={this.state}/>
      <div className="map-wrap">
      <Player />
      <GameMap value={this.state}/>
      </div>
      <Narrator />
      </div>
    );
  }
}

export default Game;