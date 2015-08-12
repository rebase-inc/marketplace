


function getAppState() {
    _dummyState.views[0].element = ( <NewTicketView tickets={TicketStore.getTickets()} />);
    return _.extend({filterText: ''}, _dummyState);
}

var RebaseApp = React.createClass({
    getInitialState: function() { return getAppState(); },

    componentDidMount: function() { TicketStore.addChangeListener(this._onChange); },
    componentWillUnmount: function() { TicketStore.removeChangeListener(this._onChange); },

    // Method to setState based upon Store changes
    _onChange: function() { this.setState(getAppState();); },

    changeView: function(viewName) {
        this.setState({
            currentViewName: viewName ,
            currentTicket: {}
        });
    },
    changeProject: function(organization, project) {
        this.setState({
            organization: organization,
            project: project
        });
    },
    selectTicket: function(ticket) {
        this.setState({ currentTicket: ticket });
    },
    render: function() {
        var currentView;
        console.log(this.state);
        currentView = this.state.views.filter(function(view) { return view.name == this.state.currentViewName; }.bind(this))[0].element;
        if (this.state.currentTicket.title != undefined) { currentView = <SingleTicket ticket={this.state.currentTicket}/>; }
        return (
                <div id='app'>
                <Sidebar
                    organization={this.state.organization}
                    project={this.state.project}
                    user={this.state.user}
                    views={this.state.views}
                    currentViewName={this.state.currentViewName}
                    changeView={this.changeView}
                />
                {currentView}
                </div>
               );
    }
});

