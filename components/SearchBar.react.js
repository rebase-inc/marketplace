import React, { Component, PropTypes } from 'react';

export default class SearchBar extends Component {
    static propTypes = {
        placeholder: PropTypes.string,
        onChange: PropTypes.func.isRequired,
        searchText: PropTypes.string.isRequired,
    }

    static defaultProps = {
        placeholder: 'Search'
    }

    render() {
        const { placeholder, text, onChange } = this.props;
        return (
            <div className='searchBar'>
                <input type='text' value={text} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
                { !!this.props.children ? <div id='searchBarExtras'>{this.props.children}</div> : null }
            </div>
       );
    }
};
