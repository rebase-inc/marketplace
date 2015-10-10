var React = require('react');

var ModalContainer = React.createClass({
    render: function() {
        return (
            <div id='modalView' className='noselect'>
                <div id='modalDialog' onChange={this.handleInput} onKeyPress={this.handleKeyPress}>
                    <div onClick={this.props.toggleModal} id='modalClose'>
                        <img src='img/modal-close.svg'/>
                    </div>
                    {this.props.children}
                </div>
            </div>
        );
    }
});

module.exports = ModalContainer;
