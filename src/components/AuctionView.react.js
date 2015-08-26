// External
var React = require('react');
var _ = require('underscore');

// Stores
var AuctionStore = require('../stores/AuctionStore');

// Actions
var AuctionActions = require('../actions/AuctionActions');

// Components
var SearchBar = require('../components/SearchBar.react');

// Constants
var viewConstants = require('../constants/viewConstants');

// Icons
var Icons = require('../components/RebaseIcons.react');

var AuctionView = React.createClass({
    propTypes: {
        currentUser: React.PropTypes.object.isRequired,
        currentRole: React.PropTypes.object.isRequired,
    },
    getInitialState: function() {
        return _.extend({ searchText: '' }, AuctionStore.getState());
    },
    componentDidMount: function() {
        AuctionStore.addChangeListener(this._onChange);
        setTimeout(AuctionActions.getAuctionData, 0);
    },
    componentWillUnmount: function() {
        AuctionStore.removeChangeListener(this._onChange);
    },
    _onChange: function() {
        this.setState(AuctionStore.getState());
    },
    //selectAuction: function(ticket) {
        //AuctionStore.select(ticket);
        //this._onChange();
    //},
    //unselectAuction: function() {
        //this.selectAuction(null);
    //},
    // this is probably not how we should be handling the searchText
    //handleUserInput: function(searchText) { this.setState({ searchText: searchText }); },
    render: function() {
        if (!!this.state.currentAuction) {
            var props = _.extend({ goBack: this.unselectAuction, auction: this.state.currentAuction}, this.state, this.props);
            return <SingleItemView {...props} />;
        } else {
            var props = _.extend({ selectAuction: this.selectAuction }, this.state, this.props);
            return (
                <div className='mainContent'>
                <SearchBar searchText={this.state.searchText} onUserInput={this.handleSearchInput}/>
                { this.state.loading ? <LoadingAnimation /> : <AuctionList {...props} /> }
                </div>
            );
        }
    }
});

var AuctionList = React.createClass({
    propTypes: {
        currentUser: React.PropTypes.object.isRequired,
        currentRole: React.PropTypes.object.isRequired,
    },
    render: function() {
        var props = {
            selectTicket: this.props.selectTicket,
            currentRole: this.props.currentRole,
        }
        var titleMatchesText = function(auction) {
            return true; // until we make this actually work
            return auction.title.indexOf(this.props.searchText) != -1;
        }.bind(this);
        var makeTicketElement = function(auction) {
            return <Auction auction={auction} key={auction.id} {...props} />;
        }.bind(props);
        if (!this.props.allAuctions) { return  <div>There doesn't seem to be any tickets available!</div>; }
        return (
            <table id='ticketList'>
                <tbody>
                    { this.props.allAuctions.filter(titleMatchesText).map(makeTicketElement) }
                </tbody>
            </table>
        );
    }
});

var Auction = React.createClass({
    propTypes: {
        currentRole: React.PropTypes.object.isRequired,
        auction: React.PropTypes.object.isRequired,
    },
    selectTicket: function() { this.props.selectTicket(this.props.ticket); },
    render: function() {
        var ticket = this.props.auction.ticket_set.bid_limits[0].ticket_snapshot.ticket;
        return (
            <tr className='ticket'>
                { this.props.currentRole.type == 'manager' ?
                    <FindTalentPanel ticket={ticket} /> :
                    <ProjectInfoPanel ticket={ticket} /> }
                <td className='titlePanel'>{ticket.title}</td>
                <td className='skillsRequiredPanel'>{ticket.skillsRequired}</td>
                <td className='commentsPanel' onClick={this.selectTicket}>
                    <Icons.Comment/>
                    <span>{ticket.comments.length} Comments</span>
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
                { _.range(fullStars).map(function(el, ind) { return <img key={'full-' + ind} src='img/star-10px.svg' /> }) }
                { showHalfStar ? <img key='half' src='img/half-star-10px.svg' /> : null }
                { _.range(5 - fullStars - showHalfStar).map(function(el, ind) { return <img key={'empty-' + ind} src='img/empty-star-10px.svg' /> }) }
            </div>
        );
    }
});

module.exports = AuctionView;
