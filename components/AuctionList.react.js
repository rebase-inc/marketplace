import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

import LoadingAnimation from './LoadingAnimation.react';
import Auction from './Auction.react';

import Fuse from '../utils/Fuse';

function searchAuctions(auctions, searchText) {
    var fuseSearch = new Fuse(auctions, {threshold: 0.35, keys: ['ticket.title', 'ticket.project.name', 'ticket.project.organization.name'], id: 'id'});
    return fuseSearch.search(searchText.substring(0, 32));
}

// hack to only show auctions not already bid on. This has to be done here because reducer doesn't have access to user
// TODO: Add query parameter like ?state=waiting_for_bids or equivalent to api
function _shouldBeVisible(role, auction) {
    // all auctions are visible if you're a manager. They disappear if you're a contractor and you've already bid
    return (role.type == 'manager' || !auction.bids.length)
}

export default class AuctionList extends Component {
    static propTypes = {
        auctions: PropTypes.array.isRequired,
        roles: PropTypes.object.isRequired,
        user: PropTypes.object.isRequired,
        select: PropTypes.func.isRequired,
    }
    render() {
        // TODO: Refactor so this takes a role, instead of user and list of roles
        const { auctions, user, roles, select } = this.props;
        const viewableAuctions = auctions.filter(a => _shouldBeVisible(roles.items.get(user.current_role.id), a));
        let searchResults = !!this.props.searchText ? searchAuctions(viewableAuctions, this.props.searchText) : viewableAuctions.map(a => a.id);
        return (
            <table className='contentList'>
                <tbody ref='tableBody'>
                    { viewableAuctions.filter(a => searchResults.indexOf(a.id) != -1).map(a =>
                         <Auction user={user} roles={roles} auction={a} select={select.bind(null, a.id)} key={a.id} />) }
                </tbody>
            </table>
        );
    }
};
