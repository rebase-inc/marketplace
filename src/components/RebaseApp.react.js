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
    }
}

var RebaseApp = React.createClass({
    _onChange: function() { console.log('on change!'); },
    componentDidMount: function() { TicketStore.addChangeListener(this._onChange); },
    componentWillUnmount: function() { TicketStore.removeChangeListener(this._onChange); },

    changeView: function(viewName) {
        this.setState({ currentView: viewName , currentTicket: null });
        console.log('changing current view to ' + viewName);
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

    render: function() {
        var role = this.props.user.roles[this.props.viewState.currentRole].type;
        var currentViewElement;
        switch (this.state.currentView) {
            case 'Offered':
                currentViewElement = <NewTicketView tickets={this.state.newTickets} selectTicket={this.selectTicket}/>;
                currentViewElement = <OfferedTicketView tickets={this.state.newTickets} selectTicket={this.selectTicket}/>;
            break;
            case 'In Progress':
                currentViewElement = <div>IN PROGRESS</div>;
            break;
            case 'Completed':
                currentViewElement = <div>COMPLETED</div>;
            break;
            default:
                currentViewElement = <div>ERROR!!!</div>;
            break;
        }
        if (!!this.state.currentTicket) {
            currentViewElement = <SingleTicketView goBack={this.unselectTicket} ticket={this.state.currentTicket}/>;
        }
        return (
            <div id='app'>
            <Sidebar user={this.props.user} currentView={this.state.currentView} viewState={this.props.viewState} views={this.props.views} changeView={this.changeView}/>
            { currentViewElement }
            </div>
        );
    },

});

module.exports = RebaseApp;
