import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as ReviewActions from '../actions/ReviewActions';

import SingleReviewView from './SingleReviewView.react';
import NoReviewsView from './NoReviewsView.react';
import ListTitleBar from './ListTitleBar.react';
import Review from './Review.react';
import SortIcon from './SortIcon.react';
import SearchBar from './SearchBar.react';

import { NEWEST, OLDEST } from '../utils/sort';

export default class ReviewView extends Component {
    static propTypes = {
        user: PropTypes.object.isRequired,
        role: PropTypes.object.isRequired,
        reviews: PropTypes.array.isRequired,
    }
    constructor(props, context) {
        super(props, context);
        this.componentWillMount = this.componentWillMount.bind(this);
        this.componentDidUpdate = this.componentDidUpdate.bind(this);
        this.state = { sort: NEWEST };
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
        const { review, reviews, searchText, updateSearchText, user, role, actions, selectView } = this.props;
        if (!reviews.length) { return <NoReviewsView {...this.props} /> }
        return (
            <div className='mainView'>
                <div className='listView noselect'>
                    <ListTitleBar title={'All Past Work'}>
                        <SortIcon onClick={() => this.setState((s) => ({ sort: s.sort == NEWEST ? OLDEST : NEWEST }))}/>
                    </ListTitleBar>
                    <div className='scrollable'>
                        <SearchBar searchText={searchText} onChange={updateSearchText} />
                        { reviews.sort(this.state.sort).map(r => <Review {...r} handleClick={actions.selectReview.bind(null, r.id)} selected={review ? r.id == review.id : false} />) }
                    </div>
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
