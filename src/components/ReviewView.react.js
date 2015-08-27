// External
var React = require('react');
var _ = require('underscore');

// Stores
var ReviewStore = require('../stores/ReviewStore');

// Actions
var ReviewActions = require('../actions/ReviewActions');

// Components
var SearchBar = require('../components/SearchBar.react');
var SingleTicketView = require('../components/SingleTicketView.react');
var TicketHeader = require('../components/TicketHeader.react');
var CommentList = require('../components/CommentList.react');
var CommentBox = require('../components/CommentBox.react');
var NothingHere = require('../components/NothingHere.react');
var LoadingAnimation = require('../components/LoadingAnimation.react');
var StatusBar = require('../components/StatusBar.react');

// Constants
var viewConstants = require('../constants/viewConstants');

// Icons
var Icons = require('../components/RebaseIcons.react');

var ReviewView = React.createClass({
    propTypes: {
        currentUser: React.PropTypes.object.isRequired,
        currentRole: React.PropTypes.object.isRequired,
    },
    getInitialState: function() {
        return _.extend({ searchText: '' }, ReviewStore.getState());
    },
    componentDidMount: function() {
        ReviewStore.addChangeListener(this._onChange);
        setTimeout(ReviewActions.getReviewData, 0);
    },
    componentWillUnmount: function() {
        ReviewStore.removeChangeListener(this._onChange);
    },
    _onChange: function() {
        this.setState(ReviewStore.getState());
    },
    selectReview: function(reviewID) {
        ReviewActions.selectReview(reviewID);
    },
    // this is probably not how we should be handling the searchText
    //handleUserInput: function(searchText) { this.setState({ searchText: searchText }); },
    render: function() {
        if (!!this.state.currentReview) {
            return <SingleReviewView {...this.props} {...this.state} unselectReview={this.selectReview.bind(null, null)} />;
        } else {
            var props = _.extend({ selectReview: this.selectReview }, this.state, this.props);
            return (
                <div className='mainContent'>
                    <SearchBar searchText={this.state.searchText} onUserInput={this.handleSearchInput}/>
                    <ReviewList {...props} />
                </div>
            );
        }
    }
});

var SingleReviewView = React.createClass({
    propTypes: {
        currentRole: React.PropTypes.object.isRequired,
        currentUser: React.PropTypes.object.isRequired,
        currentReview: React.PropTypes.object.isRequired,
        unselectReview: React.PropTypes.func.isRequired,
    },
    render: function() {
        var ticket = this.props.currentReview.work.offer.ticket_snapshot.ticket;
        var makeButton = function(props) {
            return <button onClick={props.onClick} className={props.className}>{props.text}</button>;
        }
        return (
            <SingleTicketView {...this.props}>
                <StatusBar review={this.props.currentReview} />
                <TicketHeader goBack={this.props.unselectReview} title={ticket.title} />
                <CommentList comments={ticket.comments}/>
                <CommentBox ticket={ticket} user={this.props.currentUser} />
            </SingleTicketView>
        );
    }
});

var ReviewList = React.createClass({
    propTypes: {
        currentUser: React.PropTypes.object.isRequired,
        currentRole: React.PropTypes.object.isRequired,
        selectReview: React.PropTypes.func.isRequired,
    },
    render: function() {
        var props = {
            selectReview: this.props.selectReview,
            currentRole: this.props.currentRole,
        }
        var titleMatchesText = function(review) {
            return true; // until we make this actually work
            return review.title.indexOf(this.props.searchText) != -1;
        }.bind(this);
        var makeTicketElement = function(review) {
            return <Review review={review} key={review.id} {...props} />;
        }.bind(props);
        if (!!this.props.allReviews.length) {
            return (
                <table id='ticketList'>
                    <tbody>
                        { this.props.allReviews.filter(titleMatchesText).map(makeTicketElement) }
                    </tbody>
                </table>
            );
        } else if (this.props.loadingReviewData) {
            return <LoadingAnimation />;
        } else {
            return <NothingHere text={'You don\'t have any in progress work right now. Check out offered tickets to find some!'}/>;
        }
    }
});

var Review = React.createClass({
    propTypes: {
        currentRole: React.PropTypes.object.isRequired,
        review: React.PropTypes.object.isRequired,
        selectReview: React.PropTypes.func.isRequired,
    },
    render: function() {
        var ticket = this.props.review.work.offer.ticket_snapshot.ticket;
        return (
            <tr className='ticket'>
                { this.props.currentRole.type == 'manager' ?
                    <FindTalentPanel ticket={ticket} /> :
                    <ProjectInfoPanel ticket={ticket} /> }
                <td className='titlePanel'>{ticket.title}</td>
                <td className='skillsRequiredPanel'>{ticket.skillsRequired}</td>
                <td className='commentsPanel' onClick={this.props.selectReview.bind(null, this.props.review.id)}>
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

module.exports = ReviewView;

