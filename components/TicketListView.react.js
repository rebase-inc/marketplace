import React, { Component, PropTypes } from 'react';

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
        this.state = { searchText: '', sort: SortFunctions.get('newest') };
    }
    render() {
        const { select, ticket, tickets, loading, role } = this.props;
        const { searchText, sort } = this.state;
        const searchResults = !!searchText ? searchTickets(tickets, searchText) : tickets.map(t => t.id);
        const sortedTickets = tickets.sort(sort).filter(t => searchResults.find(id => id == t.id));
        if (!sortedTickets.length && loading) { return <LoadingAnimation />; }
        if (!sortedTickets.length) { return <NoTicketsView role={role} />; }
        return (
            <div className='listView'>
                <SearchBar searchText={searchText} onUserInput={(input) => this.setState({ searchText: input })}>
                    {/*<PlusIcon onClick={actions.openNewTicketModal} text={'Add ticket'} />*/}
                    {/*<SortOptions options={SortFunctions} select={(fn) => this.setState({ sort: fn })} sort={sort} />*/}
                </SearchBar>
                <div className='contentList'>
                    { sortedTickets.map(t => <Ticket ticket={t} selected={ticket.id == t.id} select={() => select(t.id)} key={t.id} />) }
                </div>
            </div>
        );
    }

}

const SortFunctions = new Map([
    ['newest', (a, b) => new Date(b.created) - new Date(a.created)],
    ['oldest', (a, b) => new Date(a.created) - new Date(b.created)],
    ['most comments', (a, b) => b.comments.length - a.comments.length],
    ['fewest comments', (a, b) => a.comments.length - b.comments.length],
]);

