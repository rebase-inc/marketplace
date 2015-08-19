var React = require('react');
var _ = require('underscore');

var Icons = require('../components/RebaseIcons.react');
var Sidebar = require('../components/Sidebar.react');
var NewTicketView = require('../components/NewTicketView.react');
var AvailableAuctionsView = require('../components/AvailableAuctionsView.react');
var SingleItemView = require('../components/SingleItemView.react');
var ModalView = require('../components/ModalView.react');
var TicketStore = require('../stores/TicketStore');
var AuctionStore = require('../stores/AuctionStore');
var ViewsByRole = require('../constants/ViewConstants').ViewsByRole;

function getState(user) {
    return {
        currentTicket: null,
    }
}

var RebaseApp = React.createClass({

    changeView: function(ind) {
        this.setState({
            currentView: ind ,
            currentTicket: null,
            currentAuction: null,
        });
    },

    _onChange: function() {
        this.setState({
            allTickets: TicketStore.getTickets(),
            availableAuctions: AuctionStore.getAvailableAuctions(),
        });
    },
    componentDidMount: function() {
        TicketStore.addChangeListener(this._onChange);
        AuctionStore.addChangeListener(this._onChange);
    },
    componentWillUnmount: function() {
        TicketStore.removeChangeListener(this._onChange);
        AuctionStore.removeChangeListener(this._onChange);
    },

    getInitialState: function() {
        var currentRole = this.props.user.roles[0];
        var currentView = ViewsByRole[currentRole.type][0];
        return {
            currentRole: currentRole,
            currentView: currentView,
            modalOpen: false,
            currentTicket: null,
            currentAuction: null,
            allTickets: TicketStore.getTickets(),
            availableAuctions: AuctionStore.getAvailableAuctions(),
        }
    },
    selectTicket: function(ticket) {
        this.setState({
            currentAuction: null,
            currentTicket: ticket
        });
    },
    selectAuction: function(auction) {
        this.setState({
            currentAuction: auction,
            currentTicket: null,
        });
    },
    unselectItem: function() {
        this.setState({
            currentAuction: null,
            currentTicket: null,
        });
    },
    changeRole: function(newRole) {
        this.setState({
            currentRole: newRole,
            currentTicket: null,
            currentAuction: null,
        });
    },
    openModal: function() {
        this.setState({ modalOpen: true });
    },
    closeModal: function() {
        this.setState({ modalOpen: false });
    },
    render: function() {
        var currentViewElement;
        var viewElements = {
            developer: [
                (<AvailableAuctionsView availableAuctions={this.state.availableAuctions} selectAuction={this.selectAuction}/>),
                (<div>IN PROGRESS</div>),
                (<div>COMPLETED</div>),
            ],
            manager: [
                (<NewTicketView tickets={this.state.allTickets} selectTicket={this.selectTicket}/>),
                (<div>IN PROGRESS</div>),
                (<div>COMPLETED</div>),
            ],
        }
        if (!!this.state.currentTicket || !!this.state.currentAuction) {
            var buttonAction = !!this.state.currentAuction ? this.openModal : function() { throw "Not implemented!"; };
            var props = {
                backAction: this.unselectItem,
                buttonAction: buttonAction,
                currentRole: this.state.currentRole,
                ticket: this.state.currentTicket,
                auction: this.state.currentAuction,
                user: this.props.user,
            }
            currentViewElement = <SingleItemView {...props} />
        }
        else {
            currentViewElement = viewElements[this.state.currentRole.type][this.state.currentView.id];
        }
        return (
            <div id='app'>
            <Sidebar user={this.props.user}
            currentRole={this.state.currentRole} changeRole={this.changeRole}
            currentView={this.state.currentView} changeView={this.changeView}/>
            { (this.state.modalOpen) ? <ModalView closeModal={this.closeModal} /> : null }
            { currentViewElement }
            </div>
        );
    },

});

module.exports = RebaseApp;
