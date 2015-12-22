import React, { Component, PropTypes } from 'react';

import Fuse from '../utils/Fuse';

import Ticket from './Ticket.react';
import SearchBar from './SearchBar.react';
import SortOptions from './SortOptions.react';
import NoTicketsView from './NoTicketsView.react';
import LoadingAnimation from './LoadingAnimation.react';

export default class TicketListView extends Component {
    static propTypes = {
        select: PropTypes.func.isRequired,
        tickets: PropTypes.array.isRequired,
        loading: PropTypes.bool.isRequired,
    }
    constructor(props, context) {
        super(props, context);
        this.state = { searchText: '', sort: SortFunctions.get('newest'), open: false };
    }
    render() {
        const { select, createTicket, ticket, tickets, loading, role, actions } = this.props;
        const { searchText, sort } = this.state;
        const searchResults = !!searchText ? searchTickets(tickets, searchText) : tickets.map(t => t.id);
        const sortedTickets = tickets.sort(sort).filter(t => searchResults.find(id => id == t.id));
        if (!tickets.length && loading) { return <LoadingAnimation />; }
        if (!tickets.length) { return <NoTicketsView role={role} />; }
        return (
            <div className='listView noselect'>
                <SearchBar searchText={searchText} onChange={(input) => this.setState({ searchText: input })}>
                    {/*<PlusIcon onClick={actions.openNewTicketModal} text={'Add ticket'} />*/}
                </SearchBar>
                <div className='info'>
                    {'All Tickets'}
                    <svg data-selected={this.state.open || undefined } viewBox="0 0 22 14" onClick={() => this.setState({ open: !this.state.open })}>
                        <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                            <rect fill="#EBEDF0" x="0" y="0" width="22" height="14" rx="2"></rect>
                            <path d="M6,5 L11,10 L16,5" stroke="#F8FBFD" stroke-linecap="square"></path>
                        </g>
                    </svg>
                    {this.state.open ?
                        <SortOptions
                            options={SortFunctions}
                            select={(fn) => this.setState({ sort: fn, open: false })}
                            sort={sort} onMouseLeave={() => this.setState({ open: false })}/> : null }
                    {/*<span onClick={createTicket} className='extra'>{'Create New Ticket'}</span>*/}
                </div>
                <div className='contentList'>
                    { sortedTickets.map(t => <Ticket ticket={t} selected={ticket.id == t.id} select={() => select(t.id)} key={t.id} />) }
                </div>
            </div>
        );
    }

}

function searchTickets(tickets, searchText) {
    var fuseSearch = new Fuse(tickets, {threshold: 0.35, keys: ['title', 'skill_requirement.skills', 'project.name', 'project.organization.name'], id: 'id'});
    return fuseSearch.search(searchText.substring(0, 32));
}

const SortFunctions = new Map([
    ['newest', (a, b) => new Date(b.created) - new Date(a.created) || a.title.localeCompare(b.title)],
    ['oldest', (a, b) => new Date(a.created) - new Date(b.created) || a.title.localeCompare(b.title)],
    ['most comments', (a, b) => (b.comments.length - a.comments.length) || new Date(b.created) - new Date(a.created) || a.title.localeCompare(b.title)],
    ['fewest comments', (a, b) => (a.comments.length - b.comments.length) || new Date(b.created) - new Date(a.created) || a.title.localeCompare(b.title)],
]);

