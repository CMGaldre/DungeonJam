import React from 'react';


export class GameMap extends React.Component{
  //render a single tile with the tile object passed to the Tile component
  renderTile = (tile) => {
    return <Tile value={tile} />;
  }

  //load the initial line of site from the state
  loadLOS = () => {
    let initialLOS = Array();

    this.props.value.map.forEach(function(tile){
       initialLOS.push(<li>{this.renderTile(tile)}</li>)
    },this);

    return initialLOS;
  }

  render(){
      var offset = 420; //nice
      var mapPos = {left: this.props.value.mapcoords.x+offset+'px',
            top:this.props.value.mapcoords.y+offset+'px',
            position:'absolute'
      }
    return(
      <ul className="map" style={mapPos}>
        {this.loadLOS()}
      </ul>
    )
  }
}

//72px x 72px hexagon object
class Tile extends React.Component{
  render(){
 
    var tilePos = {
      left: this.props.value.position.x  + 'px',
      top: this.props.value.position.y  + 'px',
      position:'absolute'
    }
    return(
      <div className={`tile ${this.props.value.type}`} style={tilePos}></div>
    )
  }
}

