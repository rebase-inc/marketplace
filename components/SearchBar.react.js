import React, { Component, PropTypes } from 'react';

export default class SearchBar extends Component {
    static propTypes = {
        placeholder: PropTypes.string,
        onUserInput: PropTypes.func.isRequired,
        searchText: PropTypes.string.isRequired,
    }

    static defaultProps = {
        placeholder: 'Search tickets'
    }

    constructor(props, context) {
        super(props, context);
        this.state = { focused: false };
    }

    render() {
        const { placeholder, onUserInput, searchText } = this.props;
        const { focused } = this.state;
        return (
            <div id='ticketSearchBar'>
                <form id='searchBox' className={focused ? 'focused' : null}>
                    <img src='img/search.svg' id='searchImg' />
                    <input type='text'
                        onFocus={() => this.setState({ focused: true })}
                        onBlur={() => this.setState({ focused: false })}
                        value={searchText}
                        onChange={(e) => onUserInput(e.target.value)}
                        placeholder={placeholder}
                        ref='filterTextInput'/>
                    <img src='img/clear-search.svg' id='clearSearchImg' onClick={() => onUserInput('')} className={searchText[0] ? '' : 'hidden'}/>
                </form>
                { !!this.props.children ? <div id='searchBarExtras'>{this.props.children}</div> : null }
            </div>
       );
    }
};
