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
    "Grey": "#999", //standard
    "Black": "#000" //noOverlay
};

var cellDisplay = {
    "Block": 'block',
    "LeftFloat": 'left',
    "InlineBlock": 'inline-block'
};

function calculateCells(numRows, numColumns) {
    var cellArr = [];
    for (var i=0; i<numRows; i++) {
        var row = [];
        for (var j=0; j<numColumns; j++) {
            row.push({ isPlayer: false, color: bgColors['Grey'] });
        }
        cellArr.push(row);
    }
    return cellArr;
}

//instead of new function for darkCells, perhaps add the isActive as an option to be input to function??
function calculateDarkCells(numRows, numColumns /*, isActive*/) {
    var cellArr = [];
    for (var i=0; i<numRows; i++) {
        var row = [];
        for (var j=0; j<numColumns; j++) {
            //this.clicked = clicked;
            row.push({ isPlayer: false, isActive: false, isScope: false });
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
];

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
          darkCells: calculateDarkCells(numRows, numColumns),
          playerCurrentPosition: [Math.round(Math.random() * numRows), Math.round(Math.random() * numColumns)],
          healthCells: calculateHealthAgents(numRows, numColumns),
          enemyCells: calculateEnemies(numRows, numColumns),
          king: [Math.round(Math.random() * numRows), Math.round(Math.random() * numColumns)],
          weapon: [Math.round(Math.random() * numRows), Math.round(Math.random() * numColumns)],
          // clicked: 'dark'
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
    // attackEnemy: function(x, y) {
    //     var healthReduced = this.state.healthStats - 12;
    //     var enemyReduction;
    //     for (var i=0; i<weapon.length; i++) {
    //         if (weapon[i].name === this.state.weaponStats) {
    //             enemyReduction = weapon[i].attack;
    //         }
    //     }
    //     var finalEnemyReduction =  cells[x][y].health - enemyReduction;
    //     this.setState({
    //        healthStats: healthReduced
    //         cells[x][y].health: finalEnemyReduction //need help here! how to access each enemy's health individually
    //     });
    //  },

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
    toggleCell: function() {
      var darkCells = this.state.darkCells,
          row = this.state.playerCurrentPosition[0],
          col = this.state.playerCurrentPosition[1];
        console.log(row, col);
        //row 1
        for (var k=-5; k<-4; k++) {
            if (-1<(row + k) && (row + k)<60) {
                for (var l=-1; l<2; l++) {
                    if (-1<(col + l) && (col + l)<60) {
                        darkCells[row + k][col + l].isScope = true;
                    }
                }
            }
        }
        //row 2
        for (var m=-4; m<-3; m++) {
            if (-1<(row + m) && (row + m)<60) {
                for (var n=-2; n<3; n++) {
                    if (-1<(col + m) && (col + m)<60) {
                        darkCells[row + m][col + n].isScope = true;
                    }
                }
            }
        }
        //row 3
        for (var o=-3; o<-2; o++) {
            if (-1<(row + o) && (row + o)<60) {
                for (var p=-3; p<4; p++) {
                    if (-1<(col + p) && (col + p)<60) {
                        darkCells[row + o][col + p].isScope = true;
                    }
                }
            }
        }
        //row 4
        for (var q=-2; q<-1; q++) {
            if (-1<(row + q) && (row + q)<60) {
                for (var r=-4; r<5; r++) {
                    if (-1<(col + r) && (col + r)<60) {
                        darkCells[row + q][col + r].isScope = true;
                    }
                }
            }
        }
        //rows 5-7
        for (var s=-1; s<2; s++) {
            var newRow = row + s;
            if (-1<newRow && newRow<60) {
                for (var t=-5; t<6; t++) {
                    var newCol = col + t;
                    if ( -1<newCol && newCol<60 )  {
                        darkCells[row + s][col + t].isScope = true;
                    }
                }
            }
        }
        //row 8
        for (var u=2; u<3; u++) {
            if (-1<(row + u) && (row + u)<60) {
                for (var v=-4; v<5; v++) {
                    if (-1<(col + v) && (col + v)<60) {
                        darkCells[row + u][col + v].isScope = true;
                    }
                }
            }
        }
        //row 9
        for (var w=3; w<4; w++) {
            if (-1<(row + w) && (row + w)<60) {
                for (var x=-3; x<4; x++) {
                    if (-1<(col + w)<60 && -1<(col + x)<60) {
                        darkCells[row + w][col + x].isScope = true;
                    }
                }
            }
        }
        //row 10
        for (var y=4; y<5; y++) {
            if (-1<(row + y) && (row + y)<60) {
                for (var z=-2; z<3; z++) {
                    if (-1<(col + z) && (col + z)<60) {
                        darkCells[row + y][col + z].isScope = true;
                    }
                }
            }
        }
        //row 11
        for (var a=5; a<6; a++) {
            if (-1<(row + a) && (row + a)<60) {
                for (var b=-1; b<2; b++) {
                    if (-1<(col + b) && (col + b)<60) {
                        darkCells[row + a][col + b].isScope = true;
                    }
                }
            }
        }
        //sets all cells outside of scope to black
        for (var i=0; i<60; i++) {
            for (var j=0; j<60; j++) {
                if (darkCells[i][j].isScope === false) {
                    darkCells[i][j].isActive = !darkCells[i][j].isActive;
                }
                //else if (darkCells[i][j].isScope === true)
                //darkCells[i][j].isActive =
            }
        }
        this.setState({ darkCells: darkCells });
    },
  render: function() {
    return (
        <div>
            <h2 className="appTitle">React Roguelike</h2>
            <h5 className="appTitle">Kill the boss in dungeon 4</h5>
            <Stats health={this.state.healthStats}
                   weaponStats={this.state.weaponStats}
                   attack={this.state.attack}
                   level={this.state.level}
                   nextLevel={this.state.nextLevel}
                   dungeon={this.state.dungeon}
                   clicked={this.state.clicked}
                   toggleCell={this.toggleCell}
            />
            <Gameboard cells={this.state.cells}
                       playerCurrentPosition={this.state.playerCurrentPosition}
                       healthCells={this.state.healthCells}
                       enemyCells={this.state.enemyCells}
                       king={this.state.king}
                       weapon={this.state.weapon}
                       updateCells={this.updateCells}
                       movePlayer={this.movePlayer}
                       obtainHealth={this.obtainHealth}
                       obtainWeapon={this.obtainWeapon}
                       darkCells={this.state.darkCells}
            />
            <Legend />
        </div>
    );
  }
});

export default Board;
export {bgColors};
export {cellDisplay};