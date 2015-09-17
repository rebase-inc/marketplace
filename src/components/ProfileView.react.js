// External
var React = require('react');
var _ = require('underscore');

// Stores
var UserStore = require('../stores/UserStore');

// Actions
var UserActions = require('../actions/UserActions');

// Icons
var Icons = require('../components/Icons.react');

var ProfileView = React.createClass({
    propTypes: {
        currentUser: React.PropTypes.object.isRequired,
        currentRole: React.PropTypes.object.isRequired,
    },
    render: function() {
        return (
            <div className='profileView'>
                <Icons.ProfilePicture user={this.props.currentUser} dynamic={true}/>
                <input value={this.props.currentUser.first_name}/>
                <input value={this.props.currentUser.last_name}/>
                <input value='Seattle, WA'/>
                <button>Update Settings</button>
                <button onClick={window.open.bind(null, '/github/', '_blank')}>Authenticate GitHub</button>
            </div>
        );
    }
});

module.exports = ProfileView;

