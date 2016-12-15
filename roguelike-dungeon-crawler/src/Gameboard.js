/**
 * Created by sophia on 11/5/16.
 */
import React from 'react';
import Cell from './Cell';
// import { bgColors } from './App';
import Darkness from './Darkness';

var Gameboard = React.createClass({
    componentDidMount: function() {
        this.props.initialCellCreation();
        document.addEventListener("keydown", this.handleDirections);
    },
    verifyNeighborCell: function (x, y) {
    if (x<0 || x>59 || y<0 || y>59) {
    } else if(this.props.cells[x][y].color === '#080') { //green..health
        this.props.obtainHealth();
        this.props.movePlayer(x, y);
    } else if (this.props.cells[x][y].color === '#fc0') { //yellow..weapon
        this.props.obtainWeapon();
        this.props.movePlayer(x, y);
    } else if (this.props.cells[x][y].color === '#c00') { //red..enemy
        //must distinguish between enemy and boss. perhaps make boss darker red #800000
        this.props.attackEnemy(x, y);
    } else if (this.props.cells[x][y].color === '#4d0099') { //purple..king
        this.props.attackKing(x, y);
    } else if (this.props.cells[x][y].color === '#999') { //grey..board
        this.props.movePlayer(x, y);
    }
    },
    handleDirections: function(e) {
        /*row, column*/
        var keyStrokes = [[1,0], [-1,0], [0,1], [0,-1]];
        var x, y;
        var currentPositionX = this.props.playerCurrentPosition[0][0],
            currentPositionY = this.props.playerCurrentPosition[0][1];
        if (e.keyCode === 38) { //up
            x = currentPositionX + keyStrokes[1][0];
            y = currentPositionY + keyStrokes[1][1];
            this.verifyNeighborCell(x, y);
        } else if (e.keyCode === 40) { //down
            x = currentPositionX + keyStrokes[0][0];
            y = currentPositionY + keyStrokes[0][1];
            this.verifyNeighborCell(x, y);
        } else if (e.keyCode === 39) { //right
            x = currentPositionX + keyStrokes[2][0];
            y = currentPositionY + keyStrokes[2][1];
            this.verifyNeighborCell(x, y);
        } else if (e.keyCode === 37) { //left
            x = currentPositionX + keyStrokes[3][0];
            y = currentPositionY + keyStrokes[3][1];
            this.verifyNeighborCell(x, y);
        }
        // this.props.movePlayer(x, y);
    },
    render: function() {
        return (
            <div className="gameboard" >
                <Darkness darkCells={this.props.darkCells} />
                {this.props.cells.map(function(row) {
                    return row.map(function(cell) {
                        return (<Cell style={{ backgroundColor: cell.color }} />);
                    });
                })}
            </div>
        )
    }
});

export default Gameboard;