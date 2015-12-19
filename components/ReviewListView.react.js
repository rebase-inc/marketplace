import React, { Component, PropTypes } from 'react';

import LoadingAnimation from './LoadingAnimation.react';
import NoReviewsView from './NoReviewsView.react';
import SortOptions from './SortOptions.react';
import SearchBar from './SearchBar.react';
import Review from './Review.react';

export default class ReviewListView extends Component {
    static propTypes = {
        select: PropTypes.func.isRequired,
        reviews: PropTypes.array.isRequired,
        loading: PropTypes.bool.isRequired,
        role: PropTypes.object.isRequired,
        selectView: PropTypes.func.isRequired,
    }
    constructor(props, context) {
        super(props, context);
        this.state = { searchText: '', sort: SortFunctions.get('ending soon') };
    }
    render() {
        const { select, reviews, loading, role, selectView } = this.props;
        const { searchText, sort } = this.state;
        const searchResults = !!searchText ? searchReviews(reviews, searchText) : reviews.map(r => r.id);
        const sortedReviews = reviews.sort(sort).filter(a => searchResults.find(id => id == a.id));
        if (!sortedReviews.length && loading) { return <LoadingAnimation />; }
        if (!sortedReviews.length) { return <NoReviewsView role={role} selectView={selectView} /> }
        return (
            <div className='listView'>
                <div className='title'>{'All Completed Work'}</div>
                <SearchBar placeholder='Search finished work' searchText={searchText} onUserInput={(input) => this.setState({ searchText: input })}>
                    {/*<SortOptions options={SortFunctions} select={(fn) => this.setState({ sort: fn })} sort={sort} />*/}
                </SearchBar>
                <div className='contentList'>
                    { sortedReviews.map(r => <Review review={r} role={role} select={() => select(r.id)} key={r.id} />) }
                </div>
            </div>
        );
    }
}

function searchReviews(reviews, searchText) {
    var fuseSearch = new Fuse(reviews, {threshold: 0.35, keys: ['ticket.title', 'ticket.project.name', 'ticket.project.organization.name'], id: 'id'});
    return fuseSearch.search(searchText.substring(0, 32));
}

const SortFunctions = new Map([
    ['new', (a, b) => new Date(b.created) - new Date(a.created) ],
    ['old', (a, b) => new Date(a.created) - new Date(b.created) ],
    ['good review', (a, b) => parseInt(a.rating) - parseInt(b.rating) ],
    ['bad review', (a, b) => parseInt(b.rating) - parseInt(a.rating) ],
]);
