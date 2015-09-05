// External
var React = require('react');
var ReactDOM = require('react-dom');

var SearchBar = React.createClass({
    handleChange: function() {
        this.props.onUserInput( ReactDOM.findDOMNode(this.refs.filterTextInput).value );
    },
    render: function() {
        return (
            <form id='ticketSearchBar'>
                <input type='text' placeholder='Search for tickets' value={this.props.searchText} onChange={this.handleChange} ref='filterTextInput'/>
            </form>
       );
    }
});

module.exports = SearchBar;
