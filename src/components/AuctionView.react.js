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
    _onChange: function() {
        this.setState(AuctionStore.getState());
    },
    componentDidMount: function() {
        AuctionStore.addChangeListener(this._onChange);
        setTimeout(AuctionActions.getAuctionData, 0);
    },
    componentWillUnmount: function() {
        AuctionStore.removeChangeListener(this._onChange);
    },
    handleUserInput: function(searchText) {
        this.setState({ searchText: searchText });
    },
    render: function() {
        var props = {
            loading: this.state.loading,
            currentUser: this.props.currentUser,
            currentRole: this.props.currentRole,
            searchText: this.state.searchText,
        }
        switch (!!this.state.currentAuction) {
            case true:
                props.unselectAuction = AuctionActions.selectAuction.bind(null, null);
                props.currentAuction = this.state.currentAuction;
                return <SingleAuctionView {...props} />;
                break;
            default:
                props.allAuctions = this.state.allAuctions;
                props.selectAuction = AuctionActions.selectAuction;
                props.searchText = this.state.searchText;
                return (
                    <div className='mainContent'>
                    <SearchBar searchText={this.state.searchText} onUserInput={this.handleUserInput}/>
                    <AuctionList {...props} />
                    </div>
                );
                break;
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
    getInitialState: function() {
        return { modalOpen: false };
    },
    toggleModal: function() {
        this.setState({ modalOpen: !this.state.modalOpen });
    },
    render: function() {
        var buttons = [];
        var modal;

        switch (this.props.currentRole.type) {
            case 'contractor':
                buttons.push(<button onClick={this.toggleModal}>Bid Now</button>);
                modal = <BidModal {..._.extend({toggleModal: this.toggleModal}, {...this.props})} />
                break;
            case 'manager':
                buttons.push(<button onClick={this.toggleModal}>Find More Talent</button>);
                modal = null;
                break;
        }
        return (
            <SingleTicketView {...this.props}>
                { this.state.modalOpen ? modal : null }
                <TicketHeader goBack={this.props.unselectAuction} title={this.props.currentAuction.ticket.title}>
                    {buttons}
                </TicketHeader>
                <CommentList comments={this.props.currentAuction.ticket.comments}/>
                <CommentBox ticket={this.props.currentAuction.ticket} user={this.props.currentUser} />
            </SingleTicketView>
        );
    }
});

// this should be put into the auction store so we don't have to reinstantiate the
// search object every time we change the search text
function searchAuctions(auctions, searchText) {
    var fuseSearch = new Fuse(auctions, {threshold: 0.35, keys: ['ticket.title', 'ticket.description', 'ticket.project.name', 'ticket.project.organization.name'], id: 'id'});
    return fuseSearch.search(searchText.substring(0, 32));
}

var AuctionList = React.createClass({
    propTypes: {
        currentUser: React.PropTypes.object.isRequired,
        currentRole: React.PropTypes.object.isRequired,
        selectAuction: React.PropTypes.func.isRequired,
        searchText: React.PropTypes.string.isRequired,
    },
    render: function() {
        var props = {
            selectAuction: this.props.selectAuction,
            currentRole: this.props.currentRole,
        }
        var makeTicketElement = function(auction) { return <Auction auction={auction} key={auction.id} {...props} />; }.bind(props);
        console.log('search text is ', this.props.searchText);
        var auctionIDs = !!this.props.searchText ? searchAuctions(this.props.allAuctions, this.props.searchText) : this.props.allAuctions.map(a => a.id);
        if (!!this.props.allAuctions.length) {
            return (
                <table id='ticketList'>
                    <tbody>
                        { this.props.allAuctions.filter(auction => auctionIDs.indexOf(auction.id) != -1).map(makeTicketElement) }
                    </tbody>
                </table>
            );
        } else if (this.props.loading) {
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
                    <div onClick={this.props.toggleModal} id='modalClose'>
                        <img src='img/modal-close.svg'/>
                    </div>
                    <h3>Name your price</h3>
                    <h4>to work on this task</h4>
                    <input type='number' ref='price' placeholder='Price in USD' onKeyPress={this.handleKeyPress}/>
                </ModalContainer>
            );
        } else if (!this.state.priceSubmitted || this.props.loading) {
            return (
                <ModalContainer>
                    <div onClick={this.props.toggleModal} id='modalClose'>
                        <img src='img/modal-close.svg'/>
                    </div>
                    <h3>{'Is ' + this.state.price + ' USD Correct?'}</h3>
                    <h4>If accepted, you'll start right away!</h4>
                    <button onClick={this.submitPrice}>Submit Bid</button>
                </ModalContainer>
            );
        } else if (this.props.currentAuction.state == 'waiting_for_bids') {
            var remainingTickets = AuctionStore.getState().allAuctions.filter(function(auction) { return auction.type == viewConstants.ViewTypes.OFFERED; });
            return (
                <ModalContainer>
                    <div onClick={this.props.toggleModal} id='modalClose'>
                        <img src='img/modal-close.svg'/>
                    </div>
                    <h3>Your bid was not accepted.</h3>
                    <h4>{'But there are ' + remainingTickets.length + ' more tasks waiting for you!'}</h4>
                    <button onClick={this.props.toggleModal}>Show tasks</button>
                </ModalContainer>
            );
        } else if (this.props.currentAuction.state == 'ended') {
            return (
                <ModalContainer>
                    <div onClick={this.props.toggleModal} id='modalClose'>
                        <img src='img/modal-close.svg'/>
                    </div>
                    <h3>Your bid was accepted!</h3>
                    <h4>Get started by cloning and running the tests</h4>
                    <div className='infoOrInput cloneInstructions'> $ git clone git@github.com:airpool/ios <br/> $ cd api && python deploy.py && python tests/run.py </div>
                    <button onClick={this.props.toggleModal}>Show task</button>
                </ModalContainer>
            );
        } else { console.log(this.props.currentAuction); throw 'wtf'; }
    }
});

module.exports = AuctionView;
