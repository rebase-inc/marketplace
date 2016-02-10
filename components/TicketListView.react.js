import React, { Component, PropTypes } from 'react';

import Fuse from '../utils/fuse';

import Ticket from './Ticket.react';
import SearchBar from './SearchBar.react';
import SortOptions from './SortOptions.react';
import DropdownIcon from './DropdownIcon.react';
import NoTicketsView from './NoTicketsView.react';
import LoadingAnimation from './LoadingAnimation.react';

import Tooltip from 'rc-tooltip';

import * as WalkthroughConstants from '../constants/WalkthroughConstants';
import WalkthroughStep from './WalkthroughStep.react';

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
        const { select, createTicket, ticket, tickets, loading, role, actions, walkthrough, walkthroughActions } = this.props;
        const { searchText, sort } = this.state;
        const searchResults = !!searchText ? searchTickets(tickets, searchText) : tickets.map(t => t.id);
        const sortedTickets = tickets.sort(sort).filter(t => searchResults.find(id => id == t.id));
        const tooltipVisible = walkthrough.steps[walkthrough.current] == WalkthroughConstants.CURRENT_VIEW;
        const walkthroughProps = {
            title: 'You don\'t have any offered tickets',
            description: 'You can either check back in a few hours, or try out a sample piece of work for a $20 credit.',
            ...walkthroughActions
        };

        if (!tickets.length && loading) { return <LoadingAnimation />; }
        if (!tickets.length) { return <NoTicketsView role={role} />; }
        return (
            <div className='listView noselect'>
                <SearchBar searchText={searchText} onChange={(input) => this.setState({ searchText: input })}>
                    {/*<PlusIcon onClick={actions.openNewTicketModal} text={'Add ticket'} />*/}
                </SearchBar>
                <div className='info'>
                    {'All Tickets'}
                    <DropdownIcon open={this.state.open} onClick={() => this.setState({ open: !this.state.open })} />
                    {this.state.open ?
                        <SortOptions
                            options={SortFunctions}
                            select={(fn) => this.setState({ sort: fn, open: false })}
                            sort={sort} onMouseLeave={() => this.setState({ open: false })}/> : null }
                    {/*<span onClick={createTicket} className='extra'>{'Create New Ticket'}</span>*/}
                </div>
                <Tooltip visible={tooltipVisible} overlay={<WalkthroughStep {...walkthroughProps} last={true} />} placement='right'>
                    <div className='contentList'>
                        { sortedTickets.map(t => <Ticket ticket={t} selected={ticket.id == t.id} select={() => select(t.id)} key={t.id} />) }
                    </div>
                </Tooltip>
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

