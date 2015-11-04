var React = require('react');

var UserActions = require('../actions/UserActions');

var ViewTypes = require('../constants/ViewConstants').ViewTypes;

var NothingHere = React.createClass({
    getInitialState: () => ({mounted: false}),
    componentDidMount: function() {
        setTimeout(function() {
            !!this.isMounted() ?  this.setState({ mounted: true }) : null;
        }.bind(this), 50); // animation hack
    },
    render: function() {
        return (
            <div className='contentView' id='nothingHere'>
                <div id='opacityMask' className={!!this.state.mounted ? 'fade-away' : ''} />
                <div id='content'>
                    {this.props.children}
                </div>
           </div>
        );
    }
});

module.exports = NothingHere;
