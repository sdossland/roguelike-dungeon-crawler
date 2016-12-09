/**
 * Created by sophia on 12/2/16.
 */
import React from 'react';

var Scope = React.createClass({

    scopeCreation: function() {
        var row = this.props.playerCurrentPosition[0],
            col = this.props.playerCurrentPosition[1],
            //scopeCells = [],
            darkCells = this.props.darkCells.slice();

        //top 3 rows of scope
        //row 1
        for (var i=-5; i<-4; i++) {
            for (var j=-1; j<2; j++) {
                darkCells[row + i][col + j].isScope = true;
            }
        }
        this.setState( { darkCells: darkCells});
        //row 2
        // for (var i=-4; i<-3; i++) {
        //     for (var j=-2; j<3; j++) {
        //         scopeCells.push(darkCells[row + i][col + j]);
        //     }
        // }
        //row 3
        // for (var i=-3; i<-2; i++) {
        //     for (var j=-3; j<4; j++) {
        //         scopeCells.push(darkCells[row + i][col + j]);
        //     }
        //     //return scopeCells;
        // }
        //rows 4-8
        //5 center rows of scope
        // for (var i=-2; i<3; i++) { //rows
        //     for (var j=-4; j<5; j++) { //columns
        //         scopeCells.push(darkCells[row + i][col + j]);
        //     }
        //     return scopeCells;
        // }
        //bottom 3 rows of scope
        //row 9
        // for (var i=3; i<4; i++) {
        //     for (var j=-3; j<4; j++) {
        //         scopeCells.push(darkCells[row + i][col + j]);
        //     }
        //     //return scopeCells;
        // }
        //row 10
        // for (var i=4; i<5; i++) {
        //     for (var j=-2; j<3; j++) {
        //         scopeCells.push(darkCells[row + i][col + j]);
        //     }
        // }
        //row 11
        // for (var i=5; i<6; i++) {
        //     for (var j=-1; j<2; j++) {
        //         scopeCells.push(darkCells[row + i][col + j]);
        //     }
        // }
    },

    render: function() {
        return (
          <div className="scope">

          </div>
        )
    }
});

export default Scope;