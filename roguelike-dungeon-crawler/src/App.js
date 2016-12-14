import React from 'react';
import _ from 'lodash';
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

var weapon = [
    {
        name: 'stick',
        damage: 10
    },
    {
        name: 'brass knuckles',
        damage: 7
    },
    {
        name: 'serrated daggers',
        damage: 12
    },
    {
        name: 'katana',
        damage: 16
    },
    {
        name: 'reaper\'s scythe',
        damage: 22
    },
    {
        name: 'large trout',
        damage: 30
    }
];

var subtractLevelXP = [10, 20, 30, 40, 50];
var nextLevelXP = [60, 120, 180, 240, 300];

var numRows = 60,
    numColumns = 60;

var Board = React.createClass({
    getInitialState: function () {
      return ({
          healthStats: 100,
          weaponStats: weapon[0].name,
          attack: weapon[0].damage,
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
          clicked: 'false'
      });
    },
    obtainHealth: function() {
          var finalPlayerHealth = this.state.healthStats + 20;
          this.setState({
            healthStats: finalPlayerHealth
            });
    },
    obtainWeapon: function() {
        var counter = _.findIndex(weapon, ['name', this.state.weaponStats]) + 1;
        this.setState({
          weaponStats: weapon[counter].name,
          attack: weapon[counter].damage
        });
    },

    updateCells: function(x, y, options) {
        var cells = this.state.cells.slice();
        cells[x][y] = Object.assign({}, cells[x][y], options);
        this.setState({ cells: cells });
    },
    calculateBoss: function (x, y) {
        var bossStart = [Math.round(Math.random() * x), Math.round(Math.random() * y)];
        var neighborCells = [[0,0], [1, 0], [0, 1], [1, 1]],
            bossCells = [];
        for (var l=0; l<neighborCells.length; l++) {
            bossCells.push([bossStart[0] + neighborCells[l][0], bossStart[1] + neighborCells[l][1]]);
        }
    },
    scope: function() {
        var darkCells = this.state.darkCells,
            row = this.state.playerCurrentPosition[0],
            col = this.state.playerCurrentPosition[1];
        //console.log(row, col);
        for (var i=0; i<60; i++) {
            for (var j=0; j<60; j++) {
                darkCells[i][j].isScope = false;
            }
        }
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
        this.setState({ darkCells: darkCells });
    },
    toggleCell: function() {
        var darkCells = this.state.darkCells;
        this.setState({ clicked: !this.state.clicked });
        for (var i=0; i<60; i++) {
            for (var j=0; j<60; j++) {
                if (this.state.clicked === false) {
                    darkCells[i][j].isActive = false;
                } else if (this.state.clicked === true) {
                    if (darkCells[i][j].isScope === false) {
                        darkCells[i][j].isActive = true;
                    } else if (darkCells[i][j].isScope === true) {
                        darkCells[i][j].isActive = false;
                    }
                }
            }
        }
        this.setState({ darkCells: darkCells });
        console.log(this.state.clicked); //can do a count as well w/ odd and even
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
        //renders the new scope cells
        this.scope();
        //sets the color to black or transparent
        var darkCells = this.state.darkCells;
        for (var i=0; i<60; i++) {
            for (var j=0; j<60; j++) {
                if (this.state.clicked === true) {
                    darkCells[i][j].isActive = false;
                } else if (this.state.clicked === false) {
                    if (darkCells[i][j].isScope === false) {
                        darkCells[i][j].isActive = true;
                    } else if (darkCells[i][j].isScope === true) {
                        darkCells[i][j].isActive = false;
                    }
                }
            }
        }
        this.setState({ darkCells: darkCells });
    },
    resetGame: function() {
        alert("Gameover! Better luck next time!"); //create a popup window
        this.setState({
            healthStats: 100,
            weaponStats: weapon[0].name,
            attack: weapon[0].damage,
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
            clicked: 'false'
        });
        this.initialCellCreation();
    },
    initialCellCreation: function() {
        document.addEventListener("keydown", this.handleDirections);
        this.updateCells(this.state.playerCurrentPosition[0],this.state.playerCurrentPosition[1], {color: bgColors['Blue']});
        for (var j=0; j<4; j++) {
            this.updateCells(this.state.healthCells[j][0], this.state.healthCells[j][1], {color: bgColors['Green']});
        }
        for (var i=0; i<5; i++) {
            this.updateCells(this.state.enemyCells[i][0], this.state.enemyCells[i][1], {color: bgColors['Red'], enemyHealth: 20});
        }
        this.updateCells(this.state.king[0], this.state.king[1], {color: bgColors['Purple'], kingHealth: 40}); //king
        for (var h=0; h<4; h++) {
            this.updateCells(this.state.boss[i][0], this.state.boss[i][1], {color: bgColors['Red'], bossHealth: 100});
        }
        this.updateCells(this.state.weapon[0], this.state.weapon[1], {color: bgColors['Yellow']}); //weapon
        this.scope();
    },
    attackEnemy: function(x, y) {
        var healthReduced = this.state.healthStats - 6;
        var enemyHealthReduction = this.state.cells[x][y].enemyHealth - this.state.attack;
        if (healthReduced > 0) {
            if (this.state.cells[x][y].enemyHealth > 0) {
                this.setState({ healthStats: healthReduced });
                this.updateCells(x, y, {enemyHealth: enemyHealthReduction});
            } else if (this.state.cells[x][y].enemyHealth < 1) {
                for (var k = 0; k < this.state.enemyCells.length; k++) { //is the removal necessary through...
                    if (this.state.enemyCells[k][0] === x && this.state.enemyCells[k][1] === y) {
                        var enemyCells = this.state.enemyCells.slice();
                        enemyCells.splice(k, 1);
                        this.setState({ enemyCells: enemyCells });
                    }
                } //necessary through here??
                this.movePlayer(x, y);
                var nextLevel = this.state.nextLevel - subtractLevelXP[this.state.level];
                if (nextLevel > 0) {
                    this.setState({ nextLevel: nextLevel });
                } else if (nextLevel < 0) {
                    var level = this.state.level + 1;
                    this.setState({
                        level: level,
                        nextLevel: nextLevelXP[level]
                    });
                }
            }
        } else {
            this.resetGame();
        }
    },
    attackKing: function (x, y) {
        var healthReduced = this.state.healthStats - 12;
        var kingHealthReduction = this.state.cells[x][y].kingHealth - this.state.attack;
        if (healthReduced > 0) {
            if (this.state.cells[x][y].kingHealth > 0) {
                this.setState({ healthStats: healthReduced });
                this.updateCells(x, y, {kingHealth: kingHealthReduction});
            } else if (this.state.cells[x][y].kingHealth < 1) {
                this.movePlayer(x, y);
                if (this.state.dungeon < 3) {
                    var dungeon = this.state.dungeon + 1;
                    this.setState({
                        dungeon: dungeon,
                        playerCurrentPosition: [Math.round(Math.random() * numRows), Math.round(Math.random() * numColumns)],
                        healthCells: calculateHealthAgents(numRows, numColumns),
                        enemyCells: calculateEnemies(numRows, numColumns),
                        king: [Math.round(Math.random() * numRows), Math.round(Math.random() * numColumns)],
                        weapon: [Math.round(Math.random() * numRows), Math.round(Math.random() * numColumns)]
                    });
                    this.initialCellCreation();
                } else if (this.state.dungeon === 3) {
                    dungeon = this.state.dungeon + 1;
                    this.setState({
                        dungeon: dungeon,
                        playerCurrentPosition: [Math.round(Math.random() * numRows), Math.round(Math.random() * numColumns)],
                        healthCells: calculateHealthAgents(numRows, numColumns),
                        enemyCells: calculateEnemies(numRows, numColumns),
                        //king: [Math.round(Math.random() * numRows), Math.round(Math.random() * numColumns)],
                        weapon: [Math.round(Math.random() * numRows), Math.round(Math.random() * numColumns)],
                        boss: this.calculateBoss(numRows, numColumns)
                    });
                    this.initialCellCreation();
                } else if (this.state.dungeon === 4) {
                    alert("Congratulations! You won!"); //create nicer popup here perhaps asking if they want to restart the game??
                }
            }
        } else {
            this.resetGame();
        }
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
                       scope={this.scope}
                       attackEnemy={this.attackEnemy}
                       attackKing={this.attackKing}
                       initialCellCreation={this.initialCellCreation}
            />
            <Legend />
        </div>
    );
  }
});

export default Board;
export {bgColors};
export {cellDisplay};