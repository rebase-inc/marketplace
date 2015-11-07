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
        this._makeStar = this._makeStar.bind(this);
        this.state = { dynamicRating: props.rating };
    }

    _makeStar(type, ratingNumber, color) {
        let path = {
            'full': <path d="M33.4921682,12.025788 L22.2636735,10.2979722 L17.1548468,0.931918211 L12.0460202,10.2979722 L0.817525421,12.025788 L9.37967578,19.7317233 L6.80641496,30.8817509 L17.152539,25.7090736 L27.3401901,30.8817509 L24.9246329,19.7355697 L33.4921682,12.025788 Z" />,
            'half': <path d="M17.1548468,0.931918211 L12.0460202,10.2979722 L1,11.9977092 L1,12.1900151 L9.37967578,19.7317233 L6.80641496,30.8817509 L17.152539,25.7090736 L17.1548468,25.7102453 L17.1548468,0.931918211 Z"/>,
            'empty': <path d="M33.4921682,12.025788 L22.2636735,10.2979722 L17.1548468,0.931918211 L12.0460202,10.2979722 L0.817525421,12.025788 L9.37967578,19.7317233 L6.80641496,30.8817509 L17.152539,25.7090736 L27.3401901,30.8817509 L24.9246329,19.7355697 L33.4921682,12.025788 Z" fill='#C2CBD5'/>,
        }[type];
        return (
            <g fill={color} 
                transform={'translate(' + (ratingNumber - 1) * 35 + ',0)'}
                onMouseOver={() => { if (this.props.dynamic) this.setState({ dynamicRating: ratingNumber })}}
                onClick={() => { if (this.props.dynamic) this.props.setRating(ratingNumber)}}>
                {path}
            </g>
        );
    }

    render() {
        const { rating, dynamic, labeled, colored } = this.props;
        const { dynamicRating } = this.state;

        // TODO: Clean this up
        let nearestHalf = Math.round(dynamicRating*2)/2;
        let fullStars = Math.floor(nearestHalf)
        let halfStar = Math.floor(nearestHalf != fullStars);
        let emptyStars = 5 - fullStars;

        // TODO: Clean this up
        let color = {1:'#BF3F52', 2:'#F2B046', 3: '#F2B046', 4: '#40B89E', 5: '#40B89E'}[fullStars];

        return (
            <svg className='ratingStars' viewBox='0 0 173 32' onMouseLeave={() => this.setState({ dynamicRating: rating })}>
                { labeled ? <span className='label' key='worst'>worst</span> : null }
                { _.range(1, fullStars + 1).map((el) => this._makeStar('full', el, colored ? color : '#2C4866')) }
                { _.range(fullStars + 1, 6).map((el) => this._makeStar('empty', el, colored ? color : '#2C4866')) }
                { halfStar ? this._makeStar('half', fullStars + 1, colored ? color : '#2C4866') : null }
                { labeled ? <span className='label' key='best'>best</span> : null }
            </svg>
        );
    }

};
