React = require('react');

var StatusBar = React.createClass({
    render: function() {
        var className = this.props.className ? this.props.className : '';
        return (
            <div id='statusBar' className={className}>
                { this.props.text } 
                { this.props.children }
            </div>
        );
    }
});


module.exports = StatusBar;
