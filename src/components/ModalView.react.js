var React = require('react');

var TicketStore = require('../stores/TicketStore');
var AuctionStore = require('../stores/AuctionStore');

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
    getInitialState: function() {
        return {
            price: '',
            priceSet: false,
            priceConfirmed: false,
        }
    },
    handleInput: function() {
        this.setState({ price: this.refs.price.getDOMNode().value });
    },
    handleKeyPress: function(event) {
        if (event.charCode == 13) {
            this.setState({ priceSet: true });
        }
    },
    submitPrice: function() {
        alert('we are pretending to submit the price to the api!');
        this.props.closeModal();
    },
    render: function() {
        var modal;
        var h3;
        var h4;
        var inputOrButton;
        var ticket = TicketStore.getState().currentTicket;
        var auction = AuctionStore.getState().currentAuction;
        if (!ticket == !auction) { throw "Must provide exactly one of ticket or auction in props" }
        // nested if's are begging to be refactored
        else if (!!ticket) {
            if (!!this.state.priceSet) {
                h3 = 'Is ' + this.state.price + 'USD Correct?';
                h4 = 'This is just a maximum. Usually, you\'ll pay much less';
                inputOrButton = <button onClick={this.submitPrice}>Submit Budget</button>;
            }
            else {
                h3 = 'Set your budget';
                h4 = 'to see recommended developers';
                inputOrButton = <input type='number' ref='price' placeholder='Price in USD' />
            }
        }
        else if (!!auction) {
            if (!!this.state.priceSet) {
                h3 = 'Is ' + this.state.price + 'USD Correct?';
                h4 = 'If accepted, you\'ll start right away!';
                inputOrButton = <button onClick={this.submitPrice}>Submit Bid</button>;
            }
            else {
                h3 = 'Name your price';
                h4 = 'to work on this task';
                inputOrButton = <input type='number' ref='price' placeholder='Price in USD' />
            }
        }
        return (
            <div id='modalDialog' onChange={this.handleInput} onKeyPress={this.handleKeyPress}>
                <div onClick={this.props.closeModal} id='modalClose'>
                    <img src='img/modal-close.svg'/>
                </div>
                <h3>{h3}</h3>
                <h4>{h4}</h4>
                {inputOrButton}
            </div>
        );
    }
});

module.exports = ModalView;
