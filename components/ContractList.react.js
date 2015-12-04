import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

import LoadingAnimation from './LoadingAnimation.react';
import Contract from './Contract.react';

import Fuse from '../utils/Fuse';
import { getContractTicket } from '../utils/getters';

function searchContracts(contracts, searchText) {
    contracts = contracts.map(c => { ticket: getContractTicket(c) });
    var fuseSearch = new Fuse(contracts, {threshold: 0.35, keys: ['ticket.title', 'ticket.skillsRequired', 'ticket.project.name', 'ticket.project.organization.name'], id: 'id'});
    return fuseSearch.search(searchText.substring(0, 32));
}

export default class ContractList extends Component {
    static propTypes = {
        contracts: PropTypes.array.isRequired,
        select: PropTypes.func.isRequired,
        searchText: PropTypes.string.isRequired,
        sort: PropTypes.func.isRequired,
        role: PropTypes.object.isRequired,
    }

    render() {
        const { contracts, loading, select, searchText, sort, role } = this.props;
        if (!contracts.length && loading) {
            return <LoadingAnimation />;
        } else {
            const searchResults = !!searchText ? searchContracts(contracts, searchText) : contracts.map(c => c.id);
            const sortedContracts = contracts.sort(sort).filter(c => searchResults.find(id => id == c.id));
            return (
                <table className='contentList'>
                    <tbody ref='tableBody'>
                        { sortedContracts.map(c => <Contract contract={c} role={role} select={() => select(c.id)} key={c.id} />) }
                    </tbody>
                </table>
            );
        }
    }
};
