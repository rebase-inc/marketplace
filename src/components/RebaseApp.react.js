var React = require('react');
var _ = require('underscore');

var Icons = require('../components/RebaseIcons.react');
var Sidebar = require('../components/Sidebar.react');
var NewTicketView = require('../components/NewTicketView.react');
var OfferedTicketView = require('../components/OfferedTicketView.react');
var SingleTicketView = require('../components/SingleTicketView.react');
var TicketStore = require('../stores/TicketStore');

function getState() {
    return {
        newTickets: TicketStore.getTickets(),
        currentView: 'Offered',
        currentTicket: null,
        currentRole: 0,
    }
}

var RebaseApp = React.createClass({

    changeView: function(viewName) {
        this.setState({ currentView: viewName , currentTicket: null });
    },

    _onChange: function() {
        this.setState({ newTickets: TicketStore.getTickets() });
    },
    componentDidMount: function() { TicketStore.addChangeListener(this._onChange); },
    componentWillUnmount: function() { TicketStore.removeChangeListener(this._onChange); },
    //changeProject: function(organization, project) {
        //this.setState({
            //organization: organization,
            //project: project
        //});
    //},

    getInitialState: function() {
        return getState();
    },

    selectTicket: function(ticket) {
        this.setState({ currentTicket: ticket });
    },

    unselectTicket: function() {
        this.selectTicket(null);
    },
    changeRole: function(newRole) {
        //temp hack and a symptom of not storing the state in the correct place
        var startingView = {
            developer: 'Offered',
            manager: 'New/Waiting'
        }
        var roleType = this.props.user.roles[newRole].type;
        this.setState({
            currentRole: newRole,
            currentView: startingView[roleType]
        });
    },

    render: function() {
        var currentViewElement;
        var currentRole = this.props.user.roles[this.state.currentRole].type;
        var viewElements = {
            developer: {
                'Offered': (<OfferedTicketView tickets={this.state.newTickets} selectTicket={this.selectTicket}/>),
                'In Progress': (<div>IN PROGRESS</div>),
                'Completed': (<div>COMPLETED</div>),
            },
            manager: {
                'New/Waiting': (<NewTicketView tickets={this.state.newTickets} selectTicket={this.selectTicket}/>),
                'In Progress': (<div>IN PROGRESS</div>),
                'Completed': (<div>COMPLETED</div>),
            },
        }
        if (!!this.state.currentTicket) {
            currentViewElement = <SingleTicketView goBack={this.unselectTicket} ticket={this.state.currentTicket}/>;
        }
        else {
            currentViewElement = viewElements[currentRole][this.state.currentView];
        }
        // passing this.state through below into the viewState prop is a huge hack that needs to be fixed
        return (
            <div id='app'>
            <Sidebar user={this.props.user} currentView={this.state.currentView} viewState={this.state} changeRole={this.changeRole} views={this.props.views} changeView={this.changeView}/>
            { currentViewElement }
            </div>
        );
    },

});

module.exports = RebaseApp;
