import React, { Component, PropTypes } from 'react';

import _ from 'underscore'; // for _.range function

export default class RatingStars extends Component {
    static propTypes = {
        dynamic: PropTypes.bool,
        labeled: PropTypes.bool,
        rating: PropTypes.number,
        setRating: PropTypes.func,
    }
    static defaultProps = {
        dynamic: false,
        labeled: false,
        rating: 0,
    }

    constructor(props, context) {
        super(props, context);
        this.state = { dynamicRating: props.rating };
    }

    // TODO: Condense _make{type}Star functions into one...all three svgs are practically the same
    _makeEmptyStar(color, ratingNumber) {
        return (
            <svg key={'star-' + ratingNumber}
                width="10px"
                height="10px" viewBox="0 0 10 10"
                onMouseOver={() => { if (this.props.dynamic) this.setState({ dynamicRating: ratingNumber })}}
                onClick={() => { if (this.props.dynamic) this.props.setRating(ratingNumber)}}>
                <g stroke="none" strokeWidth="1" fill="#CFD9E6" fill-rule="evenodd" transform='translate(5,5)'>
                    <circle id="One-star-3-Copy-4" cx="0" cy="0" r="5"></circle>
                </g>
            </svg>
        );
    }
    _makeHalfStar(color, ratingNumber) {
        return (
            <svg key={'star-' + ratingNumber}
                width="10px"
                height="10px" viewBox="0 0 10 10"
                onMouseOver={() => { if (this.props.dynamic) this.setState({ dynamicRating: ratingNumber })}}
                onClick={() => { if (this.props.dynamic) this.props.setRating(ratingNumber)}}>
                <g id="Artboard-39" fill={color} transform='translate(5,5)'>
                    <circle cx="0" cy="0" r="5"></circle>
                    <path d="M0,5 A 5,5 1 0,0 0,-5" stroke="none" fill='#CFD9E6'/>
                </g>
            </svg>
        );
    }
    _makeStar(color, ratingNumber) {
        return (
            <svg key={'star-' + ratingNumber}
                width="10px"
                height="10px" viewBox="0 0 10 10"
                onMouseOver={() => { if (this.props.dynamic) this.setState({ dynamicRating: ratingNumber })}}
                onClick={() => { if (this.props.dynamic) this.props.setRating(ratingNumber)}}>
                <g id="Artboard-39" fill={color} transform='translate(5,5)'>
                    <circle cx="0" cy="0" r="5"></circle>
                </g>
            </svg>
        );
    }
    render() {
        const { rating, dynamic, labeled } = this.props;
        const { dynamicRating } = this.state;

        // TODO: Clean this up
        let nearestHalf = Math.round(dynamicRating*2)/2;
        let fullStars = Math.floor(nearestHalf);
        let halfStars = Math.floor(nearestHalf != fullStars);
        let emptyStars = 5 - fullStars - halfStars;

        // TODO: Clean this up
        let color = {1:'#BF3F52', 2:'#F2B046', 3: '#F2B046', 4: '#40B89E', 5: '#40B89E'}[fullStars];

        return (
            <div className={dynamic ? 'ratingStars dynamic' : 'ratingStars'} onMouseLeave={() => this.setState({ dynamicRating: rating })}>
                { labeled ? <span style={{textAlign: 'right'}} key='worst'>worst</span> : null }
                { _.range(fullStars).map((el, ind) => this._makeStar(color, ind + 1)) }
                { _.range(halfStars).map((el, ind) => this._makeHalfStar(color, fullStars + ind + 1)) }
                { _.range(emptyStars).map((el, ind) => this._makeEmptyStar(color, halfStars + fullStars + ind + 1)) }
                { labeled ? <span style={{textAlign: 'left'}} key='best'>best</span> : null }
            </div>
        );
    }
};
