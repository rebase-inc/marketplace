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
        let radii = [{ radius: 1, width: 0.04}, { radius: 0.88, width: 0.10 }, { radius: 0.3, width: 0.70 }];
        new RadarChart(element, {height: 140, width: 140, fontSize: 14, innerRadii: radii}, this.props.skills);
    }

    render() {
        return (
            <svg className='skillsRadar'/>
        );
    }
};
