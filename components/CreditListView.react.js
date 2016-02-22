import React, { Component, PropTypes } from 'react';

import Fuse from '../utils/fuse';
import SearchBar from './SearchBar.react';
import SortOptions from './SortOptions.react';
import LoadingAnimation from './LoadingAnimation.react';
import NothingHere from './NothingHere.react';
import { OFFERED } from '../constants/ViewConstants';

export default class CreditListView extends Component {
    static propTypes = {
        credits: PropTypes.array.isRequired,
        loading: PropTypes.bool.isRequired,
    }
    constructor(props, context) {
        super(props, context);
        this.state = { searchText: '', sort: SortFunctions.get('newest') };
    }
    render() {
        const { credits, loading, role } = this.props;
        const { searchText, sort } = this.state;
        const searchResults = !!searchText ? searchCredits(credits, searchText) : credits.map(t => t.id);
        const sortedCredits = credits.sort(sort).filter(t => searchResults.find(id => id == t.id));
        if (!sortedCredits.length && loading) { return <LoadingAnimation />; }
        if (!searchText && !sortedCredits.length) { return <NoCreditsView selectView={this.props.selectView} />; }
        return (
            <div className='contentView'>
                <SearchBar placeholder='Search credits' searchText={searchText} onUserInput={(input) => this.setState({ searchText: input })}>
                    <SortOptions options={SortFunctions} select={(fn) => this.setState({ sort: fn })} sort={sort} />
                </SearchBar>
                <table className='contentList'>
                    <tbody ref='tableBody'>
                        { sortedCredits.map((c,i) => <Credit key={i} credit={c} />) }
                    </tbody>
                </table>
            </div>
        );
    }

}

const SortFunctions = new Map([
    ['newest', (a, b) => new Date(b.work.review.created) - new Date(a.work.review.created)],
    ['oldest', (a, b) => new Date(a.work.review.created) - new Date(b.work.review.created)],
]);

function searchCredits(credits, searchText) {
    var fuseSearch = new Fuse(
        credits,
        {
            threshold: 0.35,
            keys: [
                'work.offer.ticket_snapshot.ticket.title',
                'work.offer.ticket_snapshot.ticket.project.name',
                'work.offer.ticket_snapshot.ticket.project.organization.name'
            ],
            id: 'id'
        }
    );
    return fuseSearch.search(searchText.substring(0, 32));
}

class Credit extends Component {
    static propTypes = {
        credit: PropTypes.object.isRequired,
    }
    render() {
        const { credit } = this.props;
        return (
            <tr className='credit' >
            </tr>
        );
    }
};

class NoCreditsView extends Component {
    static propTypes = {
        selectView: PropTypes.func.isRequired
    }
    render() {
        return (
            <NothingHere>
                <h3>Your Credits</h3>
                <h4>Every time you have completed work, a new credit line will appear here.</h4>
                <div>
                    <button onClick={ ()=>this.props.selectView(OFFERED) }>Find work</button>
                </div>
            </NothingHere>
        );
    }
}
