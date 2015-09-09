var React = require('react');
var _ = require('underscore');

var RatingStars = React.createClass({
    getDefaultProps: function() {
        return { 
            dynamic: false,
            labeled: false,
        }
    },
    getInitialState: function() {
        return { dynamicRating: this.props.rating }
    },
    resetRating: function() {
        this.setState({ dynamicRating: this.props.rating });
    },
    mockRating: function(newRating) {
        if (!this.props.setRating) { return; }
        this.setState({ dynamicRating: newRating });
    },
    setRating: function(newRating) {
        if (!this.props.setRating) { return; }
        this.props.setRating(newRating);
    },
    render: function() {
        var nearestHalf = Math.round(this.state.dynamicRating*2)/2;
        var fullStars = Math.floor(nearestHalf);
        var halfStars = Math.floor(nearestHalf != fullStars);
        var emptyStars = 5 - fullStars - halfStars;
        var allStars = [];
        _.range(fullStars).map(() => allStars.push('img/star-10px.svg'));
        _.range(halfStars).map(() => allStars.push('img/half-star-10px.svg'));
        _.range(emptyStars).map(() => allStars.push('img/empty-star-10px.svg'));
        allStars = allStars.map((el, ind) => <img key={ind} src={el} onMouseOver={this.mockRating.bind(null, ind + 1)} onClick={this.setRating.bind(null, ind + 1)}/>);
        return (
            <div className={'ratingStars ' + (!!this.props.setRating ? 'dynamic' : '')} onMouseLeave={this.resetRating}>
                { !!this.props.labeled ? <span style={{textAlign: 'right'}} key='worst'>worst</span> : null }
                { allStars }
                { !!this.props.labeled ? <span style={{textAlign: 'left'}} key='best'>best</span> : null }
            </div>
        );
    }
});

module.exports = RatingStars;
