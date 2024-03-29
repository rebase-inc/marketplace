import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as ReviewActions from '../actions/ReviewActions';

import ListTitleBar from './ListTitleBar.react';
import ReviewListView from './ReviewListView.react';
import SingleReviewView from './SingleReviewView.react';
import SortIcon from './SortIcon.react';
import NoReviewsView from './NoReviewsView.react';

import { NEWEST_REVIEWS, OLDEST_REVIEWS } from '../utils/sort';

export default class ReviewView extends Component {
    static propTypes = {
        user: PropTypes.object.isRequired,
        role: PropTypes.object.isRequired,
    }
    constructor(props, context) {
        super(props, context);
        this.componentWillMount = this.componentWillMount.bind(this);
        this.componentDidUpdate = this.componentDidUpdate.bind(this);
        this.state = { sort: NEWEST_REVIEWS };
    }
    componentWillMount() {
        this.props.actions.getReviews()
    }
    componentDidUpdate(prevProps) {
        if (prevProps.user.current_role.id != this.props.user.current_role.id) {
            this.props.actions.getReviews()
        }
    }
    render() {
        const { actions, reviews, review, role, user } = this.props;
        if (!reviews.length) { return <NoReviewsView {...this.props} /> }
        return (
            <div className='mainView'>
                <div className='listView noselect'>
                    <ListTitleBar title={'All Past Work'}>
                        <SortIcon onClick={() => this.setState((s) => ({ sort: s.sort == NEWEST_REVIEWS ? OLDEST_REVIEWS : NEWEST_REVIEWS }))}/>
                    </ListTitleBar>
                    <ReviewListView
                        selectedId={review ? review.id : 0}
                        role={role}
                        sort={this.state.sort}
                    />
                </div>
                <SingleReviewView review={review} actions={actions} role={role} user={user} />
            </div>
        );
    }
}

let mapStateToProps = state => ({
    reviews: state.reviews.items.toList().toJS(),
    review: state.reviews.items.get(state.reviewID) ? state.reviews.items.get(state.reviewID).toJS() : null,
});
let mapDispatchToProps = dispatch => ({ actions: bindActionCreators(ReviewActions, dispatch)});
export default connect(mapStateToProps, mapDispatchToProps)(ReviewView);
