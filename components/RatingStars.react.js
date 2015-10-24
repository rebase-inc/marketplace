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
    _makeEmptyStar: function(color, ratingNumber) {
        return (
            <svg key={'star-' + ratingNumber}
                width="10px"
                height="10px" viewBox="0 0 10 10"
                onMouseOver={this.mockRating.bind(null, ratingNumber)}
                onClick={this.setRating.bind(null, ratingNumber)}>
                <g stroke="none" strokeWidth="1" fill="#CFD9E6" fill-rule="evenodd" transform='translate(5,5)'>
                    <circle id="One-star-3-Copy-4" cx="0" cy="0" r="5"></circle>
                </g>
            </svg>
        );
    },
    _makeHalfStar: function(color, ratingNumber) {
        return (
            <svg key={'star-' + ratingNumber}
                width="10px"
                height="10px" viewBox="0 0 10 10"
                onMouseOver={this.mockRating.bind(null, ratingNumber)}
                onClick={this.setRating.bind(null, ratingNumber)}>
                <g id="Artboard-39" fill={color} transform='translate(5,5)'>
                    <circle cx="0" cy="0" r="5"></circle>
                    <path d="M0,5 A 5,5 1 0,0 0,-5" stroke="none" fill='#CFD9E6'/>
                </g>
            </svg>
        );
    },
    _makeStar: function(color, ratingNumber) {
        return (
            <svg key={'star-' + ratingNumber}
                width="10px"
                height="10px" viewBox="0 0 10 10"
                onMouseOver={this.mockRating.bind(null, ratingNumber)}
                onClick={this.setRating.bind(null, ratingNumber)}>
                <g id="Artboard-39" fill={color} transform='translate(5,5)'>
                    <circle cx="0" cy="0" r="5"></circle>
                </g>
            </svg>
        );
    },
    render: function() {
        let nearestHalf = Math.round(this.state.dynamicRating*2)/2;
        let fullStars = Math.floor(nearestHalf);
        let halfStars = Math.floor(nearestHalf != fullStars);
        let emptyStars = 5 - fullStars - halfStars;
        let color = {1:'#BF3F52', 2:'#F2B046', 3: '#F2B046', 4: '#40B89E', 5: '#40B89E'}[fullStars]
        return (
            <div className={'ratingStars ' + (!!this.props.setRating ? 'dynamic' : '')} onMouseLeave={this.resetRating}>
                { !!this.props.labeled ? <span style={{textAlign: 'right'}} key='worst'>worst</span> : null }
                { _.range(fullStars).map((el, ind) => this._makeStar(color, ind + 1)) }
                { _.range(halfStars).map((el, ind) => this._makeHalfStar(color, fullStars + ind + 1)) }
                { _.range(emptyStars).map((el, ind) => this._makeEmptyStar(color, halfStars + fullStars + ind + 1)) }
                { !!this.props.labeled ? <span style={{textAlign: 'left'}} key='best'>best</span> : null }
            </div>
        );
    }
});

module.exports = RatingStars;
