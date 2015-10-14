// External
var React = require('react');
var ReactDOM = require('react-dom');

var Icons = require('../components/Icons.react');

var SearchBar = React.createClass({
    handleChange: function(text) {
        this.props.onUserInput( ReactDOM.findDOMNode(this.refs.filterTextInput).value );
    },
    getInitialState: () => ({focused: false }),
    onSearchFocus: function() {
        this.setState({ focused: true });
    },
    onSearchBlur: function() {
        this.setState({ focused: false });
    },
    componentWillMount: function() {
        this.props.onUserInput('');
    },
    render: function() {
        return (
            <form id='ticketSearchBar'>
                <div id='searchBox' className={this.state.focused ? 'focused' : null}>
                    <img src='img/search.svg' id='searchImg' />
                    <input type='text'
                        onFocus={this.onSearchFocus}
                        onBlur={this.onSearchBlur}
                        value={this.props.searchText}
                        onChange={this.handleChange}
                        placeholder='Search tickets'
                        ref='filterTextInput'/>
                    <img src='img/clear-search.svg' id='clearSearchImg' onClick={this.props.onUserInput.bind(null, '')} className={!this.props.searchText[0] ? 'hidden' : ''}/>
                </div>
            </form>
       );
    }
});

module.exports = SearchBar;
