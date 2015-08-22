var React = require('react');
var _ = require('underscore');

var Icons = require('../components/RebaseIcons.react');
var TicketStore = require('../stores/TicketStore');
var RebaseActions = require('../actions/RebaseActions');
var SingleItemView = require('../components/SingleItemView.react');
var LoadingAnimation = require('../components/LoadingAnimation.react');
var ModalView = require('../components/ModalView.react');

var MainView = React.createClass({
    getInitialState: function() {
        return _.extend({ filterText: '' }, TicketStore.getState());
    },
    getDataIfNeeded: function() {
        RebaseActions.getTicketData();
    },
    componentDidMount: function() {
        TicketStore.addChangeListener(this._onChange);
        this.getDataIfNeeded();
    },
    componentWillUnmount: function() {
        TicketStore.removeChangeListener(this._onChange);
    },
    _onChange: function() {
        this.setState(TicketStore.getState());
    },
    selectTicket: function(ticket) {
        TicketStore.select(ticket);
        this._onChange();
    },
    unselectTicket: function() {
        this.selectTicket(null);
    },
    // this is probably not how we should be handling the filterText
    handleUserInput: function(filterText) { this.setState({ filterText: filterText }); },
    render: function() {
        if (!!this.state.currentTicket) {
            var props = {
                backAction: this.unselectTicket,
                buttonAction: this.props.openModal,
                currentRole: this.props.currentRole,
                ticket: this.state.currentTicket,
                user: this.props.user,
            }
            return <SingleItemView {...props} />;
        } else {
            var props = {
                filterText: this.state.filterText,
                tickets: this.state.allTickets.filter(ticket => ticket.type == this.props.currentView.type),
                selectTicket: this.selectTicket,
                currentRole: this.props.currentRole,
            }
            return (
                <div className='mainContent'>
                <SearchBar filterText={this.state.filterText} onUserInput={this.handleUserInput}/>
                { this.state.loading ? <LoadingAnimation /> : <TicketList {...props} /> }
                </div>
            );
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
            return ticket.title.indexOf(this.props.filterText) != -1;
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

var ProjectInfoPanel = React.createClass({
    render: function() {
        var projectName = this.props.ticket.project.organization.title + '/' + this.props.ticket.project.title;
        return (
            <td onClick={this.handleClick} className='projectInfoPanel'>
            <span>{projectName}</span>
            <img src='img/rating-dots.svg'/>
            </td>
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

var SearchBar = React.createClass({
    handleChange: function() {
        this.props.onUserInput( this.refs.filterTextInput.getDOMNode().value );
    },
    render: function() {
        return (
                <form id='ticketSearchBar'>
                    <input type='text' placeholder='Search for tickets' value={this.props.filterText} onChange={this.handleChange} ref='filterTextInput'/>
                </form>
               );
    }
});

module.exports = MainView;
