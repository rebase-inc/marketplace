import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

import RadarChart from '../utils/RadarChart';

export default class SkillsRadar extends Component {
    static propTypes = {
        skills: PropTypes.object.isRequired,
    }

    constructor(props, context) {
        super(props, context);
        this.componentDidMount = this.componentDidMount.bind(this);
    }

    componentDidMount() {
        let element = ReactDOM.findDOMNode(this);
        new RadarChart(element, {}, this.props.skills);
    }

    render() {
        return (
            <div className='skillsRadar'/>
        );
    }
};
