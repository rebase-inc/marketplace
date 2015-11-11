import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

import RatingStars from './RatingStars.react';
import SkillsRadar from './SkillsRadar.react';
import PastWorkChart from './PastWorkChart.react';
import GithubAccountTag from './GithubAccountTag.react';
import NothingHere from './NothingHere.react';

export default class DeveloperProfileView extends Component {
    static propTypes = {
        user: PropTypes.object.isRequired,
        contractor: PropTypes.object.isRequired,
    }

    constructor(props, context) {
        super(props, context);
    }

    render() {
        const { user, contractor } = this.props;
        console.log('contractor is ', contractor);
        if (!contractor) { 
            return (
                <NothingHere>
                    <h3>You haven't registered as a developer</h3>
                    <button>Register Now</button>
                </NothingHere>
            );
        }
        return (
            <div className='contentView' id='developerProfileView'>
                <h1>{user.first_name + ' ' + user.last_name}</h1>
                <RatingStars colored={false} rating={4.5} />
                <h5>{'Rating based on ' + 67 + ' tasks'}</h5>
                <GithubAccountTag account={{user: user.first_name.toLowerCase() + user.last_name.toLowerCase(), url: 'http://foo.bar'}}/>
                <SkillsRadar skills={new Map([['haskell', 0.7], ['java', 0.3], ['python', 0.9], ['go', 0.3], ['javascript', 0.6], ['c++', 0.2], ['scala', 0.6]])} />
                <h5>Completed Work</h5>
                <PastWorkChart />
            </div>
        );
    }
};
