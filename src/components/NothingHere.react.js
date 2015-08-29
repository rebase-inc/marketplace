var React = require('react');

var NothingHere = React.createClass({
    render: function() {
        return (
            <div id='nothingHere'>
                <img src='img/working-60px.svg' />
                <span>{this.props.text}</span>
           </div>
        );
    }
});

module.exports = NothingHere;
