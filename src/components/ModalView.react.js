var React = require('react');

var TicketStore = require('../stores/TicketStore');
var AuctionStore = require('../stores/AuctionStore');
var RebaseActions = require('../actions/RebaseActions');

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
            priceSubmitted: false,
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
        var auction = AuctionStore.getState().currentAuction;
        var ticket = TicketStore.getState().currentTicket;
        if (!!auction) {
            RebaseActions.bidOnAuction(this.props.user, auction, this.state.price);
            this.setState({ priceSubmitted: true });
        } else if (!!ticket) {
            RebaseActions.setTicketBudget(this.props.user, ticket, this.state.price);
            this.setState({ priceSubmitted: true });
        }
    },
    render: function() {
        var modal;
        var h3;
        var h4;
        var inputOrButton;
        var infoOrInput;
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
            var auctionStoreState = AuctionStore.getState();
            if (!this.state.priceSet) {
                h3 = 'Name your price';
                h4 = 'to work on this task';
                inputOrButton = <input type='number' ref='price' placeholder='Price in USD' />
            } else if (!this.state.priceSubmitted) {
                h3 = 'Is ' + this.state.price + 'USD Correct?';
                h4 = 'If accepted, you\'ll start right away!';
                inputOrButton = <button onClick={this.submitPrice}>Submit Bid</button>;
            }
            else if (this.state.priceSubmitted && auctionStoreState.bidPending) {
                h3 = 'Waiting...';
                h4 = 'Deal with it';
                inputOrButton = <button>waiting...</button>;
            }
            else if (auction.state == 'waiting_for_bids' && this.state.priceSubmitted && !auctionStoreState.bidPending ) {
                h3 = 'Your bid was not accepted.';
                h4 = 'But there are ' + auctionStoreState.availableAuctions.length + ' more tasks waiting for you!';
                inputOrButton = <button onClick={this.props.closeModal}>Show Tasks</button>;
            }
            else if (auction.state == 'closed' && this.state.priceSubmitted) {
                h3 = 'Your bid was accepted!';
                h4 = 'Get started by cloning and running the tests';
                inputOrButton = <button onClick={this.props.closeModal}>Show Task</button>;
            }

        }
        return (
            <div id='modalDialog' onChange={this.handleInput} onKeyPress={this.handleKeyPress}>
                <div onClick={this.props.closeModal} id='modalClose'>
                    <img src='img/modal-close.svg'/>
                </div>
                <h3>{h3}</h3>
                <h4>{h4}</h4>
                {infoOrInput}
                {inputOrButton}
            </div>
        );
    }
});

module.exports = ModalView;
