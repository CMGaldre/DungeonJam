import React from 'react';
import axios from 'axios';
import Player from './player.js';
import {Narrator} from './narrator.js'; //TODO: Move to Game UI Component
import {GameMap} from './gamemap.js';
import {Options} from './options.js'; //TODO: Move to Game UI Component
import tileData from '../data/tiles.js';

class Game extends React.Component {


//===Generate Zone of x Size===//
  generateZone = (size) => {
    var tiles = Array();
   
    //if(!size){

      //A new game! Generate a Starting point //ToDo: randomize Starts
      var startTile = {type: "forest", level:0, position:{x:0,y:0} };
      tiles.push(startTile);
    //}

    return tiles;
  }//end of generateZone

//==Generate a Single Tile ===//
  generateTile = (parent, position) => {
    //using information of the bordering tile (parent) generate a new tile.

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
  }//end of generateTile

  //return a random object from an array passed in
  getModType = (types) => {
    var mod = Math.floor(Math.random() * types.length);
    return types[mod];
  }

  //get the most frequent item in an array of like items
  getMostFrequent = (list) => {

        let mf = 1;
        let m = 0;
        let item;
        for (let i=0; i<list.length; i++)
        {
                for (let j=i; j<list.length; j++)
                {
                        if (list[i] == list[j])
                         m++;
                        if (mf<m)
                        {
                          mf=m; 
                          item = list[i];
                        }
                }
                m=0;
        }      
        return item;
  }


  constructor(props)
  {
    super(props);

    var startZone = this.generateZone();

    //todo:load state from current active character
    this.state = {
    coords:{x: 0, y: 0},
    mapcoords:{x:0, y:0},
    map: startZone,
    action: "idle",
    player: {name: "test", class:"fighter"},
    
    };

    //start the interval timer
    setInterval(this.intervalFunc, 10000);
  }

  //call events that occur on each tick
  intervalFunc = (functions) => {

    this.processCommands();
  }

  //Process the Player Commands for the Turn
  processCommands = () =>
  {
     this.getCommands().then(data => {

    if (data.length>0){
      var arr = [];
      data.forEach(function (comm){
          arr.push(comm.Command);     
        });
      this.executeCommand(this.getMostFrequent(arr));

      this.clearCommands(data);
    } 
      });
  }

  clearCommands = (commands) =>{
    var commList = "";
    commands.forEach(function (comm){
      commList = commList+comm._id+",";
    },commList)

    commList = commList.substring(0,commList.length-1);
    
    this.updateCommands(commList);
  }

  updateCommands = (commands)=> {
    try{     
          axios.put('/api/command/'+commands);    
        }
        catch (error){
          console.error(error);
        }
  }

//Get the array of commands from the db
 getCommands =async ()=> {
   try {
        const response = await axios.get('/api/commands');
        return response.data;
      } catch (error) {
        console.error(error);
      }
  }

  //Execute a Command
 executeCommand = (comm) => {

    //rightn now we just have movement, we may later add type
    var updatedCoords = this.processCoords(comm, this.state.coords, this.state.mapcoords)

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

  //Get the line of site based on the active tile baseTile
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

  //Determine the closest tile to a player
  getClosestTile = (player,map) =>{
    var closestTile;
    var distance = 900;

    map.forEach(function(tile){
        var tempDist = this.getDistance(player,tile.position);
        //console.log(player,tempDist,distance,tile);

        if (distance>tempDist)
        {
          distance = tempDist;
          closestTile = tile;
        }

      },this)

    return closestTile;
  }

//Get the distance between two sets of x y coordinates
  getDistance = (a,b) =>{
    var xDiff = Math.pow(a.x - b.x,2);
    var yDiff = Math.pow(a.y-b.y,2);   
    
    return Math.sqrt(xDiff+yDiff);
  }

//Apply movement based on a direction and the current coordinates
  processCoords = (direction, coords, mapcoords) =>
  {
    var speed = 10;
    var y = coords.y;
    var x = coords.x;
    var mapy=mapcoords.y;
    var mapx=mapcoords.x;

     switch(direction) {
    case 'South': y= y+speed;
              mapy=mapy-speed;
      break;
    case 'SouthEast': x = x+speed; 
              y = y+speed;
              mapx = mapx-speed;
              mapy = mapy-speed;
              this.setState({action:"rwalk"});
      break;
    case 'SouthWest': x = x-speed; 
              y = y+speed;
              mapx = mapx+speed;
              mapy = mapy-speed;
              this.setState({action:"lwalk"});
      break;
    case 'West': x = x-speed;
              mapx = mapx+speed; 
              this.setState({action:"lwalk"});
      break;
    case 'North': y = y-speed;
              mapy = mapy+speed;
      break;
    case 'East': x = x+speed; 
              mapx = mapx-speed;
              this.setState({action:"rwalk"});
      break;
    case 'NorthEast': x = x+speed; 
              y = y-speed;
              mapx = mapx-speed;
              mapy = mapy+speed;
              this.setState({action:"rwalk"});
      break;
    case 'NorthWest': x = x-speed; 
              y = y-speed;
              mapx = mapx+speed;
              mapy = mapy+speed;
              this.setState({action:"lwalk"});
       break;
    default: this.setState({action:"idle"});
       break;
    }

    return{newcoords:{x:x,y:y}, newmap:{x:mapx,y:mapy}}
  }

//Render the Game Object
  render() {
    return (
      <div className="game-ui">
       {/* -<Title /> --> */}
      <div className="scan-line"/>
      <Options value={this.state}/>
      <div className="map-wrap">
      <Player value={this.state}/>
      <GameMap value={this.state}/>
      </div>
      <Narrator />
      </div>
    );
  }
}

export default Game;