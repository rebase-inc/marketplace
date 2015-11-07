import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

import RatingStars from './RatingStars.react';
import SkillsRadar from './SkillsRadar.react';

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
            <div className='contentView' id='developerProfileView'>
                <h1>{'Andrew Millspaugh'}</h1>
                <RatingStars colored={false} rating={4.5} /> 
                <SkillsRadar skills={new Map([['java', 0.3], ['python', 0.9], ['go', 0.3], ['javascript', 0.6], ['c++', 0.2], ['scala', 0.6], ['css', 0.6]])} />
            </div>
        );
    }
};
