var React = require('react');
var _ = require('underscore');

var Icons = require('../components/RebaseIcons.react');
var Sidebar = require('../components/Sidebar.react');
var NewTicketView = require('../components/NewTicketView.react');
var TicketStore = require('../stores/TicketStore');

var RebaseApp = React.createClass({
    // Method to setState based upon Store changes
    //_onChange: function() { this.setState(getAppState()); },

    //componentDidMount: function() { TicketStore.addChangeListener(this._onChange); },
    //componentWillUnmount: function() { TicketStore.removeChangeListener(this._onChange); },

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
    selectTicket: function(ticket) {
        this.setState({ currentTicket: ticket });
    },
    render: function() {
        var role = this.props.user.roles[this.props.viewState.currentRole].type;
        var currentView = this.props.views[role][this.props.viewState.currentView].name;
        return (
            <div id='app'>
            <Sidebar user={this.props.user} viewState={this.props.viewState} views={this.props.views}/>
            {currentView === 'Offered' ?     <NewTicketView tickets={TicketStore.getTickets()} /> : null}
            {currentView === 'In Progress' ? <div>IN PROGRESS</div> : null}
            {currentView === 'Completed' ?   <div>COMPLETED</div> : null}
            </div>
        );
    }
});

module.exports = RebaseApp;
