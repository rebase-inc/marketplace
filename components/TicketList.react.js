import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

import LoadingAnimation from './LoadingAnimation.react';
import Ticket from './Ticket.react';

import Fuse from '../utils/Fuse';
import { handleScrollShadows } from '../utils/Style';

function searchTickets(tickets, searchText) {
    var fuseSearch = new Fuse(tickets, {threshold: 0.35, keys: ['title', 'skillsRequired', 'project.name', 'project.organization.name'], id: 'id'});
    return fuseSearch.search(searchText.substring(0, 32));
}

export default class TicketList extends Component {
    static propTypes = {
        tickets: PropTypes.array.isRequired,
    }
    render() {
        const { tickets } = this.props;
        let searchResults = !!this.props.searchText ? searchTickets(tickets, this.props.searchText) : tickets.map(t => t.id);
        return (
            <table className='contentList'>
                <tbody ref='tableBody'>
                    { tickets.filter(t => searchResults.indexOf(t.id) != -1).map(t => <Ticket ticket={t} key={t.id} />) }
                    { this.props.loading ? <LoadingAnimation /> : null }
                </tbody>
            </table>
        );
    }
};
