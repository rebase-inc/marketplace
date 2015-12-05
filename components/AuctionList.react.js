import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

import Auction from './Auction.react';

import Fuse from '../utils/Fuse';

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
        const searchResults = !!searchText ? searchAuctions(auctions, searchText) : auctions.map(a => a.id);
        const sortedAuctions = auctions.sort(sort).filter(_shouldBeVisible.bind(null, role)).filter(a => searchResults.find(id => id == a.id));
        if (!sortedAuctions.length && loading) { return <LoadingAnimation />; } 
        console.log('sorted auctions are ', sortedAuctions);
        return (
            <table className='contentList'>
                <tbody ref='tableBody'>
                    { sortedAuctions.map(a => <Auction auction={a} role={role} select={() => select(a.id)} key={a.id} />) }
                </tbody>
            </table>
        );
    }
};
