import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

import RatingStars from './RatingStars.react';

export default class DeveloperProfileView extends Component {
    static propTypes = {
        user: PropTypes.object.isRequired,
        contractor: PropTypes.object.isRequired,
    }

    constructor(props, context) {
        super(props, context);
    }
    
    render() {
        return (
            <div className='projectView'>
                <h2 style={{display: 'block', margin: '0 auto'}}>{'Andrew Millspaugh'}</h2>
                <RatingStars colored={false} rating={4.5} /> 
                <img style={{display: 'block', margin: '0 auto'}} src='../img/fakeRadar.png' />
                <img style={{display: 'block', margin: '0 auto'}} src='../img/fakebarchart.png' />
            </div>
        );
    }
};
