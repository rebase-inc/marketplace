import Immutable from 'immutable';
import React, { Component, PropTypes } from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import SingleTicketView from './SingleTicketView.react';
import ListTitleBar from './ListTitleBar.react';
import ListElement from './ListElement.react';

import RoundIcon from './RoundIcon.react';
import GithubIcon from './GithubIcon.react';
import Tooltip from 'rc-tooltip';
import WalkthroughStep from './WalkthroughStep.react';

import SearchBar from './SearchBar.react';
import * as TicketActions from '../actions/TicketActions';
import * as WalkthroughActions from '../actions/WalkthroughActions';

import { CURRENT_VIEW } from '../constants/WalkthroughConstants';

const Ticket = (props) => (
    <ListElement {...props} date={props.created}
        icon={props.discriminator == 'github_ticket' ? <GithubIcon /> : <RoundIcon />}
        subtitle={ Object.keys(props.skill_requirement.skills).join(' ') } />
);

const TicketViewWalkthrough = (props) => (
    <WalkthroughStep {...props}
        title={'Your New Tickets'} 
        description={'A list of all of the tickets in this project with information about their technology requirements.'} />
);

class TicketView extends Component {
    static propTypes = {
        searchText: PropTypes.string,
        updateSearchText: PropTypes.func,
        user: PropTypes.object.isRequired,
        tickets: PropTypes.instanceOf(Immutable.Record).isRequired,
    }
    constructor(props, context) {
        super(props, context);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.componentDidUpdate = this.componentDidUpdate.bind(this);
    }
    componentDidMount() {
        console.log('actions are ', this.props.actions);
        this.props.actions.getTickets()
    }
    componentDidUpdate(prevProps) {
        if (prevProps.user.current_role.id != this.props.user.current_role.id) {
            this.props.actions.getTickets()
        }
        if (this.props.tickets.length && !this.props.ticket) {
            this.props.actions.selectTicket(this.props.tickets[0].id);
        }
    }
    render() {
        const { walkthrough, actions, searchText, updateSearchText, ticket, tickets, user, role } = this.props;
        return (
            <div className='mainView'>
                <Tooltip visible={walkthrough == CURRENT_VIEW} overlay={<TicketViewWalkthrough {...actions} last={true} />} placement='right'>
                    <div className='listView noselect'>
                        <ListTitleBar title={'All Tickets'}>
                            {/*<RebaseIcon />*/}
                        </ListTitleBar>
                        <SearchBar searchText={searchText} onChange={updateSearchText} />
                        { tickets.map(t => <Ticket {...t} handleClick={actions.selectTicket.bind(null, t.id)} selected={t.id == ticket.id} />) }
                    </div>
                </Tooltip>
                { ticket ? <SingleTicketView ticket={ticket} actions={actions} role={role} user={user} /> : null }
            </div>
       );
    }
}

let mapStateToProps = state => ({
    tickets: state.tickets.items.toList().toJS(),
    ticket: state.ticketID ? state.tickets.items.get(state.ticketID).toJS() : null,
    walkthrough: state.walkthrough.steps[state.walkthrough.current],
});
let mapDispatchToProps = dispatch => ({ 
    actions: Object.assign({}, 
               bindActionCreators(TicketActions, dispatch), 
               bindActionCreators(WalkthroughActions, dispatch)) 
}) 
export default connect(mapStateToProps, mapDispatchToProps)(TicketView);
