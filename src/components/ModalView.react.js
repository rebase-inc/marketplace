var React = require('react');

var ModalView = React.createClass({
    render: function() {
        return (
            <div id='modalView'>
            <ModalDialog {...this.props} />
            </div>
        );
    }
});

var ModalDialog = React.createClass({
    render: function() {
        var modal;
        if (!this.props.ticket == !this.props.auction) {
            throw "Must provide exactly one of ticket or auction in props"
        }
        else if (!!this.props.ticket) {
            return (
                <div id='modalDialog'>
                    <div onClick={this.props.closeModal} id='modalClose'>
                        <img src='img/modal-close.svg'/>
                    </div>
                    <h3>Set your budget</h3>
                    <h4>to see recommended developers</h4>
                    <input type='number' placeholder='Price in USD' />
                </div>
            );
        }
        else if (!!this.props.auction) {
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
        else { throw "WTF?"; }
    }
});

module.exports = ModalView;
