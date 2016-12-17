/**
 * Created by sophia on 12/16/16.
 */
import React from 'react';
import ReactNotify from 'react-notify';

var popUp = React.createClass({
    showNotification: function() {
        //this.refs.notificator.error("Title.", "Msg - body.", duration);
        //this.refs.notificator.info("Title.", "Msg - body.", duration);
        this.refs.notificator.success("Title.", "Msg - body.", 2000);
    },
    render: function() {
        return (
            <div>
                <ReactNotify ref='notificator'
                             showNotification={this.showNotification}
                />
            </div>
        );
    }
});

export default popUp;