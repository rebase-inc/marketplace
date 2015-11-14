import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

import BarChart from '../utils/BarChart';

export default class PastWorkChart extends Component {

    constructor(props, context) {
        super(props, context);
        this.componentDidMount = this.componentDidMount.bind(this);
    }

    componentDidMount() {
        let element = ReactDOM.findDOMNode(this);

        let fooData = [1,2,0,0,3,1,4,0,1,1,2,1,3,3];
        let barData = [1,0,1,2,1,0,0,1,0,1,0,1,1,1];
        let bazData = [0,0,0,0,2,0,1,0,0,0,1,0,1,0];

        let data = [];
        data = fooData.map((d, ind) => [fooData[ind], barData[ind], bazData[ind]]);
        new BarChart(element, { width: 550, height: 250, marginTop: 0, categories: ['rebase/api', 'rebase/react-app', 'rackt/redux-devtools'] }, data);
    }

    render() {
        return (
            <svg className='pastWork'/>
        );
    }
};
