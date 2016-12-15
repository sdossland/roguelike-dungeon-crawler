/**
 * Created by sophia on 11/5/16.
 */
import React from 'react';
import Cell from './Cell';
import {bgColors} from './App';
import {cellDisplay} from  './App';

var Legend = React.createClass({
    render: function () {
        return (
            <div className="container row">
                <div style={{fontSize: '16px', fontWeight: 'bold', textDecoration: 'underline'}}>Legend:</div>
                <div className="legendRow"><Cell style={{backgroundColor: bgColors.Blue, display: cellDisplay.InlineBlock}} /> : Player</div>
                <div className="legendRow"><Cell style={{backgroundColor: bgColors.Green, display: cellDisplay.InlineBlock}}/> : Health</div>
                <div className="legendRow"><Cell style={{backgroundColor: bgColors.Red, display: cellDisplay.InlineBlock}} /> : Next Level</div>
                <div className="legendRow"><Cell style={{backgroundColor: bgColors.Yellow, display: cellDisplay.InlineBlock}} /> : Weapon</div>
                <div className="legendRow"><Cell style={{backgroundColor: bgColors.Purple, display: cellDisplay.InlineBlock}} /> : King</div>
            </div>
        )
    }
});

export default Legend;
