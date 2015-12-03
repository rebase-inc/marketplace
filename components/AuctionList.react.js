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
        select: PropTypes.func.isRequired,
        searchText: PropTypes.string.isRequired,
        sort: PropTypes.func.isRequired,
        role: PropTypes.object.isRequired,
    }

    render() {
        const { auctions, loading, select, searchText, sort, role } = this.props;
        if (!auctions.size && loading) {
            return <LoadingAnimation />;
        } else {
            const searchResults = !!searchText ? searchAuctions(auctions, searchText) : auctions.map(a => a.id);
            const sortedAuctions = auctions.sort(sort).filter(a => searchResults.find(id => id == a.id));
            return (
                <table className='contentList'>
                    <tbody ref='tableBody'>
                        { sortedAuctions.map(a => <Auction auction={a} role={role} select={() => select(a.id)} key={a.id} />) }
                    </tbody>
                </table>
            );
        }
    }
};
