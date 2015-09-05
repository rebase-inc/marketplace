var React = require('react');

// Components
var NothingHere = require('../components/NothingHere.react');
var LoadingAnimation = require('../components/LoadingAnimation.react');
var Ticket = require('../components/Ticket.react');

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

module.exports = TicketList;
