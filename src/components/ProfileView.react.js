// External
var React = require('react');
var ReactDOM = require('react-dom');
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
    updateProfileSettings: function() {
        var user = {
            id: this.props.currentUser.id,
            first_name: ReactDOM.findDOMNode(this.refs.first_name).value,
            last_name: ReactDOM.findDOMNode(this.refs.last_name).value,
            email: ReactDOM.findDOMNode(this.refs.email).value,
        }
        UserActions.updateUserSettings(user);
    },
    addGithubAccount: function() {
        window.location.assign('/github')
    },
    render: function() {
        return (
            <div className='profileView'>
                <div className='profileSettings'>
                    <Icons.ProfilePicture user={this.props.currentUser} dynamic={true}/>
                    <input ref='first_name' defaultValue={this.props.currentUser.first_name}/>
                    <input ref='last_name' defaultValue={this.props.currentUser.last_name}/>
                    <input ref='email' defaultValue={this.props.currentUser.email}/>
                    <input ref='location' defaultValue='Seattle, WA'/>
                    <button onClick={this.updateProfileSettings}>Update Profile Settings</button>
                    <button onClick={this.addGithubAccount}>Add Github Account</button>
                </div>
            </div>
        );
    }
});

//<button onClick={window.open.bind(null, '/github/', '_blank')}>Authenticate GitHub</button>
module.exports = ProfileView;
