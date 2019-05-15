import React from 'react';


class Player extends React.Component{
  render(){
    return(
      <div className={`player ${this.props.value.action}`}></div>
    );
  }

}


export default Player;