import React, { Component, PropTypes } from 'react';

import LoadingAnimation from './LoadingAnimation.react';
import SpinningGears from './SpinningGears.react';
import SearchBar from './SearchBar.react';

// Derived components must set the following members:
// this.getTicket: a function that take one 'item' and returns its nested Ticket
// this.Item: a Component class for the 'item'
//
export default class ListView extends Component {
    static propTypes = {
        items: PropTypes.array.isRequired,
        role: PropTypes.object.isRequired,
        search: PropTypes.func.isRequired,
        selectedId: PropTypes.number,
        selectView: PropTypes.func.isRequired,
        sort: PropTypes.func.isRequired,
    }
    constructor(props, context) {
        super(props, context);
        this.state = { searchText: '' };
    }
    render() {
        const { items, loading, role, search, selectedId, selectView } = this.props;
        const { searchText, sort } = this.state;
        const Item = this.Item;
        const NoItemView = this.NoItemView;
        const searchResults = !!searchText ? search(searchText) : items.map(item => this.getTicket(item).id);
        const filteredItems = items.sort(sort).filter(a => searchResults.indexOf(this.getTicket(a).id) != -1);
        if (!filteredItems.length && loading) { return <SpinningGears />; }
        return (
            <div className='listView'>
                <SearchBar placeholder='Search tickets' searchText={searchText} onChange={(input) => this.setState({ searchText: input })} />
                <div className='contentList'>
                    {
                        filteredItems.map(function (item) {
                            return React.createElement(Item, {
                                ...item,
                                role: role,
                                key: item.id,
                                handleClick: selectView.bind(null, item.id),
                                selected: selectedId == item.id,
                            });
                        })
                    }
                </div>
            </div>
        );
    }
}

