import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

import LoadingAnimation from './LoadingAnimation.react';
import Auction from './Auction.react';

import Fuse from '../utils/Fuse';

function searchAuctions(auctions, searchText) {
    var fuseSearch = new Fuse(auctions, {threshold: 0.35, keys: ['ticket.title', 'ticket.project.name', 'ticket.project.organization.name'], id: 'id'});
    return fuseSearch.search(searchText.substring(0, 32));
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
        let searchResults = !!this.props.searchText ? searchAuctions(auction, this.props.searchText) : auctions.map(a => a.id);
        return (
            <table className='contentList'>
                <tbody ref='tableBody'>
                    { auctions.filter(a => searchResults.indexOf(a.id) != -1).map(a =>
                         <Auction user={user} roles={roles} auction={a} select={select.bind(null, a.id)} key={a.id} />) }
                </tbody>
            </table>
        );
    }
};
