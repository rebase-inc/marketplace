import React, { Component, PropTypes } from 'react';

import Fuse from '../utils/Fuse';

import LoadingAnimation from './LoadingAnimation.react';
import NoAuctionsView from './NoAuctionsView.react';
import DropdownIcon from './DropdownIcon.react';
import SortOptions from './SortOptions.react';
import SearchBar from './SearchBar.react';
import Auction from './Auction.react';

import { getAuctionTicket } from '../utils/getters';

export default class AuctionListView extends Component {
    static propTypes = {
        select: PropTypes.func.isRequired,
        auctions: PropTypes.array.isRequired,
        auction: PropTypes.object.isRequired,
        loading: PropTypes.bool.isRequired,
        role: PropTypes.object.isRequired,
        selectView: PropTypes.func.isRequired,
    }
    constructor(props, context) {
        super(props, context);
        this.state = { searchText: '', sort: SortFunctions.get('ending soon') };
    }
    render() {
        const { select, auction, auctions, loading, role, selectView } = this.props;
        const { searchText, sort } = this.state;
        let sortedAuctions = auctions.filter(_shouldBeVisible.bind(null, role)).sort(sort);
        const searchResults = !!searchText ? searchAuctions(sortedAuctions, searchText) : sortedAuctions.map(a => a.id);
        if (!sortedAuctions.length && loading) { return <LoadingAnimation />; }
        if (!sortedAuctions.length) { return <NoAuctionsView role={role} selectView={selectView} /> }
        sortedAuctions = sortedAuctions.filter(a => searchResults.find(id => id == a.id));
        const sortFunctions = new Map([...SortFunctions, ...(role.type == 'manager' ? ManagerSortFunctions : DeveloperSortFunctions)]);
        return (
            <div className='listView'>
                <SearchBar searchText={searchText} onChange={(input) => this.setState({ searchText: input })}>
                </SearchBar>
                <div className='info'>
                    { role.type == 'manager' ? 'All Auctions' : 'All Offers' }
                    <DropdownIcon open={this.state.open} onClick={() => this.setState({ open: !this.state.open })} />
                    {this.state.open ?
                        <SortOptions
                            options={sortFunctions}
                            select={(fn) => this.setState({ sort: fn, open: false })}
                            sort={sort} onMouseLeave={() => this.setState({ open: false })}/> : null }
                </div>
                <div className='contentList'>
                    { sortedAuctions.map(a => <Auction auction={a} selected={auction.id == a.id} role={role} select={() => select(a.id)} key={a.id} />) }
                </div>
            </div>
        );
    }
}

function searchAuctions(auctions, searchText) {
    auctions = auctions.map(a => ({ ticket: getAuctionTicket(a), id: a.id }));
    var fuseSearch = new Fuse(auctions, {threshold: 0.35, keys: ['ticket.title', 'ticket.project.name', 'ticket.project.organization.name'], id: 'id'});
    return fuseSearch.search(searchText.substring(0, 32));
}

// Hack
function _shouldBeVisible(role, auction) {
    return (role.type == 'manager' || !auction.bids.find(a => a.contractor.id == role.id));
}

const SortFunctions = new Map([
    ['ending soon', (a, b) => new Date(a.expires) - new Date(b.expires) ],
    ['time left', (a, b) => new Date(b.expires) - new Date(a.expires) ],
]);

const unapproved = (auction) => auction.ticket_set.nominations.filter(n => !auction.approved_talents.find(t => t.contractor.id == n.contractor.id)).length;
const ManagerSortFunctions = new Map([
    ['unapproved developers', (a, b) => unapproved(b) - unapproved(a)],
    ['big budget', (a, b) => parseInt(b.ticket_set.bid_limits[0].price) - parseInt(a.ticket_set.bid_limits[0].price)],
    ['small budget', (a, b) => parseInt(a.ticket_set.bid_limits[0].price) - parseInt(b.ticket_set.bid_limits[0].price)],
]);
const DeveloperSortFunctions = new Map([
    ['highest rated', (a,b) => a.ticket.project.organization.rating - b.ticket.project.organzation.rating],
]);
