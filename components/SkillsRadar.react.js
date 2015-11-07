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
        new RadarChart(element, {height: 160, width: 160, fontSize: 14}, this.props.skills);
    }

    render() {
        return (
            <svg className='skillsRadar'/>
        );
    }
};
