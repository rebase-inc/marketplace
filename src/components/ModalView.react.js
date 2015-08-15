var React = require('react');

var ModalView = React.createClass({
    render: function() {
        return (
            <div id='modalView'>
            <ModalDialog closeModal={this.props.closeModal}/>
            </div>
        );
    }
});

var ModalDialog = React.createClass({
    render: function() {
        return (
            <div id='modalDialog'>
            <div onClick={this.props.closeModal} id='modalClose'>
            <img src='img/modal-close.svg'/>
            </div>
            <h3>Name your price</h3>
            <h4>to work on this task</h4>
            <input type='number' placeholder='Price in USD' />
            </div>
        );
    }
});

module.exports = ModalView;
