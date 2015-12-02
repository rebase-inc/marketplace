import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

import LoadingAnimation from './LoadingAnimation.react';
import Contract from './Contract.react';

import Fuse from '../utils/Fuse';

function searchContracts(contracts, searchText) {
    var fuseSearch = new Fuse(contracts, {threshold: 0.35, keys: ['ticket.title', 'ticket.skillsRequired', 'ticket.project.name', 'ticket.project.organization.name'], id: 'id'});
    return fuseSearch.search(searchText.substring(0, 32));
}

export default class ContractList extends Component {
    static propTypes = {
        role: PropTypes.object.isRequired,
        select: PropTypes.func.isRequired,
        contracts: PropTypes.array.isRequired,
    }
    render() {
        const { contracts, select, loading, role } = this.props;
        let searchResults = !!this.props.searchText ? searchContracts(contracts, this.props.searchText) : contracts.map(c => c.id);
        if (loading && !contracts.length) { return <LoadingAnimation />; }

        return (
            <table className='contentList'>
                <tbody ref='tableBody'>
                    { contracts.filter(c => searchResults.indexOf(c.id) != -1).map(c =>
                        <Contract contract={c} role={role} select={select.bind(null, c.id)} key={c.id} />) }
                </tbody>
            </table>
        );
    }
}
