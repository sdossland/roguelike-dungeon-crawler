import React from 'react';
import _ from 'lodash';
import Stats from './Stats';
import Gameboard from './Gameboard';
import Legend from './Legend';
import './App.css';
import Popup from './Popup';

/*RULES:
* -1 player per dungeon
* -4 health per dungeon
* -5 enemies per dungeon
* -1 weapon per dungeon
* -1 king per dungeon
* -1 boss in dungeon 4 ONLY
* ----total of 13----*/

var bgColors = {
    "Blue": "#1a1aff", //player
    "Green": "#080", //health
    "Red": "#c00", //enemy
    "DarkRed": "#800000", //boss
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

//this function renders all cells on with an initial state of grey gameboard square
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

//instead of new function for darkCells, perhaps add a property as an option to be input to function??
//the only issue with this is darkCells requires isActive (can be initially swapped for color: transparent) and isScope property.
//this function renders the overlying dark filter
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
        name: 'large trout', //remove?? never gets here?
        damage: 30
    }
];

var subtractLevelXP = [10, 20, 30, 40, 50],
    nextLevelXP = [60, 120, 180, 240, 300];

var numRows = 60,
    numColumns = 60;
//reduce numRows and numColumns by 2 to ensure randomly placed agents are within the bounds of gameboard
var reducedNumRows = numRows - 2,
    reducedNumColumns = numColumns - 2;

//creates nested array of random numbers to ensure no dupes w/ health, enemies, king, weapon
function createAgentCells(x, y) {
    var agentCells = [[Math.floor(Math.random() * (x - 2)) + 2, Math.floor(Math.random() * (y - 2)) + 2]],
        a = 0;
    while (a < 12) {
        var agentCell = [Math.floor(Math.random() * (x - 2)) + 2, Math.floor(Math.random() * (y - 2)) + 2];
        if (_.findIndex(agentCells, agentCell) === -1) {
            agentCells.push(agentCell);
            a++;
        }
    }
    return agentCells;
}

//creates 5 randomly placed enemies
// function calculateEnemies(x, y) {
//     var enemies = [],
//         i = 0;
//     while (i < 5) {
//         enemies.push([Math.round(Math.random() * x), Math.round(Math.random() * y)]);
//         i++;
//     }
//     return enemies;
// }

//creates 4 randomly placed health cells
// function calculateHealthAgents(x, y) {
//     var healthAgents = [],
//         i = 0;
//     while (i < 4) {
//         healthAgents.push([Math.round(Math.random() * x), Math.round(Math.random() * y)]);
//         i++;
//     }
//     return healthAgents;
// }

//creates 4 adjoining cells to create a larger 4-square cell
function calculateBoss (x, y) {
    var neighborCells = [[0,0], [1, 0], [0, 1], [1, 1]],
        bossCells = [];
    for (var l=0; l<neighborCells.length; l++) {
        bossCells.push([(x + neighborCells[l][0]), (y + neighborCells[l][1])]);
    }
    return bossCells;
}

