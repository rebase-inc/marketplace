import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as AuctionActions from '../actions/AuctionActions';

import SearchBar from './SearchBar.react';
import AuctionList from './AuctionList.react';
import SingleAuctionView from './SingleAuctionView.react';
import NothingHere from './NothingHere.react';
import SortOptions from './SortOptions.react';

// hack to only show auctions not already bid on. This has to be done here because reducer doesn't have access to user
// TODO: Add query parameter like ?state=waiting_for_bids or equivalent to api
function _shouldBeVisible(role, auction) {
    // all auctions are visible if you're a manager. They disappear if you're a contractor and you've already bid
    return (role.type == 'manager' || !auction.bids.length)
}

const SortFunctions = new Map([
    ['ending soon', (a, b) => new Date(a.expires) >= new Date(b.expires) ],
    ['time left', (a, b) => new Date(a.expires) <= new Date(b.expires) ],
]);

const unapproved = (auction) => auction.ticket_set.nominations.filter(n => !auction.approved_talents.find(t => t.contractor.id == n.contractor.id)).length;
const ManagerSortFunctions = new Map([
    ['waiting nominations', (a, b) => unapproved(a) <= unapproved(b)],
    ['big budget', (a, b) => a.ticket_set.bid_limits[0].price <= b.ticket_set.bid_limits[0].price],
    ['small budget', (a, b) => a.ticket_set.bid_limits[0].price >= b.ticket_set.bid_limits[0].price],
]);
const DeveloperSortFunctions = new Map([
    ['highest rated', (a,b) => a.ticket.project.organization.rating >= b.ticket.project.organzation.rating],
]);

export default class AuctionView extends Component {
    static propTypes = {
        user: React.PropTypes.object.isRequired,
        roles: React.PropTypes.object.isRequired,
    }
    constructor(props, context) {
        super(props, context);

        // TODO: Look into autobinding. React-redux examples projects have it, but not sure what they use
        this.handleUserInput = this.handleUserInput.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.componentDidUpdate = this.componentDidUpdate.bind(this);

        this.state = { searchText: '', sort: SortFunctions.get('ending soon') };
    }
    componentDidMount() {
        this.props.actions.getAuctions()
    }
    componentDidUpdate(prevProps) {
        if (prevProps.user.current_role != this.props.user.current_role) {
            this.props.actions.getAuctions()
            this.setState({ sort: SortFunctions.get('ending soon') });
        }
    }
    handleUserInput(searchText) {
        this.setState({ searchText: searchText });
    }
    render() {
        const { auction, auctions, user, roles, actions } = this.props;
        const viewableAuctions = Array.from(auctions.items.values()).filter(a => _shouldBeVisible(roles.items.get(user.current_role.id), a));
        const isManager = roles.items.get(user.current_role.id).type == 'manager';
        if (!viewableAuctions.length && !auctions.isFetching) {
            return (
                <NothingHere>
                    <h3>You don't have any offered tickets</h3>
                    { roles.items.get(user.current_role.id).type == 'manager' ?  <button>View New Tickets</button> : null }
                </NothingHere>
            );
        }

        if (!!auction.id) {
            return <SingleAuctionView
                auction={auctions.items.get(auction.id)}
                unselect={() => actions.selectAuction(null)}
                approveNomination={actions.approveNomination.bind(null, auctions.items.get(auction.id))}
                submitComment={actions.commentOnAuction.bind(null, user, auctions.items.get(auction.id))}
                openBidModal={actions.openBidModal}
                user={user} roles={roles}/>;
        } else {
            const allSortFunctions = new Map([...SortFunctions, ...(isManager ? ManagerSortFunctions : DeveloperSortFunctions)]);
            return (
                <div className='contentView'>
                    <SearchBar searchText={this.state.searchText} onUserInput={this.handleUserInput}>
                        <SortOptions options={allSortFunctions} select={(fn) => this.setState({ sort: fn })} sort={this.state.sort} />
                    </SearchBar>
                    <AuctionList searchText={this.state.searchText} sort={this.state.sort} select={actions.selectAuction} user={user} roles={roles} auctions={viewableAuctions} loading={auctions.isFetching} />
                </div>
            );
        }
    }
};

let mapStateToProps = state => ({ auctions: state.auctions, auction: state.auction });
let mapDispatchToProps = dispatch => ({ actions: bindActionCreators(AuctionActions, dispatch)});
export default connect(mapStateToProps, mapDispatchToProps)(AuctionView);
