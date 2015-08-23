var React = require('react');

var TicketStore = require('../stores/TicketStore');
var RebaseActions = require('../actions/RebaseActions');
var ViewConstants = require('../constants/ViewConstants');

var ticketTypes = ViewConstants.ticketTypes;

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
        var ticket = TicketStore.getState().currentTicket;
        RebaseActions.bidOnAuction(this.props.user, ticket, this.state.price);
        this.setState({ priceSubmitted: true });
    },
    render: function() {
        var modal;
        var mainHeading;
        var subHeading;
        var inputOrButton;
        var infoOrInput;
        var ticket = TicketStore.getState().currentTicket;
        var role = this.props.currentRole;
        // this is a fucking nightmare
        switch (this.props.currentRole.type) {
            case 'developer':
                switch (ticket.type) {
                case ticketTypes.NEW: break;
                case ticketTypes.OFFERED:
                    if (!this.state.priceSet) {
                        mainHeading = 'Name your price';
                        subHeading = 'to work on this task';
                        inputOrButton = <input type='number' ref='price' placeholder='Price in USD' />;
                    } else if (!this.state.priceSubmitted) {
                        mainHeading = 'Is ' + this.state.price + ' USD Correct?';
                        subHeading = 'If accepted, you\'ll start right away!';
                        inputOrButton = <button onClick={this.submitPrice}>Submit Bid</button>;
                    } else if (TicketStore.getState().bidPending) {
                        mainHeading = 'Waiting...';
                        subHeading = 'Deal with it';
                        inputOrButton = <button>Waiting...</button>;
                    } else {
                        var remainingTickets = TicketStore.getState().allTickets.filter(function(ticket) { return ticket.type == ticketTypes.OFFERED; });
                        mainHeading = 'Your bid was not accepted.';
                        subHeading = 'But there are ' + remainingTickets.length + ' more tasks waiting for you!';
                        inputOrButton = <button onClick={this.props.closeModal}>Show Tasks</button>;
                    }
                    break;
                case ticketTypes.IN_PROGRESS:
                    mainHeading = 'Your bid was accepted!';
                    subHeading = 'Get started by cloning and running the tests';
                    infoOrInput = <div className='infoOrInput cloneInstructions'> $ git clone git@github.com:airpool/ios <br/> $ cd api && python tests/run.py </div>;
                    inputOrButton = <button onClick={this.props.closeModal}>Get to work!</button>;
                    break;
                case ticketTypes.COMPLETED: break;
            }
            break;
            case 'manager':
                switch (ticket.type) {
                case ticketTypes.NEW: break;
                    if (!this.state.priceSet) {
                        mainHeading = 'Set your budget';
                        subHeading = 'to see recommended developers';
                        inputOrButton = <input type='number' ref='price' placeholder='Budget in USD' />;
                    } else if (!this.state.priceSubmitted) {
                        mainHeading = 'Is ' + this.state.price + ' USD Correct?';
                        subHeading = 'This is just a maximum. Usually, you\'ll pay much less.';
                        inputOrButton = <button onClick={this.submitPrice}>Submit Budget</button>;
                    } else { mainHeading = 'Invalid State!'; }
                    break;
                case ticketTypes.OFFERED: break;
                case ticketTypes.IN_PROGRESS: break;
                case ticketTypes.COMPLETED: break;
            }
            break;
        }
        return (
            <div id='modalDialog' onChange={this.handleInput} onKeyPress={this.handleKeyPress}>
                <div onClick={this.props.closeModal} id='modalClose'>
                    <img src='img/modal-close.svg'/>
                </div>
                <h3>{mainHeading}</h3>
                <h4>{subHeading}</h4>
                {infoOrInput}
                {inputOrButton}
            </div>
        );
    }
});

module.exports = ModalView;
