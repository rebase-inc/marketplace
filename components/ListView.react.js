import React, { Component, PropTypes } from 'react';

import SearchBar from './SearchBar.react';


export default class ListView extends Component {
    static propTypes = {
        sort: PropTypes.func,
        select: PropTypes.func,
        loading: PropTypes.bool,
        elements: PropTypes.array.isRequired,
        renderElement: PropTypes.func.isRequired,
    }
    static defaultProps = {
        sort: (a,b) => (a.id - b.id),
        select: () => null,
        loading: false,
    }
    constructor(props, context) {
        super(props, context);
        this.state = { searchText: '' };
    }
    render() {
        return (
            <div className='listView noselect'>
                { this.props.elements.sort(this.props.sort).map(this.props.renderElement) }
            </div>
        );
    }

}
