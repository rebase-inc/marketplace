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
                {
                    !!this.props.currentUser.photo ?
                    <img src={this.props.currentUser.photo}/> :
                    <Icons.ProfilePicture user={this.props.currentUser} />
                }
                <input placeholder={this.props.currentUser.first_name}/>
                <input placeholder={this.props.currentUser.last_name}/>
                <input placeholder='Seattle, WA'/>
                <button onClick={window.open.bind(null, '/github/', '_blank')}>Authenticate GitHub</button>
            </div>
        );
    }
});

module.exports = ProfileView;

