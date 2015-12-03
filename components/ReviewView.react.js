import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as ReviewActions from '../actions/ReviewActions';

import SearchBar from './SearchBar.react';
import SingleReviewView from './SingleReviewView.react';
import ReviewList from './ReviewList.react';
import NothingHere from './NothingHere.react';
import SortOptions from './SortOptions.react';

const SortFunctions = new Map([
    ['new', (a, b) => new Date(b.created) - new Date(a.created) ],
    ['old', (a, b) => new Date(a.created) - new Date(b.created) ],
    ['good review', (a, b) => parseInt(a.rating) - parseInt(b.rating) ],
    ['bad review', (a, b) => parseInt(b.rating) - parseInt(a.rating) ],
]);

export default class ReviewView extends Component {
    static propTypes = {
        user: React.PropTypes.object.isRequired,
        roles: React.PropTypes.object.isRequired,
    }
    constructor(props, context) {
        super(props, context);
        this.state = { searchText: '', sort: SortFunctions.get('new') };

        this.handleUserInput = this.handleUserInput.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.componentDidUpdate = this.componentDidUpdate.bind(this);
    }
    componentDidMount() {
        this.props.actions.getReviews()
    }
    componentDidUpdate(prevProps) {
        if (prevProps.user.current_role.id != this.props.user.current_role.id) {
            this.props.actions.getReviews()
        }
    }
    handleUserInput(searchText) {
        this.setState({ searchText: searchText });
    }
    render() {
        const { review, reviews, user, roles, actions } = this.props;
        if (!reviews.items.size && !reviews.isFetching) {
            return (
                <NothingHere>
                    <h3>You don't have any completed tickets</h3>
                    <button>View In Progress Tickets</button>
                </NothingHere>
            );
        }

        if (!!review.id) {
            return <SingleReviewView
                review={reviews.items.get(review.id)}
                unselect={() => actions.selectReview(null)}
                submitComment={actions.commentOnReview.bind(null, user, reviews.items.get(review.id))}
                user={user} roles={roles}/>;
        } else {
            return (
                <div className='contentView'>
                    <SearchBar placeholder='Search finished work' searchText={this.state.searchText} onUserInput={this.handleUserInput}>
                        <SortOptions options={SortFunctions} select={(fn) => this.setState({ sort: fn })} sort={this.state.sort} />
                    </SearchBar>
                    <ReviewList sort={this.state.sort} searchText={this.state.searchText} select={actions.selectReview} user={user} roles={roles} reviews={Array.from(reviews.items.values())} loading={reviews.isFetching} />
                </div>
            );
        }
    }
};

let mapStateToProps = state => ({ reviews: state.reviews, review: state.review });
let mapDispatchToProps = dispatch => ({ actions: bindActionCreators(ReviewActions, dispatch)});
export default connect(mapStateToProps, mapDispatchToProps)(ReviewView);
