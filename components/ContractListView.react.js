import React, { Component, PropTypes } from 'react';

import LoadingAnimation from './LoadingAnimation.react';
import NoContractsView from './NoContractsView.react';
import SortOptions from './SortOptions.react';
import SearchBar from './SearchBar.react';
import Contract from './Contract.react';

export default class ContractListView extends Component {
    static propTypes = {
        select: PropTypes.func.isRequired,
        contracts: PropTypes.array.isRequired,
        loading: PropTypes.bool.isRequired,
        role: PropTypes.object.isRequired,
        selectView: PropTypes.func.isRequired,
    }
    constructor(props, context) {
        super(props, context);
        this.state = { searchText: '', sort: SortFunctions.get('ending soon') };
    }
    render() {
        const { select, contracts, loading, role, selectView } = this.props;
        const { searchText, sort } = this.state;
        const searchResults = !!searchText ? searchContracts(contracts, searchText) : contracts.map(a => a.id);
        const sortedContracts = contracts.sort(sort).filter(a => searchResults.find(id => id == a.id));
        if (!sortedContracts.length && loading) { return <LoadingAnimation />; }
        if (!sortedContracts.length) { return <NoContractsView role={role} selectView={selectView} /> }
        return (
            <div className='contentView'>
                <SearchBar searchText={searchText} onUserInput={(input) => this.setState({ searchText: input })}>
                    <SortOptions options={SortFunctions} select={(fn) => this.setState({ sort: fn })} sort={sort} />
                </SearchBar>
                <table className='contentList'>
                    <tbody ref='tableBody'>
                        { sortedContracts.map(c => <Contract contract={c} role={role} select={() => select(c.id)} key={c.id} />) }
                    </tbody>
                </table>
            </div>
        );
    }
}

function searchContracts(contracts, searchText) {
    contracts = contracts.map(c => { ticket: getContractTicket(c) });
    var fuseSearch = new Fuse(contracts, {threshold: 0.35, keys: ['ticket.title', 'ticket.skillsRequired', 'ticket.project.name', 'ticket.project.organization.name'], id: 'id'});
    return fuseSearch.search(searchText.substring(0, 32));
}

const SortFunctions = new Map([
    ['finishing soon', (a, b) => new Date(a.bid.auction.finish_work_by) - new Date(b.bid.auction.finish_work_by) ],
    ['time left', (a, b) => new Date(b.bid.auction.finish_work_by) - new Date(a.bid.auction.finish_work_by) ],
    ['blocked', (a, b) => b.bid.work_offers[0].work.state == 'blocked' ],
    ['in review', (a, b) => b.bid.work_offers[0].work.state == 'in_review' ],
    ['in progress', (a, b) => b.bid.work_offers[0].work.state == 'in_progress' ],
    //['recent comments', (a, b) => a.work.comments[0] != b.work.state ], // TODO: Implement once work comments are working
]);
