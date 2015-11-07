// this uses chart.js, which is canvas based, as opposed to d3js, which is svg based.
// TODO: Do some research into which solution better covers all of our use cases
// and performs well enough as to not worry about it, and use one or the other
// for every charting purpose (e.g., donut chart). My uneducated guess is that
// chart.js is a better solution, as we don't really do any fancy DOM manipulations
// and are using d3 mostly as a charting library.

import Chart from 'chart.js';

export default class RadarChart {
    constructor(element, dimensions, data) {
        var axes = [];
        var values = [];
        for (let [key, value] of data) {
            axes.push(key);
            values.push(value);
        }
        const config = {
            radius: null,
            width: 200,
            height: 200,
            marginTop: 40,
            marginBottom: 40,
            marginLeft: 80,
            marginRight: 80,
            maxValue: 1.0,
            areaOpacity: 0.5,
            color: d3.scale.category10()
        };
        config.radius = Math.max(config.width/2, config.height/2)

        const g = d3.select(element)
                .append("svg")
                .attr("width", config.width + config.marginLeft + config.marginRight)
                .attr("height", config.height + config.marginTop + config.marginBottom)
                .append("g")
                .attr('transform', 'translate(' + config.marginLeft + ',' + config.marginTop + ')');

        const circleElements = g.selectAll('circle')
            //.data([{ radius: 0.89, width: '8px'}, { radius: 0.99, width: '4px' }])
            .data([{ radius: 1, width: '1px'}, { radius: 0.70, width: '1px' }, { radius: 0.4, width: '1px' }])
            .enter()
            .append('circle')
            .attr('cx', config.radius)
            .attr('cy', config.radius)
            .attr('r', d => d.radius*config.radius)
            .attr('fill', 'none')
            .style('stroke-width', d => d.width)
            .style("stroke", "#E6E8EB");

        function xValue(index, scalingFactor) {
            scalingFactor = typeof(scalingFactor) == 'undefined' ? 1 : scalingFactor;
            return (config.width/2) * (1 - scalingFactor*Math.sin(index*2*Math.PI/axes.length));
        }
        function yValue(index, scalingFactor) {
            scalingFactor = typeof(scalingFactor) == 'undefined' ? 1 : scalingFactor;
            return (config.width/2) * (1 - scalingFactor*Math.cos(index*2*Math.PI/axes.length));
        }

        const axisElements = g.selectAll('.axis')
            .data(axes)
            .enter()
            .append('g')
            .attr('class', 'axis')
            .append('line')
            .attr('x1', config.width/2)
            .attr('y1', config.height/2)
            .attr('x2', (data, ind) => xValue(ind))
            .attr('y2', (data, ind) => yValue(ind))
            .attr("class", "line")
            .style("stroke", "#E6E8EB")

        const axisLabels = g.selectAll('.axis')
            .append('text')
            .text(d => d)
            .attr('text-anchor', (data, ind) => {
                let x = xValue(ind);
                if (Math.abs((x - config.width/2)/(config.width/2)) < 0.001) {
                    return 'middle';
                } else if (x > config.width/2) {
                    return 'start';
                } else {
                    return 'end'
                }
            })
            .attr('dominant-baseline', 'middle')
            .attr('x', (data, ind) => xValue(ind, 1.15))
            .attr('y', (data, ind) => yValue(ind, 1.15))
            .style("fill", "#1A2B3D");



        g.selectAll('.area')
             .data([values])
             .enter()
             .append('polygon')
             .style('fill', '#5FC0AA')
             .style('fill-opacity', '0.7')
             .on('mouseover', function() {
                 d3.select(this).transition(300).style('fill-opacity', 1);
             })
             .on('mouseout', function() {
                 d3.select(this).transition(300).style('fill-opacity', 0.7);
             })
             .attr('points', data => data.reduce((prev, curr, ind) => prev + xValue(ind, 0) + ',' + yValue(ind, 0) + ' ', ''))
             .transition().duration(800).delay(100)
             .attr('points', data => data.reduce((prev, curr, ind) => prev + xValue(ind, curr/config.maxValue) + ',' + yValue(ind, curr/config.maxValue) + ' ', ''))

        const nodes = g.selectAll('.node')
            .data(values)
            .enter()
            .append('circle')
            .attr('class', 'node')
            .attr('r', 4)
            .attr('fill', '#5FC0AA')
            .style('stroke', '#F7FAFC')
            .style('stroke-width', '1px')
            .attr('cx', (data, ind) => xValue(ind, 0))
            .attr('cy', (data, ind) => yValue(ind, 0))
            .transition().duration(800).delay(100)
            .attr('cx', (data, ind) => xValue(ind, data/config.maxValue))
            .attr('cy', (data, ind) => yValue(ind, data/config.maxValue))
    }
}
