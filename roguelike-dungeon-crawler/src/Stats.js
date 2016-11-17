/**
 * Created by sophia on 11/3/16.
 */
import React from 'react';

var Stats = React.createClass({
    onClickHandler: function () {

    },
    render: function() {
        return (
            <div className="container row">
                <div className="stats">Health: {this.props.health}</div>
                <div className="stats">Weapon: {this.props.weaponStats}</div>
                <div className="stats">Attack: {this.props.attack}</div>
                <div className="stats">Level: {this.props.level}</div>
                <div className="stats">Next level: {this.props.nextLevel} XP</div>
                <div className="stats">Dungeon: {this.props.dungeon}</div>
                <button /*type="button btn btn-default"*/ className="stats toggleDarknessBtn" /*onClick={this.onClickHandler}*/>Toggle Darkness</button>
            </div>
        )}
});

export default Stats;