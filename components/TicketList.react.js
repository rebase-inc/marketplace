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
        loading: PropTypes.bool.isRequired,
        searchText: PropTypes.string.isRequired,
    }

    render() {
        const { tickets, select, loading } = this.props;
        let searchResults = !!this.props.searchText ? searchTickets(tickets, this.props.searchText) : tickets.map(t => t.id);
        if (loading && !tickets.length) { return <LoadingAnimation />; }
        return (
            <table className='contentList'>
                <tbody ref='tableBody'>
                    { tickets.filter(t => searchResults.indexOf(t.id) != -1).map(t =>
                         <Ticket ticket={t} select={select.bind(null, t.id)} key={t.id} />) }
                </tbody>
            </table>
        );
    }
};
