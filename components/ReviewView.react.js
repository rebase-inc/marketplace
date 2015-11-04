import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as ReviewActions from '../actions/ReviewActions';

import SearchBar from './SearchBar.react';
import SingleReviewView from './SingleReviewView.react';
import ReviewList from './ReviewList.react';
import NothingHere from './NothingHere.react';

export default class ReviewView extends Component {
    static propTypes = {
        user: React.PropTypes.object.isRequired,
        roles: React.PropTypes.object.isRequired,
    }
    constructor(props, context) {
        super(props, context);
        this.state = { searchText: '' };

        this.handleUserInput = this.handleUserInput.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
    }
    componentDidMount() {
        this.props.actions.getReviews()
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
                user={user} roles={roles}/>;
        } else {
            return (
                <div className='contentView'>
                    <SearchBar placeholder='Search finished work' searchText={this.state.searchText} onUserInput={this.handleUserInput} />
                    <ReviewList select={actions.selectReview} user={user} roles={roles} reviews={Array.from(reviews.items.values())} />
                </div>
            );
        }
    }
};

let mapStateToProps = state => ({ reviews: state.reviews, review: state.review });
let mapDispatchToProps = dispatch => ({ actions: bindActionCreators(ReviewActions, dispatch)});
export default connect(mapStateToProps, mapDispatchToProps)(ReviewView);
