import React, { Component, PropTypes } from 'react';

import Fuse from '../utils/fuse';
import NothingHere from './NothingHere.react';
import SearchBar from './SearchBar.react';
import SortOptions from './SortOptions.react';
import LoadingAnimation from './LoadingAnimation.react';
import DatePanel from './DatePanel.react';
import TitlePanel from './TitlePanel.react';
import PricePanel from './PricePanel.react';
import PaidPanel from './PaidPanel.react';
import ProjectPanel from './ProjectPanel.react';
import OrganizationPanel from './OrganizationPanel.react';
import { NEW } from '../constants/ViewConstants';

export default class DebitListView extends Component {
    static propTypes = {
        debits: PropTypes.array.isRequired,
        loading: PropTypes.bool.isRequired,
        selectView: PropTypes.func.isRequired
    }
    constructor(props, context) {
        super(props, context);
        this.state = { searchText: '', sort: SortFunctions.get('newest') };
    }
    render() {
        const { debits, loading, role } = this.props;
        const { searchText, sort } = this.state;
        const searchResults = !!searchText ? searchDebits(debits, searchText) : debits.map(t => t.id);
        const sortedDebits = debits.sort(sort).filter(t => searchResults.find(id => id == t.id));
        if (!sortedDebits.length && loading) { return <LoadingAnimation />; }
        if (!searchText && !sortedDebits.length) { return <NoDebitsView role={role} selectView={this.props.selectView}/>; }
        return (
            <div className='contentView'>
                <SearchBar placeholder='Search debits' searchText={searchText} onUserInput={(input) => this.setState({ searchText: input })}>
                    <SortOptions options={SortFunctions} select={(fn) => this.setState({ sort: fn })} sort={sort} />
                </SearchBar>
                <table className='contentList'>
                    <tbody ref='tableBody'>
                        { sortedDebits.map((d,i) => <Debit key={i} debit={d} />) }
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

function searchDebits(debits, searchText) {
    var fuseSearch = new Fuse(
        debits,
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

class NoDebitsView extends Component {
    static propTypes = {
        selectView: PropTypes.func.isRequired
    }
    render() {
        return (
            <NothingHere>
                <h3>Your Debits</h3>
                <h4>Every time a contractor has completed work for one of your projects, a new debit line will appear here.</h4>
                <div>
                    <button onClick={ ()=>this.props.selectView(NEW) }>Auction some work off</button>
                </div>
            </NothingHere>
        );
    }
}

class Debit extends Component {
    static propTypes = {
        debit: PropTypes.object.isRequired,
    }
    render() {
        const { debit } = this.props;
        return (
            <tr className='debit' >
                <DatePanel text={'Created'} date={debit.work.review.created} />
                <TitlePanel title={debit.work.offer.ticket_snapshot.ticket.title} />
                <ProjectPanel project={debit.work.offer.ticket_snapshot.ticket.project.name} />
                <OrganizationPanel organization={debit.work.offer.ticket_snapshot.ticket.project.organization.name} />
                <PricePanel price={debit.price} />
                <PaidPanel paid={debit.paid} />
            </tr>
        );
    }
};
