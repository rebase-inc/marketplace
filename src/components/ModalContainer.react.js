var React = require('react');

var ModalContainer = React.createClass({
    render: function() {
        return (
            <div id='modalView'>
                <div id='modalDialog' onChange={this.handleInput} onKeyPress={this.handleKeyPress}>
                    {this.props.children}
                </div>
            </div>
        );
    }
});

module.exports = ModalContainer;
