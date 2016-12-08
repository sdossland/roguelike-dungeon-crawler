/**
 * Created by sophia on 12/2/16.
 */
import React from 'react';
import Cell from './Cell';
// import Gameboard from './Gameboard';
import {bgColors} from './App';

var Darkness = React.createClass( {

    render: function () {
        // var clicked = this.props.darkCells['clicked'];
        // var isActive = this.props.isActive;
        // var toggleDarkness = this.props.toggleDarkness;
        return (
            <div className="darkness">
                 {this.props.darkCells.map(function(row) {
                    return row.map(function(darkCells) {
                        console.log(darkCells.isActive);
                        return (<Cell /*clicked={clicked}*/ /* not onClick ={this.toggleDarkness}*/ style={darkCells.isActive ? {backgroundColor: bgColors['Pink']} : {backgroundColor: bgColors['PurpleNess']}} /*style={{backgroundColor: darkCells.color }}*/ />);
                    });
                 })}
            </div>
            )
    }
});

export default Darkness;