var React = require('react');

var LoadingAnimation = React.createClass({
    render: function() {
        return (
            <svg className='loadingAnimation' width="135" height="140" viewBox="0 0 135 140" fill="#5FC0AA">
                <rect x="0" y="10" width="15" rx="6"/>
                <rect x="30" y="10" width="15" rx="6"/>
                <rect x="60" y="10" width="15" rx="6"/>
                <rect x="90" y="10" width="15" rx="6"/>
                <rect x="120" y="10" width="15" rx="6"/>
            </svg>
        );
    }
});

module.exports = LoadingAnimation;
