var React = require('react');
var _ = require('underscore');

var Icons = require('../components/RebaseIcons.react');
var Sidebar = require('../components/Sidebar.react');
var NewTicketView = require('../components/NewTicketView.react');
var TicketStore = require('../stores/TicketStore');

function getState() { return { newTickets: TicketStore.getTickets() } }

var RebaseApp = React.createClass({
    _onChange: function() { this.setState(getState()); },
    componentDidMount: function() { TicketStore.addChangeListener(this._onChange); },
    componentWillUnmount: function() { TicketStore.removeChangeListener(this._onChange); },

    //changeView: function(viewName) {
        //this.setState({
            //currentViewName: viewName ,
            //currentTicket: {}
        //});
    //},
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

    render: function() {
        var role = this.props.user.roles[this.props.viewState.currentRole].type;
        var currentView = this.props.views[role][this.props.viewState.currentView].name;
        return (
            <div id='app'>
            <Sidebar user={this.props.user} viewState={this.props.viewState} views={this.props.views}/>
            {currentView === 'Offered' ?     <NewTicketView tickets={this.state.newTickets} /> : null}
            {currentView === 'In Progress' ? <div>IN PROGRESS</div> : null}
            {currentView === 'Completed' ?   <div>COMPLETED</div> : null}
            </div>
        );
    },

});

module.exports = RebaseApp;
