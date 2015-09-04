// External
var React = require('react');
var _ = require('underscore');

// Stores
var TicketStore = require('../stores/TicketStore');

// Actions
var TicketActions = require('../actions/TicketActions');

// Components
var SearchBar = require('../components/SearchBar.react');
var NothingHere = require('../components/NothingHere.react');
var LoadingAnimation = require('../components/LoadingAnimation.react');
var TicketHeader = require('../components/TicketHeader.react');
var CommentList = require('../components/CommentList.react');
var CommentBox = require('../components/CommentBox.react');
var FindTalentPanel = require('../components/FindTalentPanel.react');

// Constants
var viewConstants = require('../constants/viewConstants');

// Icons
var Icons = require('../components/RebaseIcons.react');

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
                var buttons = <button onClick={this.toggleModal}>Find Talent</button>;
                var modal = null; //<BidModal {..._.extend({toggleModal: this.toggleModal}, {...this.props})} />
                return (
                    <div className='ticketView'>
                        { this.state.modalOpen ? modal : null }
                        <TicketHeader goBack={TicketActions.selectTicket.bind(null, null)} title={this.state.currentTicket.title}>
                            {buttons}
                        </TicketHeader>
                        <CommentList comments={this.state.currentTicket.comments}/>
                        <CommentBox ticket={this.state.currentTicket} user={this.props.currentUser} />
                    </div>
                );
                break;
            default:
                props.allTickets = this.state.allTickets;
                props.selectTicket = TicketActions.selectTicket;
                return (
                    <div className='ticketView'>
                        <SearchBar searchText={this.state.searchText} onUserInput={this.handleUserInput}/>
                        <TicketList {...props} />
                    </div>
                );
                break;
        }
    }
});

function searchTickets(tickets, searchText) {
    var fuseSearch = new Fuse(tickets, {threshold: 0.35, keys: ['title', 'description', 'project.name', 'project.organization.name'], id: 'id'});
    return fuseSearch.search(searchText.substring(0, 32));
}

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
        var makeTicketElement = function(ticket) { return <Ticket ticket={ticket} key={ticket.id} {...props} />; }.bind(props);
        var ticketIDs = !!this.props.searchText ? searchTickets(this.props.allTickets, this.props.searchText) : this.props.allTickets.map(a => a.id);
        if (!!this.props.allTickets.length) {
            return (
                <table id='ticketList'>
                    <tbody>
                        { this.props.allTickets.filter(ticket => ticketIDs.indexOf(ticket.id) != -1).map(makeTicketElement) }
                    </tbody>
                </table>
            );
        } else if (this.props.loading) {
            return <LoadingAnimation />;
        } else {
            return <NothingHere text={'You don\'t have any tickets! Import some from GitHub!'}/>;
        }
    }
});

var Ticket = React.createClass({
    selectTicket: function() { this.props.selectTicket(this.props.ticket.id); },
    render: function() {
        var role = this.props.currentRole;
        return (
            <tr className='ticket'>
                <FindTalentPanel ticket={this.props.ticket} />
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

module.exports = TicketView;
