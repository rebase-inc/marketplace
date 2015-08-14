var React = require('react');
var _ = require('underscore');

var Icons = require('../components/RebaseIcons.react');
var Sidebar = require('../components/Sidebar.react');
var NewTicketView = require('../components/NewTicketView.react');
var OfferedTicketView = require('../components/OfferedTicketView.react');
var SingleTicketView = require('../components/SingleTicketView.react');
var TicketStore = require('../stores/TicketStore');
var ViewsByRole = require('../constants/ViewConstants').ViewsByRole;

function getState(user) {
    return {
        newTickets: TicketStore.getTickets(),
        currentTicket: null,
    }
}

var RebaseApp = React.createClass({

    changeView: function(ind) {
        this.setState({ currentView: ind , currentTicket: null });
    },

    _onChange: function() {
        this.setState({ newTickets: TicketStore.getTickets() });
    },
    componentDidMount: function() { TicketStore.addChangeListener(this._onChange); },
    componentWillUnmount: function() { TicketStore.removeChangeListener(this._onChange); },

    getInitialState: function() {
        var currentRole = this.props.user.roles[0];
        var currentView = ViewsByRole[currentRole.type][0];
        return _.extend({
            currentRole: currentRole,
            currentView: currentView,
        }, getState(this.props.user));
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

    render: function() {
        var currentViewElement;
        var viewElements = {
            developer: [
                (<OfferedTicketView tickets={this.state.newTickets} selectTicket={this.selectTicket}/>),
                (<div>IN PROGRESS</div>),
                (<div>COMPLETED</div>),
            ],
            manager: [
                (<NewTicketView tickets={this.state.newTickets} selectTicket={this.selectTicket}/>),
                (<div>IN PROGRESS</div>),
                (<div>COMPLETED</div>),
            ],
        }
        if (!!this.state.currentTicket) {
            currentViewElement = <SingleTicketView unselectTicket={this.unselectTicket} user={this.props.user} ticket={this.state.currentTicket}/>;
        }
        else {
            currentViewElement = viewElements[this.state.currentRole.type][this.state.currentView.id];
        }
        return (
            <div id='app'>
            <Sidebar user={this.props.user}
            currentRole={this.state.currentRole} changeRole={this.changeRole}
            currentView={this.state.currentView} changeView={this.changeView}/>
            { currentViewElement }
            </div>
        );
    },

});

module.exports = RebaseApp;
