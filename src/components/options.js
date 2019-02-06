import React from 'react';

export class Options extends React.Component{
  render(){
    return(
        <div className="options"> 
       
        <ul className="menu-items">
        <li>Move</li>
        <li>Attack</li>
        <li>Cast</li>
        <li>Use</li>
        <li>Equip</li>
        <li>Talk</li>
        <li>Rest</li>
        </ul>
        <PlayerStatus value={this.props.value} />
        <CommPortrait />
        </div>
      )
  }
}


class PlayerStatus extends React.Component{
  render(){
    return(
      <div className="playerstatus">
      <div className="playername">{this.props.value.player.name}</div>
      <div className="class">{this.props.value.player.class}</div>
      </div>
    );
  }
}

class CommPortrait extends React.Component{
    render(){
        return (
            <div className="dialogportrait"></div>
        );
    }
}
