import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as ReviewActions from '../actions/ReviewActions';
import LoadingAnimation from './LoadingAnimation.react';
import NoReviewsView from './NoReviewsView.react';
import SearchBar from './SearchBar.react';
import Review from './Review.react';
import { searchReviews } from '../utils/search';
import { getReviewTicket } from '../utils/getters';

export default class ReviewListView extends Component {
    static propTypes = {
        actions: PropTypes.object.isRequired,
        review: PropTypes.object,
        reviews: PropTypes.array.isRequired,
        role: PropTypes.object.isRequired,
        search: PropTypes.func.isRequired,
        sort: PropTypes.func.isRequired,
    }
    constructor(props, context) {
        super(props, context);
        this.state = { searchText: '' };
    }
    render() {
        const { actions, loading, review, reviews, role, search, select } = this.props;
        const { searchText, sort } = this.state;
        const searchResults = !!searchText ? search(searchText) : reviews.map(r => getReviewTicket(r).id);
        const filteredReviews = reviews.sort(sort).filter(a => searchResults.indexOf(getReviewTicket(a).id) != -1);
        if (!filteredReviews.length && loading) { return <LoadingAnimation />; }
        if (!filteredReviews.length) { return <NoReviewsView role={role} selectView={actions.selectReview} /> }
        return (
            <div className='listView'>
                <SearchBar placeholder='Search finished work' searchText={searchText} onChange={(input) => this.setState({ searchText: input })} />
                <div className='contentList'>
                    { filteredReviews.map(
                        function (r) {
                            return <Review 
                                {...r}
                                key={r.id}
                                handleClick={actions.selectReview.bind(null, r.id)}
                                selected={review ? r.id == review.id : false}
                            />;
                        })
                    }
                </div>
            </div>
        );
    }
}


let mapStateToProps = function (state) {
    const _reviews = state.reviews.items.toList().toJS();
    return {
        loading: state.reviews.isFetching,
        reviews: _reviews,
        search: searchReviews(_reviews),
    };
}

let mapDispatchToProps = dispatch => ({ actions: bindActionCreators(ReviewActions, dispatch)});
export default connect(mapStateToProps, mapDispatchToProps)(ReviewListView);
