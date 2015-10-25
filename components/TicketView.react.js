import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import SingleTicketView from './SingleTicketView.react';
import NewTicketModal from './NewTicketModal.react';
import TicketList from './TicketList.react';
import SearchBar from './SearchBar.react';
import NothingHere from './NothingHere.react';

import { AddTicket } from './Icons.react';

import * as TicketActions from '../actions/TicketActions';

export default class TicketView extends Component {
    static propTypes = {
        user: React.PropTypes.object.isRequired,
        roles: React.PropTypes.object.isRequired,
    }
    constructor(props, context) {
        super(props, context);
        this.state = { searchText: '', modalOpen: false };
        
        // TODO: Look into autobinding. React-redux examples projects have it, but not sure what they use
        this.findTalent = this.findTalent.bind(this);
        this.handleUserInput = this.handleUserInput.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
        this.componentWillMount = this.componentWillMount.bind(this);
    }
    componentWillMount() {
        this.props.actions.getTickets()
    }
    handleUserInput(searchText) {
        this.setState({ searchText: searchText });
    }
    findTalent(ticketID) {
        //if (!!ticketID) {  TicketActions.selectTicket(ticketID); }
        this.setState({ modalOpen: true });
    }
    toggleModal() {
        this.setState({ modalOpen: !this.state.modalOpen });
    }
    render() {
        const { ticket, tickets, user, roles } = this.props;
        // If there aren't any tickets to display and we're not in the process of finding any,
        // display the nothing here screen, with some actions to help the user get out of this state.
        if (!tickets.items.length && !tickets.isFetching) {
            return (
                <NothingHere>
                    <h3>In order to get some work done, you first need some tasks</h3>
                    <button>Import Another Project</button>
                    <span>OR</span>
                    <button className='notification'>Add a Task</button>
                </NothingHere>
            );
        }
        switch (!!ticket) {
            case true: 
                return <div>temp single ticket view</div>; 
                return <SingleTicketView {...props} />;
                break;
            case false:
                return (
                    <div className='ticketView'>
                        <SearchBar searchText={this.state.searchText} onUserInput={this.handleUserInput}>
                            <AddTicket onClick={this.toggleModal}/>
                        </SearchBar>
                        <TicketList tickets={Array.from(tickets.items.values())} />
                        { !!this.state.modalOpen ? <NewTicketModal project={this.props.currentRole.project} toggleModal={this.toggleModal} /> : null }
                    </div>
                );
                break;
        }
    }
};

let mapStateToProps = state => ({ tickets: state.tickets, ticket: state.ticket });
let mapDispatchToProps = dispatch => ({ actions: bindActionCreators(TicketActions, dispatch)});
export default connect(mapStateToProps, mapDispatchToProps)(TicketView);
