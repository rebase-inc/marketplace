import React, { Component, PropTypes } from 'react';

import _ from 'underscore'; // for _.range function

export default class RatingStars extends Component {

    static propTypes = {
        dynamic: PropTypes.bool,
        labeled: PropTypes.bool,
        colored: PropTypes.bool,
        rating: PropTypes.number,
        setRating: PropTypes.func,
    }

    static defaultProps = {
        dynamic: false,
        labeled: false,
        colored: true,
        rating: 0,
    }

    constructor(props, context) {
        super(props, context)
        this._makeEmptyStar = this._makeEmptyStar.bind(this);
        this._makeHalfStar = this._makeHalfStar.bind(this);
        this._makeStar = this._makeStar.bind(this);
        this.state = { dynamicRating: props.rating };
    }

    // TODO: Condense _make{type}Star functions into one...all three svgs are practically the same
    _makeEmptyStar(color, ratingNumber) {

        return (
            <svg key={'star-' + ratingNumber}
                height="100%" viewBox="0 0 32 30"
                onMouseOver={() => { if (this.props.dynamic) this.setState({ dynamicRating: ratingNumber })}}
                onClick={() => { if (this.props.dynamic) this.props.setRating(ratingNumber)}}>
                <g fill="#C2CBD5">
                    <path d="M33.4921682,12.025788 L22.2636735,10.2979722 L17.1548468,0.931918211 L12.0460202,10.2979722 L0.817525421,12.025788 L9.37967578,19.7317233 L6.80641496,30.8817509 L17.152539,25.7090736 L27.3401901,30.8817509 L24.9246329,19.7355697 L33.4921682,12.025788 Z"></path>
                </g>
            </svg>
        );
    }
    _makeHalfStar(color, ratingNumber) {
        return (
            <svg key={'star-' + ratingNumber}
                height="100%" viewBox="0 0 32 30"
                onMouseOver={() => { if (this.props.dynamic) this.setState({ dynamicRating: ratingNumber })}}
                onClick={() => { if (this.props.dynamic) this.props.setRating(ratingNumber)}}>
                <g stroke="none">
                    <path d="M16,0.215800179 L11.0460202,9.29797218 L-8.46545056e-16,10.9977092 L0,11.1900151 L8.37967578,18.7317233 L5.80641496,29.8817509 L16,24.7853374 L16,0.215800179 Z" fill="#2C4866"></path>
                    <path d="M32,0.215800179 L27.0460202,9.29797218 L16,10.9977092 L16,11.1900151 L24.3796758,18.7317233 L21.806415,29.8817509 L32,24.7853374 L32,0.215800179 Z" fill="#C2CBD5" transform="translate(24.000000, 15.048776) scale(-1, 1) translate(-24.000000, -15.048776) "></path>
                </g>
            </svg>
        );
    }
    _makeStar(color, ratingNumber) {
        return (
            <svg key={'star-' + ratingNumber}
                height="100%" viewBox="0 0 32 30"
                onMouseOver={() => { if (this.props.dynamic) this.setState({ dynamicRating: ratingNumber })}}
                onClick={() => { if (this.props.dynamic) this.props.setRating(ratingNumber)}}>
                <g stroke="none" fill={this.props.colored ? color : "#2C4866"}>
                    <path d="M33.4921682,12.025788 L22.2636735,10.2979722 L17.1548468,0.931918211 L12.0460202,10.2979722 L0.817525421,12.025788 L9.37967578,19.7317233 L6.80641496,30.8817509 L17.152539,25.7090736 L27.3401901,30.8817509 L24.9246329,19.7355697 L33.4921682,12.025788 Z"></path>
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
            <div className='ratingStars' onMouseLeave={() => this.setState({ dynamicRating: rating })}>
                { labeled ? <span className='label' key='worst'>worst</span> : null }
                { _.range(fullStars).map((el, ind) => this._makeStar(color, ind + 1)) }
                { _.range(halfStars).map((el, ind) => this._makeHalfStar(color, fullStars + ind + 1)) }
                { _.range(emptyStars).map((el, ind) => this._makeEmptyStar(color, halfStars + fullStars + ind + 1)) }
                { labeled ? <span className='label' key='best'>best</span> : null }
            </div>
        );
    }

};
