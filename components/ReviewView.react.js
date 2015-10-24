// External
var React = require('react');
var _ = require('underscore');

// Constants
var ViewTypes = require('../constants/ViewConstants').ViewTypes;

// Stores
var ReviewStore = require('../stores/ReviewStore');

// Actions
var ReviewActions = require('../actions/ReviewActions');
let UserActions = require('../actions/UserActions');

// Components
var SearchBar = require('../components/SearchBar.react');
var TicketHeader = require('../components/TicketHeader.react');
var CommentList = require('../components/CommentList.react');
var CommentBox = require('../components/CommentBox.react');
var NothingHere = require('../components/NothingHere.react');
var LoadingAnimation = require('../components/LoadingAnimation.react');
var TicketDetails = require('../components/TicketDetails.react');
var RatingStars = require('../components/RatingStars.react');
var ProjectInfoPanel = require('../components/ProjectInfoPanel.react');

// Constants
var viewConstants = require('../constants/viewConstants');

// Icons
var Icons = require('../components/Icons.react');

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
    handleUserInput: function(searchText) {
        this.setState({ searchText: searchText });
    },
    render: function() {
        if (!this.state.allReviews.length && !this.state.loading) {
            return (
                <NothingHere>
                    <h3>You don't have any completed tickets</h3>
                    <button onClick={UserActions.selectView.bind(null, ViewTypes.IN_PROGRESS)}>View In Progress Tickets</button>
                </NothingHere>
            );
        }
        switch (!!this.state.currentReview) {
            case true:
                return <SingleReviewView {...this.props} {...this.state} unselectReview={this.selectReview.bind(null, null)} />;
                break;
            case false:
                var props = _.extend({ selectReview: this.selectReview }, this.state, this.props);
                return (
                    <div className='reviewView'>
                        <SearchBar searchText={this.state.searchText} onUserInput={this.handleUserInput}/>
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
    getInitialState: () => ({ modalOpen: false, showDetails: false }),
    toggleDetails: function(state) {
        typeof(state) === 'boolean' ? this.setState({ showDetails: state }) : this.setState({ showDetails: !this.state.showDetails });
    },
    render: function() {
        var ticket = this.props.currentReview.work.offer.ticket_snapshot.ticket;
        var makeButton = function(props) {
            return <button onClick={props.onClick} className={props.className}>{props.text}</button>;
        }
        this.props.currentReview.date = !!this.props.currentReview.date ? this.props.currentReview.date : 'August 12, 2015'; // temp hack
        return (
            <div className='reviewView'>
                <TicketHeader goBack={this.props.unselectReview} title={ticket.title} toggleDetails={this.toggleDetails} className='completed' />
                <TicketDetails hidden={!this.state.showDetails} ticket={ticket} />
                <CommentList style={{height: 'calc(100% - 230px)'}} comments={ticket.comments}/>
                <CommentBox ticket={ticket} user={this.props.currentUser} />
            </div>
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
        let props = {
            selectReview: this.props.selectReview,
            currentRole: this.props.currentRole,
        }
        if (!!this.props.loadingReviewData) {
            return <div className='contentList'><LoadingAnimation /></div>;
        }
        let titleMatchesText = function(review) {
            return true; // until we make this actually work
            return review.title.indexOf(this.props.searchText) != -1;
        }.bind(this);
        let makeTicketElement = function(review) {
            return <Review review={review} key={review.id} {...props} />;
        }.bind(props);
        return (
            <table className='contentList'>
                <tbody>
                    { this.props.allReviews.filter(titleMatchesText).map(makeTicketElement) }
                </tbody>
            </table>
        );
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
                <ProjectInfoPanel ticket={ticket} />
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

module.exports = ReviewView;
