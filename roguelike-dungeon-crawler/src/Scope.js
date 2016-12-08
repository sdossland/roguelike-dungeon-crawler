/**
 * Created by sophia on 12/2/16.
 */
import React from 'react';

var Scope = React.createClass({
    var row = this.props.playerCurrentPosition[0],
        col = this.props.playerCurrentPosition[1],
        scopeCells = [];
//5 center rows of scope
for (var i=-2; i<3; i++) {
    for (var j=-4; j<5; j++) {
        scopeCells.push(cells[row + i][col + j]);
    }
    return scopeCells;
},
//top 3 rows of scope
//bottom 3 rows of scope
    render: function() {
        return (
          <div>

          </div>
        )
    }
})

export default Scope;