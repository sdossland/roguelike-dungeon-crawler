/**
 * Created by sophia on 11/5/16.
 */
import React from 'react';
import Cell from './Cell';
import { bgColors } from './App';
import Darkness from './Darkness';
// import Scope from './Scope';

var Gameboard = React.createClass({
    componentDidMount: function() {
        document.addEventListener("keydown", this.handleDirections);
        this.props.updateCells(this.props.playerCurrentPosition[0],this.props.playerCurrentPosition[1], {color: bgColors['Blue']});
        for (var j=0; j<4; j++) {
            this.props.updateCells(this.props.healthCells[j][0], this.props.healthCells[j][1], {color: bgColors['Green']});
        }
        for (var i=0; i<5; i++) {
            this.props.updateCells(this.props.enemyCells[i][0], this.props.enemyCells[i][1], {color: bgColors['Red']});
        }
        this.props.updateCells(this.props.king[0], this.props.king[1], {color: bgColors['Purple']}); //king
        this.props.updateCells(this.props.weapon[0], this.props.weapon[1], {color: bgColors['Yellow']}); //weapon
        this.props.scope();
    },
    handleDirections: function(e) {
        /*row, column*/
        var keyStrokes = [[1,0], [-1,0], [0,1], [0,-1]];
        var x, y;
        var currentPositionX = this.props.playerCurrentPosition[0],
            currentPositionY = this.props.playerCurrentPosition[1];
        //if x,y === blank, then execute the following
        /*arrow => up*/
        if (e.keyCode === 38) {
            x = currentPositionX + keyStrokes[1][0];
            y = currentPositionY + keyStrokes[1][1];
            if (this.props.cells[x][y].color === '#080') { //green..health
                this.props.obtainHealth();
            } else if (this.props.cells[x][y].color === '#fc0') { //yellow..weapon
                this.props.obtainWeapon();
            } else if (this.props.cells[x][y].color === '#c00') { //red..enemy
                //this.props.attackEnemy();
            }
            //this.props.scope();
        } /*arrow => down*/
        else if (e.keyCode === 40) {
            x = currentPositionX + keyStrokes[0][0];
            y = currentPositionY + keyStrokes[0][1];
            if (this.props.cells[x][y].color === '#080') { //green
                this.props.obtainHealth();
            } else if (this.props.cells[x][y].color === '#fc0') { //yellow
                this.props.obtainWeapon();
            }
        } /*arrow => right*/
        else if (e.keyCode === 39) {
            x = currentPositionX + keyStrokes[2][0];
            y = currentPositionY + keyStrokes[2][1];
            if (this.props.cells[x][y].color === '#080') { //green
                this.props.obtainHealth();
            } else if (this.props.cells[x][y].color === '#fc0') { //yellow
                this.props.obtainWeapon();
            }
        } /*arrow => left*/
        else if (e.keyCode === 37) {
            x = currentPositionX + keyStrokes[3][0];
            y = currentPositionY + keyStrokes[3][1];
            if (this.props.cells[x][y].color === '#080') { //green
                this.props.obtainHealth();
            } else if (this.props.cells[x][y].color === '#fc0') { //yellow
                this.props.obtainWeapon();
            }
        }
        this.props.movePlayer(x, y);
    },
    render: function() {
        return (
            <div className="gameboard" >
                <Darkness darkCells={this.props.darkCells} />
                {this.props.cells.map(function(row) {
                    return row.map(function(cell) {
                        return (<Cell style={{backgroundColor: cell.color }} />);
                    });
                })}
            </div>
        )
    }
});

export default Gameboard;