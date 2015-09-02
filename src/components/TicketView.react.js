// External
var React = require('react');
var _ = require('underscore');

// Stores
var TicketStore = require('../stores/TicketStore');

// Actions
var TicketActions = require('../actions/TicketActions');

// Components
var SearchBar = require('../components/SearchBar.react');

// Constants
var viewConstants = require('../constants/viewConstants');

var TicketView = React.createClass({
    propTypes: {
        currentUser: React.PropTypes.object.isRequired,
        currentRole: React.PropTypes.object.isRequired,
    },
    getInitialState: function() {
        return _.extend({ searchText: '' }, TicketStore.getState());
    },
    _onChange: function() {
        this.setState(TicketStore.getState());
    },
    componentDidMount: function() {
        TicketStore.addChangeListener(this._onChange);
        setTimeout(TicketActions.getTicketData, 0);
    },
    componentWillUnmount: function() {
        TicketStore.removeChangeListener(this._onChange);
    },
    handleUserInput: function(searchText) {
        this.setState({ searchText: searchText });
    },
    render: function() {
        var props = {
            loading: this.state.loading,
            currentUser: this.props.currentUser,
            currentRole: this.props.currentRole,
        }
        switch (!!this.state.currentTicket) {
            case true:
                props.unselectTicket = TicketActions.selectTicket.bind(null, null);
                props.currentTicket = this.state.currentTicket;
                return <SingleTicketView {...props} />;
                break;
            default:
                props.allTickets = this.state.allTickets;
                props.selectTicket = TicketActions.selectTicket;
                return (
                    <div className='mainContent'>
                    <SearchBar searchText={this.state.searchText} onUserInput={this.handleUserInput}/>
                    <TicketList {...props} />
                    </div>
                );
                break;
        }
    }
});

var TicketList = React.createClass({
    render: function() {
        var props = {
            selectTicket: this.props.selectTicket,
            currentRole: this.props.currentRole,
        }
        var ticketMatchesText = function(ticket) {
            return ticket.title.indexOf(this.props.searchText) != -1;
        }.bind(this);
        var makeTicketElement = function(ticket) {
            return <Ticket ticket={ticket} key={ticket.id} {...props} />;
        }.bind(props);
        return (
            <table id='ticketList'>
                <tbody>
                    { this.props.tickets.filter(ticketMatchesText).map(makeTicketElement) }
                </tbody>
            </table>
        );
    }
});

var TicketList = React.createClass({
    propTypes: {
        currentUser: React.PropTypes.object.isRequired,
        currentRole: React.PropTypes.object.isRequired,
        selectTicket: React.PropTypes.func.isRequired,
    },
    render: function() {
        var props = {
            selectTicket: this.props.selectTicket,
            currentRole: this.props.currentRole,
        }
        var allTickets = this.props.allTickets.map(function(ticket) {
            var _ticket = ticket.ticket_set.bid_limits[0].ticket_snapshot.ticket;
            _ticket.ticketID = ticket.id;
            return _ticket;
        });
        var searchTickets = function() {
            var fuseSearch = new Fuse(allTickets, {threshold: 0.35, keys: ['title', 'description', 'project.name', 'project.organization.name'], id: 'ticketID'});
            return fuseSearch.search(this.props.searchText.substring(0, 32));
        }.bind(this);
        var ticketIDs = this.props.searchText ? searchTickets() : allTickets.map(t => t.ticketID);
        var makeTicketElement = function(ticket) {
            return <Ticket ticket={ticket} key={ticket.id} {...props} />;
        }.bind(props);
        if (!!this.props.allTickets.length) {
            return (
                <table id='ticketList'>
                    <tbody>
                        { ticketIDs.map(ticketID => this.props.allTickets.filter(ticket => ticket.id == ticketID)[0]).map(makeTicketElement) }
                    </tbody>
                </table>
            );
        } else if (this.props.loading) {
            return <LoadingAnimation />;
        } else {
            return <NothingHere text={'We\'re working to find some great tickets for you!'}/>;
        }
    }
});

var Ticket = React.createClass({
    selectTicket: function() { this.props.selectTicket(this.props.ticket); },
    render: function() {
        var role = this.props.currentRole;
        return (
            <tr className='ticket'>
                { role.type == 'manager' ?
                    <FindTalentPanel ticket={this.props.ticket} /> :
                    <ProjectInfoPanel ticket={this.props.ticket} /> }
                <td className='titlePanel'>{this.props.ticket.title}</td>
                <td className='skillsRequiredPanel'>{this.props.ticket.skillsRequired}</td>
                <td className='commentsPanel' onClick={this.selectTicket}>
                    <Icons.Comment/>
                    <span>{this.props.ticket.comments.length} Comments</span>
                </td>
            </tr>
        );
    }
});

var FindTalentPanel = React.createClass({
    handleClick: function() { alert('Finding talent, motherfucker.'); },
    render: function() {
        return (
            <td onClick={this.handleClick} className='findTalentPanel'>
            <Icons.FindTalent/>
            <span>Find Talent</span>
            </td>
        );
    }
});


module.exports = TicketView;
