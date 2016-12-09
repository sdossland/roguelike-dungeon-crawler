/**
 * Created by sophia on 12/2/16.
 */
import React from 'react';
import Cell from './Cell';
// import Scope from './Scope';
import {bgColors} from './App';

var Darkness = React.createClass( {

    render: function () {
        return (
            <div className="darkness">
                 {this.props.darkCells.map(function(row) {
                    return row.map(function(darkCells) {
                        return (<Cell style={darkCells.isActive ? {backgroundColor: bgColors['Black']} : {backgroundColor: 'transparent'}}/>);
                    });
                 })}
            </div>
            )
    }
});

export default Darkness;