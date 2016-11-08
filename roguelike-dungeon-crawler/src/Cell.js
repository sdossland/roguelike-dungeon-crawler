/**
 * Created by sophia on 11/5/16.
 */
import React from 'react';

var Cell = React.createClass({
   render: function () {
       return (
           <div className={this.props.player ? "player" : "basic"} id="cell" style={this.props.style} >

           </div>
       )
   }
});

export default Cell;