var React = require('react');
var Icons = require('../components/RebaseIcons.react');

var OfferedTicketView = React.createClass({
    getInitialState: function() {
        return { filterText: '' };
    },
    handleUserInput: function(filterText) { this.setState({ filterText: filterText }); },
    render: function() {
        return (
            <div id='offeredTicketView' className='mainContent'>
            <SearchBar filterText={this.state.filterText} onUserInput={this.handleUserInput}/>
            <OfferedTicketList selectTicket={this.props.selectTicket} tickets={this.props.tickets} filterText={this.state.filterText}/>
            </div>
        );
    }
});

var LoadingAnimation = React.createClass({
    render: function() {
        return (
            <div className="spinner">
            <div className="rect1"></div>
            <div className="rect2"></div>
            <div className="rect3"></div>
            <div className="rect4"></div>
            <div className="rect5"></div>
            </div>
        );
    }
});

var OfferedTicketList = React.createClass({
    render: function() {
        var all_tickets = [];
        if (!this.props.tickets.length) {
            return <LoadingAnimation />
        }
        this.props.tickets.forEach(function(ticket) {
            if ( ticket.title.indexOf(this.props.filterText) == -1 ) {
                return;
            }
            all_tickets.push(<OfferedTicket ticket={ticket} key={ticket.date} selectTicket={this.props.selectTicket}/>);
        }.bind(this));
        return (
            <table id='offeredTicketList'>
            <tbody>
            {all_tickets}
            </tbody>
            </table>
        );
    }
});

var OfferedTicket = React.createClass({
    selectTicket: function() { this.props.selectTicket(this.props.ticket); },
    render: function() {
        return (
            <tr className='offeredTicket'>
                <ProjectInfoPanel />
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

var ProjectInfoPanel = React.createClass({
    render: function() {
        return (
            <td onClick={this.handleClick} className='projectInfoPanel'>
            <span>foobar/baz</span>
            <img src='img/rating-dots.svg'/>
            </td>
        );
    }
});

var SearchBar = React.createClass({
    handleChange: function() {
        this.props.onUserInput( this.refs.filterTextInput.getDOMNode().value );
    },
    render: function() {
        return (
                <form id='offeredTicketSearchBar'>
                    <input type='text' placeholder='Search for tickets' value={this.props.filterText} onChange={this.handleChange} ref='filterTextInput'/>
                </form>
               );
    }
});

module.exports = OfferedTicketView;
