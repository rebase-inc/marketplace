import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

import Ticket from './Ticket.react';
import LoadingAnimation from './LoadingAnimation.react';

import Fuse from '../utils/Fuse';

function searchTickets(tickets, searchText) {
    var fuseSearch = new Fuse(tickets, {threshold: 0.35, keys: ['title', 'skill_requirement.skills', 'project.name', 'project.organization.name'], id: 'id'});
    return fuseSearch.search(searchText.substring(0, 32));
}

export default class TicketList extends Component {
    static propTypes = {
        tickets: PropTypes.array.isRequired,
        select: PropTypes.func.isRequired,
        searchText: PropTypes.string.isRequired,
        sort: PropTypes.func.isRequired,
    }

    render() {
        const { tickets, loading, select, searchText, sort } = this.props;
        if (!tickets.size && loading) {
            return <LoadingAnimation />;
        } else {
            const searchResults = !!searchText ? searchTickets(tickets, searchText) : tickets.map(t => t.id);
            const sortedTickets = tickets.sort(sort).filter(t => searchResults.find(id => id == t.id));
            return (
                <table className='contentList'>
                    <tbody ref='tableBody'>
                        { sortedTickets.map(t => <Ticket ticket={t} select={() => select(t.id)} key={t.id} />) }
                    </tbody>
                </table>
            );
        }
    }
};
