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
        auctions: PropTypes.object.isRequired,
        roles: PropTypes.object.isRequired,
        user: PropTypes.object.isRequired,
    }
    render() {
        const { auctions, user, roles } = this.props;
        const auctionList = Array.from(auctions.items.values())
        let searchResults = !!this.props.searchText ? searchAuctions(auctionList, this.props.searchText) : auctionList.map(a => a.id);
        switch (auctions.isFetching) {
            case true: return <div className='contentList'><LoadingAnimation /></div>; break;
            case false:
                return (
                    <table className='contentList'>
                        <tbody ref='tableBody'>
                            { auctionList.filter(a => searchResults.indexOf(a.id) != -1).map(a => <Auction user={user} roles={roles} auction={a} key={a.id} />) }
                        </tbody>
                    </table>
                );
                break;
        }
    }
};
