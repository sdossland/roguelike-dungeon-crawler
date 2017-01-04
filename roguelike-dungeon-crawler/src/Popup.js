/**
 * Created by sophia on 12/16/16.
 */
import React from 'react';

var popUp = React.createClass({
    getInitialState: function () {
        return {
            timedOut: false
        }
    },
    timer: null,
    render: function() {
        if (this.props.popUp) {
            var that = this;
            this.timer =
                setInterval(
                    function() {
                        that.setState({timedOut: true}, function() {
                            clearInterval(that.timer);
                            this.props.resetGame();
                        })
                    },
                    5000);
        }
        return this.props.popUp && !this.state.timedOut && (
            <div className="notify-container">
                <div className="notify-item">
                    {this.props.message}
                </div>
            </div>
        );
    }
});

export default popUp;