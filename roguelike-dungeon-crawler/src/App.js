import React from 'react';
import Stats from './Stats';
import Gameboard from './Gameboard';
import Legend from './Legend';
import './App.css';

/*RULES:
* -1 player per game
* -4 health per game
* -5 enemies per game
* -1 weapon per game
* -1 king per game*/

var bgColors = {
    "Blue": "#1a1aff", //player
    "Green": "#080", //health
    "Red": "#c00", //enemy
    "Yellow": "#fc0", //weapon
    "Purple": "#4d0099", //king
    "Grey": "#999"
};

var cellDisplay = {
    "Block": 'block',
    "LeftFloat": 'left',
    "InlineBlock": 'inline-block'
};

function calculateCells(numRows, numColumns /*, isActive*/) {
    var cellArr = [];
    for (var i=0; i<numRows; i++) {
        var row = [];
        for (var j=0; j<numColumns; j++) {
            row.push({ isPlayer: false, color: bgColors['Grey'] /*, isActive: this.isActive*/ });
        }
        cellArr.push(row);
    }
    return cellArr;
}

//creates 5 randomly placed enemies
function calculateEnemies(x, y) {
    var enemies = [],
        i = 0;
    while (i < 5) {
        var randomEnemy = [Math.round(Math.random() * x), Math.round(Math.random() * y)];
        enemies.push(randomEnemy);
        i++;
    }
    return enemies;
}

//creates 4 randomly placed health cells
function calculateHealthAgents(x, y) {
    var healthAgents = [],
        i = 0;
    while (i < 4) {
        var randomHealthAgent = [Math.round(Math.random() * x), Math.round(Math.random() * y)];
        healthAgents.push(randomHealthAgent);
        i++;
    }
    return healthAgents;
}

// var player = {
//     health: 20,
//     attack: 12,
//     nextLevel: 60
// }

// var enemy = {
//     health: 20,
//     attack: 12,
//     nextLevel: 10
// }

var weapon = [
    {
        name: 'stick',
        attack: 5
    },
    {
        name: 'brass knuckles',
        attack: 7
    },
    {
        name: 'serrated daggers',
        attack: 12
    },
    {
        name: 'katana',
        attack: 16
    },
    {
        name: 'reaper\'s scythe',
        attack: 22
    },
    {
        name: 'large trout',
        attack: 30
    }
]

var Board = React.createClass({
    getInitialState: function () {
        var numRows = 60,
            numColumns = 60;
      return ({
          healthStats: 100,
          weaponStats: 'stick',
          attack: 7,
          level: 0,
          nextLevel: 60,
          dungeon: 0,
          cells: calculateCells(numRows,numColumns),
          playerCurrentPosition: [Math.round(Math.random() * numRows), Math.round(Math.random() * numColumns)],
          healthCells: calculateHealthAgents(numRows, numColumns),
          enemyCells: calculateEnemies(numRows, numColumns),
          king: [Math.round(Math.random() * numRows), Math.round(Math.random() * numColumns)],
          weapon: [Math.round(Math.random() * numRows), Math.round(Math.random() * numColumns)]
      });
    },
    obtainHealth: function() {
          var finalPlayerHealth = this.state.healthStats + 20;
          this.setState({
            healthStats: finalPlayerHealth
            });
    },
    obtainWeapon: function() {
        var weaponPickedUp = weapon[Math.round(Math.random() * weapon.length)].name;
      this.setState({
         weaponStats: weaponPickedUp
      });
    },
    attackEnemy: function(x, y) {
        var healthReduced = this.state.healthStats - 12;
        var enemyReduction;
        for (var i=0; i<weapon.length; i++) {
            if (weapon[i].name === this.state.weaponStats) {
                enemyReduction = weapon[i].attack;
            }
        }
        var finalEnemyReduction =  cells[x][y].health - enemyReduction;
        this.setState({
           healthStats: healthReduced
            cells[x][y].health: finalEnemyReduction //need help here! how to access each enemy's health individually
        });
     },

    // componentWillMount: function() {
    //     var rows = this.state.numRows,
    //         columns = this.state.numColumns;
    //     this.setState({
    //         cells: this.calculateCells(rows, columns)
    //         //player: this.playerStart(rows, columns)
    //     });
    // },

    updateCells: function(x, y, options) {
        var cells = this.state.cells.slice();
        cells[x][y] = Object.assign({}, cells[x][y], options);
        this.setState({ cells: cells });
    },

    movePlayer: function(x, y) {
        var prevX = this.state.playerCurrentPosition[0];
        var prevY = this.state.playerCurrentPosition[1];
        var cells = this.state.cells.slice();
        cells[prevX][prevY] = Object.assign({}, cells[x][y], { color: bgColors['Grey'] }); // prev
        cells[x][y] = Object.assign({}, cells[x][y], { color: bgColors['Blue'] }); // next
        this.setState({
            cells: cells,
            playerCurrentPosition: [x, y]
        });
    },

  render: function() {
    return (
        <div>
            <h2 className="appTitle">React Roguelike</h2>
            <h5 className="appTitle">Kill the boss in dungeon 4</h5>
            <Stats health={this.state.healthStats} weaponStats={this.state.weaponStats} attack={this.state.attack} level={this.state.level} nextLevel={this.state.nextLevel} dungeon={this.state.dungeon} />
            <Gameboard cells={this.state.cells}
                       playerCurrentPosition={this.state.playerCurrentPosition}
                       healthCells={this.state.healthCells}
                       enemyCells={this.state.enemyCells}
                       king={this.state.king}
                       weapon={this.state.weapon}
                       updateCells={this.updateCells}
                       movePlayer={this.movePlayer}
                       obtainHealth={this.obtainHealth}
                       obtainWeapon={this.obtainWeapon} />
            <Legend />
        </div>
    );
  }
});

export default Board;
export {bgColors};
export {cellDisplay};