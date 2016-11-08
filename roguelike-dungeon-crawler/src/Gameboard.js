/**
 * Created by sophia on 11/5/16.
 */
import React from 'react';
import Cell from './Cell';
import {bgColors} from './App';
import {cellDisplay} from './App';

var Gameboard = React.createClass({

    render: function() {
        return (
            <div className="gameboard">
                {this.props.cells.map(function(row) {
                    return row.map(function(/*cell*/) {
                        return (<Cell style={{backgroundColor: bgColors.Grey, display: cellDisplay.Block, float: cellDisplay.LeftFloat}} /*key={cell.row + '_' + cell.key} row={cell.row} column={cell.key} sessionId={sessionId}*/ />);
                    });
                })}


            </div>
        )
    }
});

export default Gameboard;