var Board = React.createClass({
    getInitialState: function () {
        var agentCells = createAgentCells(reducedNumRows, reducedNumColumns);
      return ({
          healthStats: 100,
          weaponStats: weapon[0].name,
          attack: weapon[0].damage,
          level: 0,
          nextLevel: 60,
          dungeon: 0,
          cells: calculateCells(numRows, numColumns),
          darkCells: calculateDarkCells(numRows, numColumns),
          playerCurrentPosition: agentCells.slice(0, 1),
          healthCells: agentCells.slice(1, 5),
          enemyCells: agentCells.slice(5, 10),
          king: agentCells.slice(10, 11),
          weapon: agentCells.slice(11,12),
          //boss: [],
          boss: calculateBoss(agentCells.slice(12, 13)[0][0], agentCells.slice(12, 13)[0][1]), //make it 10,11 in dungeon 4
          bossHealth: 40,
          clicked: 'false'
      });
    },
    obtainHealth: function() {
          this.setState({ healthStats: this.state.healthStats + 20 });
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
    scope: function() {
        var darkCells = this.state.darkCells,
            playerRow = this.state.playerCurrentPosition[0][0],
            playerCol = this.state.playerCurrentPosition[0][1];
        for (var i=0; i<60; i++) {
            for (var j=0; j<60; j++) {
                darkCells[i][j].isScope = false;
            }
        }
        //row 1
        for (var scopeRow1=-5; scopeRow1<-4; scopeRow1++) {
            if (-1<(playerRow + scopeRow1) && (playerRow + scopeRow1)<60) {
                for (var scopeWidth1=-1; scopeWidth1<2; scopeWidth1++) {
                    if (-1<(playerCol + scopeWidth1) && (playerCol + scopeWidth1)<60) {
                        darkCells[playerRow + scopeRow1][playerCol + scopeWidth1].isScope = true;
                    }
                }
            }
        }
        //row 2
        for (var scopeRow2=-4; scopeRow2<-3; scopeRow2++) {
            if (-1<(playerRow + scopeRow2) && (playerRow + scopeRow2)<60) {
                for (var scopeWidth2=-2; scopeWidth2<3; scopeWidth2++) {
                    if (-1<(playerCol + scopeWidth2) && (playerCol + scopeWidth2)<60) {
                        darkCells[playerRow + scopeRow2][playerCol + scopeWidth2].isScope = true;
                    }
                }
            }
        }
        //row 3
        for (var scopeRow3=-3; scopeRow3<-2; scopeRow3++) {
            if (-1<(playerRow + scopeRow3) && (playerRow + scopeRow3)<60) {
                for (var scopeWidth3=-3; scopeWidth3<4; scopeWidth3++) {
                    if (-1<(playerCol + scopeWidth3) && (playerCol + scopeWidth3)<60) {
                        darkCells[playerRow + scopeRow3][playerCol + scopeWidth3].isScope = true;
                    }
                }
            }
        }
        //row 4
        for (var scopeRow4=-2; scopeRow4<-1; scopeRow4++) {
            if (-1<(playerRow + scopeRow4) && (playerRow + scopeRow4)<60) {
                for (var scopeWidth4=-4; scopeWidth4<5; scopeWidth4++) {
                    if (-1<(playerCol + scopeWidth4) && (playerCol + scopeWidth4)<60) {
                        darkCells[playerRow + scopeRow4][playerCol + scopeWidth4].isScope = true;
                    }
                }
            }
        }
        //rows 5-7
        for (var scopeRow5thru7=-1; scopeRow5thru7<2; scopeRow5thru7++) {
            if (-1<(playerRow + scopeRow5thru7) && (playerRow + scopeRow5thru7)<60) {
                for (var scopeWidth5thru7=-5; scopeWidth5thru7<6; scopeWidth5thru7++) {
                    if ( -1<(playerCol + scopeWidth5thru7) && (playerCol + scopeWidth5thru7)<60 )  {
                        darkCells[playerRow + scopeRow5thru7][playerCol + scopeWidth5thru7].isScope = true;
                    }
                }
            }
        }
        //row 8
        for (var scopeRow8=2; scopeRow8<3; scopeRow8++) {
            if (-1<(playerRow + scopeRow8) && (playerRow + scopeRow8)<60) {
                for (var scopeWidth8=-4; scopeWidth8<5; scopeWidth8++) {
                    if (-1<(playerCol + scopeWidth8) && (playerCol + scopeWidth8)<60) {
                        darkCells[playerRow + scopeRow8][playerCol + scopeWidth8].isScope = true;
                    }
                }
            }
        }
        //row 9
        for (var scopeRow9=3; scopeRow9<4; scopeRow9++) {
            if (-1<(playerRow + scopeRow9) && (playerRow + scopeRow9)<60) {
                for (var scopeWidth9=-3; scopeWidth9<4; scopeWidth9++) {
                    if (-1<(playerCol + scopeWidth9) && (playerCol + scopeWidth9)<60) {
                        darkCells[playerRow + scopeRow9][playerCol + scopeWidth9].isScope = true;
                    }
                }
            }
        }
        //row 10
        for (var scopeRow10=4; scopeRow10<5; scopeRow10++) {
            if (-1<(playerRow + scopeRow10) && (playerRow + scopeRow10)<60) {
                for (var scopeWidth10=-2; scopeWidth10<3; scopeWidth10++) {
                    if (-1<(playerCol + scopeWidth10) && (playerCol + scopeWidth10)<60) {
                        darkCells[playerRow + scopeRow10][playerCol + scopeWidth10].isScope = true;
                    }
                }
            }
        }
        //row 11
        for (var scopeRow11=5; scopeRow11<6; scopeRow11++) {
            if (-1<(playerRow + scopeRow11) && (playerRow + scopeRow11)<60) {
                for (var scopeWidth11=-1; scopeWidth11<2; scopeWidth11++) {
                    if (-1<(playerCol + scopeWidth11) && (playerCol + scopeWidth11)<60) {
                        darkCells[playerRow + scopeRow11][playerCol + scopeWidth11].isScope = true;
                    }
                }
            }
        }
        this.setState({ darkCells: darkCells });
    },
    toggleCell: function() {
        var darkCells = this.state.darkCells;
        this.setState({ clicked: !this.state.clicked }); //only different line
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
        var prevX = this.state.playerCurrentPosition[0][0];
        var prevY = this.state.playerCurrentPosition[0][1];
        var cells = this.state.cells.slice();
        cells[prevX][prevY] = Object.assign({}, cells[x][y], { color: bgColors['Grey'] }); // prev
        cells[x][y] = Object.assign({}, cells[x][y], { color: bgColors['Blue'] }); // next
        this.setState({
            cells: cells,
            playerCurrentPosition: [[x, y]]
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
        //alert("Gameover! Better luck next time!"); //create a popup window
        this.props.showNotification(); //FIX!!!!
        var agentCells = createAgentCells(reducedNumRows, reducedNumColumns);
        this.setState({
            healthStats: 100,
            weaponStats: weapon[0].name,
            attack: weapon[0].damage,
            level: 0,
            nextLevel: 60,
            dungeon: 0,
            cells: calculateCells(numRows, numColumns),
            darkCells: calculateDarkCells(numRows, numColumns),
            playerCurrentPosition: agentCells.slice(0, 1),
            healthCells: agentCells.slice(1, 5),
            enemyCells: agentCells.slice(5, 10),
            king: agentCells.slice(10, 11),
            weapon: agentCells.slice(11,12),
            //boss: [],
            boss: calculateBoss(agentCells.slice(12, 13)[0][0], agentCells.slice(12, 13)[0][1]),
            bossHealth: 40,
            clicked: 'false'
        });
        this.initialCellCreation();
    },
    initialCellCreation: function() {
        document.addEventListener("keydown", this.handleDirections);
        this.updateCells(this.state.playerCurrentPosition[0][0],this.state.playerCurrentPosition[0][1], {color: bgColors['Blue']});
        for (var j=0; j<4; j++) {
            this.updateCells(this.state.healthCells[j][0], this.state.healthCells[j][1], {color: bgColors['Green']});
        }
        for (var i=0; i<5; i++) {
            this.updateCells(this.state.enemyCells[i][0], this.state.enemyCells[i][1], {color: bgColors['Red'], enemyHealth: 20});
        }
        this.updateCells(this.state.king[0][0], this.state.king[0][1], {color: bgColors['Purple'], kingHealth: 40}); //king
        //if (this.state.boss) {
        for (var h=0; h<4; h++) {
            this.updateCells(this.state.boss[h][0], this.state.boss[h][1], {color: bgColors['DarkRed'], bossHealth: 100});
        }
        //}
        this.updateCells(this.state.weapon[0][0], this.state.weapon[0][1], {color: bgColors['Yellow']}); //weapon
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
                // for (var k = 0; k < this.state.enemyCells.length; k++) { //is the removal from array necessary through...
                //     if (this.state.enemyCells[k][0] === x && this.state.enemyCells[k][1] === y) {
                //         var enemyCells = this.state.enemyCells.slice();
                //         enemyCells.splice(k, 1);
                //         this.setState({ enemyCells: enemyCells });
                //     }
                // } //necessary through here??
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
                var agentCells = createAgentCells(reducedNumRows, reducedNumColumns);
                if (this.state.dungeon < 3) {
                    var dungeon = this.state.dungeon + 1;
                    this.setState({
                        dungeon: dungeon,
                        playerCurrentPosition: agentCells.slice(0, 1)/*[Math.round(Math.random() * numRows), Math.round(Math.random() * numColumns)]*/,
                        healthCells: agentCells.slice(1, 5)/*calculateHealthAgents(numRows, numColumns)*/,
                        enemyCells: agentCells.slice(5, 10)/*calculateEnemies(numRows, numColumns)*/,
                        king: agentCells.slice(10, 11)/*[Math.round(Math.random() * numRows), Math.round(Math.random() * numColumns)]*/,
                        weapon: agentCells.slice(11, 12)/*[Math.round(Math.random() * numRows), Math.round(Math.random() * numColumns)]*/
                    });
                    this.initialCellCreation();
                } else if (this.state.dungeon === 3) {
                    dungeon = this.state.dungeon + 1;
                    this.setState({
                        dungeon: dungeon,
                        playerCurrentPosition: agentCells.slice(0, 1)/*[Math.round(Math.random() * numRows), Math.round(Math.random() * numColumns)]*/,
                        healthCells: agentCells.slice(1, 5)/*calculateHealthAgents(numRows, numColumns)*/,
                        enemyCells: agentCells.slice(5, 10)/*calculateEnemies(numRows, numColumns)*/,
                        weapon: agentCells.slice(11, 12)/*[Math.round(Math.random() * numRows), Math.round(Math.random() * numColumns)]*/,
                        //boss: calculateBoss(agentCells.slice(10, 11)[0][0], agentCells.slice(10, 11)[0][1]) /*this.calculateBoss(numRows, numColumns)*/
                        //bossHealth: 40
                    });
                    this.initialCellCreation();
                } else if (this.state.dungeon === 4) {
                    alert("Congratulations! You won!"); //create nicer popup here perhaps asking if they want to restart the game??
                }
            }
        } else {
            alert('Gameover! Better luck next time!');
            this.resetGame();
        }
    },
    attackBoss: function() {
        var healthReduced = this.state.healthStats - 10;
        var bossHealthReduction = this.state.bossHealth - this.state.attack;
        if (this.state.healthStats > 0) {
            if (this.state.bossHealth > 0) {
                this.setState({
                    healthStats: healthReduced,
                    bossHealth: bossHealthReduction
                });
                console.log(this.state.bossHealth);
                console.log("playerhealth: " + this.state.healthStats);
            } else if (this.state.bossHealth < 1) {
                alert('Congratulations!!! You defeated the boss in dungeon 4.');
                this.resetGame();
                //popup here that reads you are a winner! on OK, this.resetGame();
            }
        } else {
            //alert('Gameover! Better luck next time!');
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
                       attackBoss={this.attackBoss}
                       initialCellCreation={this.initialCellCreation}
            />
            <Popup />
            <Legend />
        </div>
    );
  }
});

export default Board;
export {bgColors};
export {cellDisplay};