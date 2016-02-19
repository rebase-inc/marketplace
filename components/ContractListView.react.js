import React, { Component, PropTypes } from 'react';

import LoadingAnimation from './LoadingAnimation.react';
import NoContractsView from './NoContractsView.react';
import SortOptions from './SortOptions.react';
import SearchBar from './SearchBar.react';
import Contract from './Contract.react';

import Fuse from '../utils/fuse';

import { getContractTicket } from '../utils/getters';

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
        const { select, contracts, loading, role, selectView, contract } = this.props;
        const { searchText, sort } = this.state;
        const searchResults = !!searchText ? searchContracts(contracts, searchText) : contracts.map(a => a.id);
        const sortedContracts = contracts.sort(sort).filter(a => searchResults.find(id => id == a.id));
        if (!sortedContracts.length && loading) { return <LoadingAnimation />; }
        if (!sortedContracts.length) { return <NoContractsView role={role} selectView={selectView} /> }
        return (
            <div className='listView'>
                <SearchBar text={searchText} onChange={(input) => this.setState({ searchText: input })}>
                {/*<SortOptions options={SortFunctions} select={(fn) => this.setState({ sort: fn })} sort={sort} />*/}
                </SearchBar>
                <div className='info'>
                    {'All Ongoing Work'}
                </div>
                <div className='contentList'>
                    { sortedContracts.map(c => <Contract contract={c} selected={contract.id == c.id} role={role} select={() => select(c.id)} key={c.id} />) }
                </div>
            </div>
        );
    }
}
