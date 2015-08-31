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
var ModalContainer = require('../components/ModalContainer.react');

// Constants
var viewConstants = require('../constants/viewConstants');

// Icons
var Icons = require('../components/RebaseIcons.react');

// Utils
var Fuse = require('../utils/fuse');

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
    handleUserInput: function(searchText) { this.setState({ searchText: searchText }); },
    render: function() {
        if (!!this.state.currentAuction) {
            return <SingleAuctionView {...this.props} {...this.state} unselectAuction={this.selectAuction.bind(null, null)} />;
        } else {
            var props = _.extend({ selectAuction: this.selectAuction }, this.state, this.props);
            return (
                <div className='mainContent'>
                    <SearchBar searchText={this.state.searchText} onUserInput={this.handleUserInput}/>
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
    getInitialState: function() { return { modalOpen: false }; },
    openModal: function() { this.setState({ modalOpen: true }); console.log('opening modal'); },
    closeModal: function() { this.setState({ modalOpen: false }); },
    render: function() {
        var ticket = this.props.currentAuction.ticket_set.bid_limits[0].ticket_snapshot.ticket;
        var makeButton = function(props) {
            return <button onClick={props.onClick} className={props.className}>{props.text}</button>;
        }
        var buttons = [];
        var modal;
        switch (this.props.currentRole.type) {
            case 'contractor':
                buttons.push(<button onClick={this.openModal}>Bid Now</button>);
                modal = <BidModal {..._.extend({closeModal: this.closeModal}, {...this.props})} />
                break;
            case 'manager':
                buttons.push(<button onClick={this.openModal}>Find More Talent</button>);
                modal = null;
                break;
        }
        return (
            <SingleTicketView {...this.props}>
                { this.state.modalOpen ? modal : null }
                <TicketHeader goBack={this.props.unselectAuction} title={ticket.title}>
                    {buttons}
                </TicketHeader>
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
        var allTickets = this.props.allAuctions.map(function(auction) {
            var _ticket = auction.ticket_set.bid_limits[0].ticket_snapshot.ticket;
            _ticket.auctionID = auction.id;
            return _ticket;
        });
        var searchTickets = function() {
            var fuseSearch = new Fuse(allTickets, {threshold: 0.35, keys: ['title', 'description', 'project.name', 'project.organization.name'], id: 'auctionID'});
            return fuseSearch.search(this.props.searchText.substring(0, 32));
        }.bind(this);
        var auctionIDs = this.props.searchText ? searchTickets() : allTickets.map(t => t.auctionID);
        var makeTicketElement = function(auction) {
            return <Auction auction={auction} key={auction.id} {...props} />;
        }.bind(props);
        if (!!this.props.allAuctions.length) {
            return (
                <table id='ticketList'>
                    <tbody>
                        { auctionIDs.map(auctionID => this.props.allAuctions.filter(auction => auction.id == auctionID)[0]).map(makeTicketElement) }
                    </tbody>
                </table>
            );
        } else if (this.props.loadingAuctionData) {
            return <LoadingAnimation />;
        } else {
            return <NothingHere text={'We\'re working to find some great auctions for you!'}/>;
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

var BidModal = React.createClass({
    getInitialState: function() {
        return {
            price: '',
            priceSubmitted: false,
        }
    },
    handleKeyPress: function(event) {
        if (event.charCode == 13) {
            this.setState({ price: this.refs.price.getDOMNode().value });
        }
    },
    submitPrice: function() {
        AuctionActions.bidOnAuction(this.props.currentUser, this.props.currentAuction, this.state.price);
        this.setState({ priceSubmitted: true });
    },
    render: function() {
        if (!this.state.price) {
            return (
                <ModalContainer>
                    <div onClick={this.props.closeModal} id='modalClose'>
                        <img src='img/modal-close.svg'/>
                    </div>
                    <h3>Name your price</h3>
                    <h4>to work on this task</h4>
                    <input type='number' ref='price' placeholder='Price in USD' onKeyPress={this.handleKeyPress}/>
                </ModalContainer>
            );
        } else if (!this.state.priceSubmitted) {
            return (
                <ModalContainer>
                    <div onClick={this.props.closeModal} id='modalClose'>
                        <img src='img/modal-close.svg'/>
                    </div>
                    <h3>{'Is ' + this.state.price + ' USD Correct?'}</h3>
                    <h4>If accepted, you'll start right away!</h4>
                    <button onClick={this.submitPrice}>Submit Bid</button>
                </ModalContainer>
            );
        } else if (true) {
            return (
                <ModalContainer>
                    <LoadingAnimation />
                </ModalContainer>
            );
        } else {
            throw 'fuck';
            var remainingTickets = TicketStore.getState().allTickets.filter(function(ticket) { return ticket.type == ticketTypes.OFFERED; });
            mainHeading = 'Your bid was not accepted.';
            subHeading = 'But there are ' + remainingTickets.length + ' more tasks waiting for you!';
            inputOrButton = <button onClick={this.props.closeModal}>Show Tasks</button>;
        }
    }
});

module.exports = AuctionView;
