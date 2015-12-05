import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as ReviewActions from '../actions/ReviewActions';

import SingleReviewView from './SingleReviewView.react';
import ReviewListView from './ReviewListView.react';

export default class ReviewView extends Component {
    static propTypes = {
        user: PropTypes.object.isRequired,
        role: PropTypes.object.isRequired,
    }
    constructor(props, context) {
        super(props, context);

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
    render() {
        const { reviewID, reviews, user, role, actions, selectView } = this.props;
        if (reviewID) {
            return <SingleReviewView review={reviews.items.get(reviewID).toJS()} actions={actions} role={role} user={user} />;
        } else {
            return <ReviewListView role={role} select={actions.selectReview} selectView={selectView} reviews={reviews.items.toList().toJS()} loading={reviews.isFetching} />;
        }
    }
}

let mapStateToProps = state => ({ reviews: state.reviews, reviewID: state.reviewID });
let mapDispatchToProps = dispatch => ({ actions: bindActionCreators(ReviewActions, dispatch)});
export default connect(mapStateToProps, mapDispatchToProps)(ReviewView);
