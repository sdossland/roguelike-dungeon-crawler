import React from 'react';
import Stats from './Stats';
import Gameboard from './Gameboard';
import Legend from './Legend';
import './App.css';

var bgColors = {
    "Blue": "#1a1aff",
    "Green": "#080",
    "Red": "#c00",
    "Yellow": "#fc0",
    "Purple": "#60f",
    "Grey": "#999"
};

var cellDisplay = {
    "Block": 'block',
    "LeftFloat": 'left',
    "InlineBlock": 'inline-block'
};

var Board = React.createClass({
    getInitialState: function () {
      return ({
          health: 100,
          weapon: 'stick',
          attack: 7,
          level: 0,
          nextLevel: 60,
          dungeon: 0
      });
    },

    calculateCells: function(numCellsHeight, numCellsWidth /*, isActive*/) {
        var cellArr = [];
        for (var i=0; i<numCellsHeight; i++) {
            var row = [];
            for (var j=0; j<numCellsWidth; j++) {
                //this.isActive = Math.random() > isActive;
                row.push({ key: j, row: i /*, isActive: this.isActive*/ });
            }
            cellArr.push(row);
        }
        return cellArr;
    },
    componentWillMount: function() {
        this.setState({
            cells: this.calculateCells(60, 60)
        });
    },

  render: function() {
    return (
        <div>
            <h2 className="appTitle">React Roguelike</h2>
            <h5 className="appTitle">Kill the boss in dungeon 4</h5>
            <Stats health={this.state.health} weapon={this.state.weapon} attack={this.state.attack} level={this.state.level} nextLevel={this.state.nextLevel} dungeon={this.state.dungeon} />
            <Gameboard cells={this.state.cells} />
            <Legend />
        </div>
    );
  }
});

export default Board;
export {bgColors}
export {cellDisplay}