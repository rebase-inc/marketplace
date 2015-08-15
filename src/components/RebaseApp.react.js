var React = require('react');
var _ = require('underscore');

var Icons = require('../components/RebaseIcons.react');
var Sidebar = require('../components/Sidebar.react');
var NewTicketView = require('../components/NewTicketView.react');
var AvailableAuctionsView = require('../components/AvailableAuctionsView.react');
var SingleTicketView = require('../components/SingleTicketView.react');
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
        this.setState({ currentView: ind , currentTicket: null });
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
            allTickets: TicketStore.getTickets(),
            availableAuctions: AuctionStore.getAvailableAuctions(),
        }
    },

    selectTicket: function(ticket) {
        this.setState({ currentTicket: ticket });
    },

    unselectTicket: function() {
        this.selectTicket(null);
    },
    changeRole: function(newRole) {
        this.setState({
            currentRole: newRole,
            currentTicket: null,
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
                (<AvailableAuctionsView availableAuctions={this.state.availableAuctions} selectTicket={this.selectTicket}/>),
                (<div>IN PROGRESS</div>),
                (<div>COMPLETED</div>),
            ],
            manager: [
                (<NewTicketView tickets={this.state.allTickets} selectTicket={this.selectTicket}/>),
                (<div>IN PROGRESS</div>),
                (<div>COMPLETED</div>),
            ],
        }
        if (!!this.state.currentTicket) {
            currentViewElement = <SingleTicketView
            user={this.props.user}
            currentRole={this.state.currentRole}
            unselectTicket={this.unselectTicket}
            ticket={this.state.currentTicket}
            openModal={this.openModal} closeModal={this.closeModal} />;
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
