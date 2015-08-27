// External
var React = require('react');
var _ = require('underscore');

// Stores
var AuctionStore = require('../stores/AuctionStore');

// Actions
var AuctionActions = require('../actions/AuctionActions');

// Components
var SearchBar = require('../components/SearchBar.react');
var SingleTicketView = require('../components/SingleTicketView.react');
var TicketHeader = require('../components/TicketHeader.react');
var CommentList = require('../components/CommentList.react');
var CommentBox = require('../components/CommentBox.react');
var NothingHere = require('../components/NothingHere.react');
var LoadingAnimation = require('../components/LoadingAnimation.react');

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
    selectAuction: function(auctionID) {
        AuctionActions.selectAuction(auctionID);
    },
    // this is probably not how we should be handling the searchText
    //handleUserInput: function(searchText) { this.setState({ searchText: searchText }); },
    render: function() {
        if (!!this.state.currentAuction) {
            return <SingleAuctionView {...this.props} {...this.state} unselectAuction={this.selectAuction.bind(null, null)} />;
        } else {
            var props = _.extend({ selectAuction: this.selectAuction }, this.state, this.props);
            return (
                <div className='mainContent'>
                    <SearchBar searchText={this.state.searchText} onUserInput={this.handleSearchInput}/>
                    <AuctionList {...props} />
                </div>
            );
        }
    }
});

var SingleAuctionView = React.createClass({
    propTypes: {
        currentRole: React.PropTypes.object.isRequired,
        currentUser: React.PropTypes.object.isRequired,
        currentAuction: React.PropTypes.object.isRequired,
        unselectAuction: React.PropTypes.func.isRequired,
    },
    render: function() {
        var ticket = this.props.currentAuction.ticket_set.bid_limits[0].ticket_snapshot.ticket;
        return (
            <SingleTicketView {...this.props}>
                <TicketHeader goBack={this.props.unselectAuction} title={ticket.title} />
                <CommentList comments={ticket.comments}/>
                <CommentBox ticket={ticket} user={this.props.currentUser} />
            </SingleTicketView>
        );
    }
});

var AuctionList = React.createClass({
    propTypes: {
        currentUser: React.PropTypes.object.isRequired,
        currentRole: React.PropTypes.object.isRequired,
        selectAuction: React.PropTypes.func.isRequired,
    },
    render: function() {
        var props = {
            selectAuction: this.props.selectAuction,
            currentRole: this.props.currentRole,
        }
        var titleMatchesText = function(auction) {
            return true; // until we make this actually work
            return auction.title.indexOf(this.props.searchText) != -1;
        }.bind(this);
        var makeTicketElement = function(auction) {
            return <Auction auction={auction} key={auction.id} {...props} />;
        }.bind(props);
        if (this.props.loadingAuctionData) {
            return <LoadingAnimation />;
        } else if (!this.props.allAuctions.length) {
            return <NothingHere text={'We\'re working to find some great auctions for you!'}/>
        } else {
            return (
                <table id='ticketList'>
                    <tbody>
                        { this.props.allAuctions.filter(titleMatchesText).map(makeTicketElement) }
                    </tbody>
                </table>
            );
        }
    }
});

var Auction = React.createClass({
    propTypes: {
        currentRole: React.PropTypes.object.isRequired,
        auction: React.PropTypes.object.isRequired,
        selectAuction: React.PropTypes.func.isRequired,
    },
    render: function() {
        var ticket = this.props.auction.ticket_set.bid_limits[0].ticket_snapshot.ticket;
        return (
            <tr className='ticket'>
                { this.props.currentRole.type == 'manager' ?
                    <FindTalentPanel ticket={ticket} /> :
                    <ProjectInfoPanel ticket={ticket} /> }
                <td className='titlePanel'>{ticket.title}</td>
                <td className='skillsRequiredPanel'>{ticket.skillsRequired}</td>
                <td className='commentsPanel' onClick={this.props.selectAuction.bind(null, this.props.auction.id)}>
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
