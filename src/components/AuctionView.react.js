// External
var React = require('react');
var _ = require('underscore');

// Stores
var AuctionStore = require('../stores/AuctionStore');

// Actions
var TicketActions = require('../actions/TicketActions');

// Components
var SearchBar = require('../components/SearchBar.react');

// Constants
var viewConstants = require('../constants/viewConstants');

var AuctionView = React.createClass({
    getInitialState: function() {
        return _.extend({ filterText: '' }, AuctionStore.getState());
    },
    //getDataIfNeeded: function() {
        //setTimeout(RebaseActions.getAuctionData, 0);
    //},
    //componentDidMount: function() {
        //AuctionStore.addChangeListener(this._onChange);
        //this.getDataIfNeeded();
    //},
    //componentWillUnmount: function() {
        //AuctionStore.removeChangeListener(this._onChange);
    //},
    //_onChange: function() {
        //this.setState(AuctionStore.getState());
    //},
    //selectAuction: function(ticket) {
        //AuctionStore.select(ticket);
        //this._onChange();
    //},
    //unselectAuction: function() {
        //this.selectAuction(null);
    //},
    // this is probably not how we should be handling the filterText
    //handleUserInput: function(filterText) { this.setState({ filterText: filterText }); },
    render: function() {
        if (!!this.state.currentAuction) {
            var props = {
                backAction: this.unselectAuction,
                buttonAction: this.props.openModal,
                currentRole: this.props.currentRole,
                ticket: this.state.currentAuction,
                user: this.props.user,
            }
            return <SingleItemView {...props} />;
        } else {
            // make sure we only display new tickets - this is really only important if the user is logged in as admin
            var props = { filterText: this.state.filterText,
                selectAuction: this.selectAuction,
                currentRole: this.props.currentRole,
                tickets: this.state.allAuctions.filter(ticket => ticket.type = ticketType.NEW),
            }
            return (
                <div className='mainContent'>
                <SearchBar filterText={this.state.filterText} onUserInput={this.handleUserInput}/>
                { this.state.loading ? <LoadingAnimation /> : <AuctionList {...props} /> }
                </div>
            );
        }
    }
});

var AuctionList = React.createClass({
    render: function() {
        var props = {
            selectTicket: this.props.selectTicket,
            currentRole: this.props.currentRole,
        }
        var ticketMatchesText = function(ticket) {
            return ticket.title.indexOf(this.props.searchText) != -1;
        }.bind(this);
        var makeTicketElement = function(ticket) {
            return <Auction ticket={ticket} key={ticket.id} {...props} />;
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

var Auction = React.createClass({
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
        var projectName = this.props.ticket.project.organization.name + '/' + this.props.ticket.project.name;
        return (
            <td onClick={this.handleClick} className='projectInfoPanel'>
            <span>{projectName}</span>
            <RatingStars rating={this.props.ticket.project.rating || 3} />
            </td>
        );
    }
});

var RatingStars = React.createClass({
    render: function() {
        var nearestHalf = Math.round(this.props.rating*2)/2;
        var fullStars = Math.floor(nearestHalf);
        var showHalfStar = (nearestHalf != fullStars);
        return (
            <div className='rating'>
                { _.range(fullStars).map(function() { return <img src='img/star-10px.svg' /> }) }
                { showHalfStar ? <img src='img/half-star-10px.svg' /> : null }
                { _.range(5 - fullStars - showHalfStar).map(function() { return <img src='img/empty-star-10px.svg' /> }) }
            </div>
        );
    }
});

module.exports = AuctionView;
