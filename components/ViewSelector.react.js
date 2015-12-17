import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

import d3 from 'd3';

export default class ViewSelector extends Component {
    static propTypes = {
        view: PropTypes.object.isRequired,
        views: PropTypes.array.isRequired,
        selectView: PropTypes.func.isRequired,
    }
    componentDidMount() {
        const node = ReactDOM.findDOMNode(this);
        const options = { 
            categories: this.props.views,
            onClick: (view) => this.props.selectView(view.type),
        };
        this._svg = new ViewSelectorSVG(node, options);
    }

    componentDidUpdate() {
        const { views, view } = this.props;
        this._svg.update(views.findIndex(v => v.type == view.type));
    }
    render() {
        const { view, views, selectView } = this.props;
        return (
            <svg width='450px' height='30px' viewBox='0 0 450 30'>
            {/*
                <text fontFamily="Gotham Rounded" fontSize="12" fontWeight="bold" fill="#CFD9E3" transform='translate(0, 29)'>
                    <tspan x="30"  y="0" textAnchor='middle' fill="#5FC0AA" style={{fontWeight: 'bold'}}>Create</tspan>
                    <tspan x="160" y="0" textAnchor='middle' style={{fontWeight: 'bold'}}>Auction</tspan>
                    <tspan x="290" y="0" textAnchor='middle' style={{fontWeight: 'bold'}}>Work</tspan>
                    <tspan x="420" y="0" textAnchor='middle' style={{fontWeight: 'bold'}}>Review</tspan>
                </text>
               */}
            </svg>
        )
    }
}

export class ViewSelectorSVG {
    constructor(element, options) {
        this.options = Object.assign({
            width: 450,
            height: 30,
            offset: 30,
            nodeRadius: 8,
            selected: 0,
            onClick: (view) => null,
        }, options);
        if (!this.options.categories) {
            throw new Error('Must provide array of category names!');
        }
        this.options.x = (index) => (this.options.offset + index*(this.options.width - 2*this.options.offset)/(this.options.categories.length - 1));
        const g = d3.select(element).attr('width', options.width).attr('height', options.height).append('g');
        const inactivePath = g.append('path') .attr('class', 'inactive')
            .attr('d', 'M30,10 L' + this.options.x(this.options.categories.length - 1)  + ',10')
            .attr('stroke', '#C3D1DE')
            .attr('stroke-width', '3');
        this.activePath = g.append('path')
            .datum(this.options.selected)
            .attr('class', 'active')
            .attr('d', d => 'M30,10 L' + this.options.x(d) + ',10')
            .attr('stroke', '#5FC0AA')
            .attr('stroke-width', '3');
        this.viewNodes = g.selectAll('.node')
            .data(this.options.categories)
            .enter()
            .append('g')
            .attr('class', 'node');
        this.viewNodes.append('circle')
            .attr('cx', (d,i) => this.options.x(i))
            .attr('cy', 10)
            .attr('fill', (d,i) => i <= this.options.selected ? '#5FC0AA' : '#C3D1DE')
            .attr('r', this.options.nodeRadius)
            .style('stroke', 'none')
        this.viewNodes.append('text')
            .attr('x', (d,i) => this.options.x(i))
            .attr('y', 30)
            .text(d => d.name)
            .attr('fill', (d,i) => i <= this.options.selected ? '#5FC0AA' : '#C3D1DE')
            .attr('text-anchor', 'middle')
            .attr('opacity', '0.7')
            .attr('font-size', 12)
            .style('font-weight', 'bold');
        this.viewNodes.append('rect')
            .attr('x', (d,i) => this.options.x(i))
            .attr('y', 0)
            .attr('transform', 'translate(' + (-1*this.options.offset) + ',0)')
            .attr('height', this.options.height)
            .attr('width', this.options.offset * 2)
            .attr('fill', 'transparent')
            .on('click', d => this.options.onClick(d));
    }
    update(selected) {
        const duration = Math.abs(this.options.selected - selected)*300;
        const delay = (d,i) => Math.abs(this.options.selected - i)*300;
        this.activePath.datum(selected).transition().ease('linear').duration(duration).delay(0).attr('d', d => 'M30,10 L' + this.options.x(d) + ',10');
        this.viewNodes.select('circle')
            .transition().duration(500).ease('elastic').attr('r', (d,i) => i == selected ? 1.5 * this.options.nodeRadius : this.options.nodeRadius)
            .transition().attr('r', this.options.nodeRadius);
        this.viewNodes.select('circle')
            .data(this.options.categories).transition(100).delay(delay).attr('fill', (d,i) => i <= selected ? '#5FC0AA' : '#C3D1DE');
        this.viewNodes.select('text')
            .data(this.options.categories).transition(100).delay(delay).attr('fill', (d,i) => i <= selected ? '#5FC0AA' : '#C3D1DE');
        this.options.selected = selected;
    }
}
