import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as AuctionActions from '../actions/AuctionActions';
import { NEW } from '../constants/ViewConstants';

import SearchBar from './SearchBar.react';
import AuctionList from './AuctionList.react';
import SingleAuctionView from './SingleAuctionView.react';
import NothingHere from './NothingHere.react';
import SortOptions from './SortOptions.react';

// hack to only show auctions not already bid on. This has to be done here because reducer doesn't have access to user
// TODO: Add query parameter like ?state=waiting_for_bids or equivalent to api
function _shouldBeVisible(role, auction) {
    // all auctions are visible if you're a manager. They disappear if you're a contractor and you've already bid
    return (role.type == 'manager' || !auction.bids.find(a => a.contractor.id == role.id))
}

const SortFunctions = new Map([
    ['ending soon', (a, b) => new Date(a.expires) - new Date(b.expires) ],
    ['time left', (a, b) => new Date(b.expires) - new Date(a.expires) ],
]);

const unapproved = (auction) => auction.ticket_set.nominations.filter(n => !auction.approved_talents.find(t => t.contractor.id == n.contractor.id)).length;
const ManagerSortFunctions = new Map([
    ['unapproved developers', (a, b) => unapproved(b) - unapproved(a)],
    ['big budget', (a, b) => parseInt(b.ticket_set.bid_limits[0].price) - parseInt(a.ticket_set.bid_limits[0].price)],
    ['small budget', (a, b) => parseInt(a.ticket_set.bid_limits[0].price) - parseInt(b.ticket_set.bid_limits[0].price)],
]);
const DeveloperSortFunctions = new Map([
    ['highest rated', (a,b) => a.ticket.project.organization.rating - b.ticket.project.organzation.rating],
]);

export default class AuctionView extends Component {
    static propTypes = {
        user: PropTypes.object.isRequired,
        roles: PropTypes.object.isRequired,
    }
    constructor(props, context) {
        super(props, context);

        this.componentDidMount = this.componentDidMount.bind(this);
        this.componentDidUpdate = this.componentDidUpdate.bind(this);
    }
    componentDidMount() {
        this.props.actions.getAuctions()
    }
    componentDidUpdate(prevProps) {
        if (prevProps.user.current_role.id != this.props.user.current_role.id) {
            this.props.actions.getAuctions()
        }
    }
    handleUserInput(searchText) {
        this.setState({ searchText: searchText });
    }
    render() {
        const { auctionID, auctions, user, role, actions, selectView } = this.props;
        // If there aren't any tickets to display and we're not in the process of finding any,
        // display the nothing here screen, with some actions to help the user get out of this state.
        if (auctionID) {
            return <SingleAuctionView auction={auctions.items.get(auctionID).toJS()} actions={actions} role={role} user={user} />
        } else if (!auctions.items.size && !auctions.isFetching) {
            return <NoAuctionsHere role={role} viewNewTickets={selectView.bind(null, NEW)} />;
        } else {
            return <AuctionListView role={role} select={actions.selectAuction} auctions={auctions.items.toList().toJS()} loading={auctions.isFetching} />;
        }

    }
}

// merge this into the AuctionList component (same goes for TicketList, etc)
export class AuctionListView extends Component {
    static propTypes = {
        select: PropTypes.func.isRequired,
        auctions: PropTypes.array.isRequired,
        loading: PropTypes.bool.isRequired,
        role: PropTypes.object.isRequired,
    }
    constructor(props, context) {
        super(props, context);
        this.state = { searchText: '', sort: SortFunctions.get('ending soon') };
    }
    render() {
        const { select, auctions, loading, role } = this.props;
        const { searchText, sort } = this.state;
        return (
            <div className='contentView'>
                <SearchBar searchText={searchText} onUserInput={(input) => this.setState({ searchText: input })}>
                    {/*<PlusIcon onClick={actions.openNewTicketModal} text={'Add ticket'} />*/}
                    <SortOptions options={SortFunctions} select={(fn) => this.setState({ sort: fn })} sort={sort} />
                </SearchBar>
                <AuctionList role={role} searchText={searchText} select={select} sort={sort} auctions={auctions} loading={loading} />
            </div>
        );
    }

}
        //const { auction, auctions, user, roles, actions, selectView } = this.props;
        //const viewableAuctions = Array.from(auctions.items.values()).filter(a => _shouldBeVisible(roles.items.get(user.current_role.id), a));

        //if (!!auction.id) {
            //return <SingleAuctionView
                //auction={auctions.items.get(auction.id)}
                //unselect={() => actions.selectAuction(null)}
                //approveNomination={actions.approveNomination.bind(null, auctions.items.get(auction.id))}
                //submitComment={actions.commentOnAuction.bind(null, user, auctions.items.get(auction.id))}
                //openBidModal={actions.openBidModal}
                //user={user} roles={roles}/>;
        //} else {
            //const allSortFunctions = new Map([...SortFunctions, ...(isManager ? ManagerSortFunctions : DeveloperSortFunctions)]);
            //return (
                //<div className='contentView'>
                    //<SearchBar searchText={this.state.searchText} onUserInput={this.handleUserInput}>
                        //<SortOptions options={allSortFunctions} select={(fn) => this.setState({ sort: fn })} sort={this.state.sort} />
                    //</SearchBar>
                    //<AuctionList searchText={this.state.searchText} sort={this.state.sort} select={actions.selectAuction} user={user} roles={roles} auctions={viewableAuctions} loading={auctions.isFetching} />
                //</div>
            //);
        //}
    //}
//};

export class NoAuctionsHere extends Component {
    static propTypes = { 
        viewNewTickets: PropTypes.func.isRequired,
        role: PropTypes.object.isRequired,
    }
    render() {
        const { viewNewTickets, role } = this.props;
        const nothingHereString = role.type == 'manager' ?
            'Any tickets that you set a budget for will appear here with a summary of the data about the offer.' :
                'Any tickets that have been offered to you will appear here with information about who offered them to you.';
        return (
            <NothingHere>
                <h3>{ role.type == 'manager' ? 'Your Auctions' : 'Your Offers' }</h3>
                <h4>{ nothingHereString }</h4>
                { role.type == 'manager' ? <button onClick={viewNewTickets}>View New Tickets</button> :
                    <button>See Sample Offer</button> }
            </NothingHere>
        );
    }
}

let mapStateToProps = state => ({ auctions: state.auctions, auctionID: state.auctionID });
let mapDispatchToProps = dispatch => ({ actions: bindActionCreators(AuctionActions, dispatch)});
export default connect(mapStateToProps, mapDispatchToProps)(AuctionView);
