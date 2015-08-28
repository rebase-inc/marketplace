React = require('react');

var StatusBar = React.createClass({
    render: function() {
        var className = this.props.className ? 'notification ' + this.props.className : 'notification';
        return (
            <div id='statusBar' className={className}>
                { this.props.text } 
            </div>
        );
    }
});


module.exports = StatusBar;
