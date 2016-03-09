import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import ListView from './ListView.react';
import { selectReview } from '../actions/ReviewActions';
import Review from './Review.react';
import { searchReviews } from '../utils/search';
import { getReviewTicket } from '../utils/getters';


export class ReviewListView extends ListView {
    constructor(props, context) {
        super(props, context);
        this.getTicket = getReviewTicket;
        this.Item = Review;
    }
}

let mapStateToProps = function (state) {
    const _reviews = state.reviews.items.toList().toJS();
    return {
        items: _reviews,
        loading: state.reviews.isFetching,
        search: searchReviews(_reviews),
    };
}

let mapDispatchToProps = dispatch => ({ selectView: bindActionCreators(selectReview, dispatch)});
export default connect(mapStateToProps, mapDispatchToProps)(ReviewListView);
