import d3 from 'd3';

export default class RadarChart {
    constructor(element, properties, data) {
        var axes = [];
        var values = [];
        for (let [key, value] of data) {
            axes.push(key);
            values.push(value);
        }
        const config = Object.assign({
            radius: null,
            width: 200,
            height: 200,
            fontSize: 18,
            marginTop: 40,
            marginBottom: 40,
            marginLeft: 80,
            marginRight: 80,
            maxValue: 1.0,
            areaOpacity: 0.7,
            innerRadii: [{ radius: 1, width: '1px'}, { radius: 0.7, width: '1px' }, { radius: 0.4, width: '1px' }],
        }, properties);
        config.radius = Math.max(config.width/2, config.height/2)

        const g = d3.select(element)
                .attr('width', config.width + config.marginLeft + config.marginRight)
                .attr('height', config.height + config.marginTop + config.marginBottom)
                .append('g')
                .attr('transform', 'translate(' + config.marginLeft + ',' + config.marginTop + ')');

        const circleElements = g.selectAll('circle')
            .data(config.innerRadii)
            .enter()
            .append('circle')
            .attr('cx', config.radius)
            .attr('cy', config.radius)
            .attr('r', d => d.radius*config.radius)
            .attr('fill', 'none')
            .style('stroke-width', d => typeof(d.width) == 'number' ? config.radius*d.width : d.width)
            .style("stroke", "#F0F2F5");

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
            .style("fill", "#1A2B3D")
            .style('font-size', config.fontSize);

        g.selectAll('.area')
             .data([values])
             .enter()
             .append('polygon')
             .style('fill', '#5FC0AA')
             .style('fill-opacity', config.areaOpacity)
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
            .attr('cy', (data, ind) => yValue(ind, data/config.maxValue));

        d3.select(element).attr('pointer-events', 'none');
        d3.select(element).transition().delay(900).attr('pointer-events', 'all');

        let invisibleRectangle = d3.select(element).append('rect')
            .style('visibility', 'hidden')
            .attr('x', 0)
            .attr('y', 0)
            .attr('width', config.width + config.marginLeft + config.marginRight)
            .attr('height', config.height + config.marginTop + config.marginBottom);

        invisibleRectangle.on('mousemove', function() {
            let position = d3.mouse(this);
            let x = position[0] - config.width/2 - config.marginLeft;
            let y = position[1] - config.height/2 - config.marginTop;
            let angle = Math.atan(-y/x);
            if (x >= 0) { angle = angle + 3*Math.PI/2; }
            else { angle = angle + Math.PI/2; }
            let anglePerAxis = 2*Math.PI/axes.length;
            let nearestAxis = Math.round(angle/anglePerAxis);

            d3.selectAll('.node').filter(function(data, ind) { return d3.select(this).attr('r') == 7 && ind != nearestAxis; })
                .transition().ease('quad').attr('r', 4);
            d3.selectAll('.node').filter(function(data, ind) { return d3.select(this).attr('r') == 4 && ind == nearestAxis; })
                .transition().ease('elastic').attr('r', 7);
        });
        invisibleRectangle.on('mouseout', () => d3.selectAll('.node').transition(300).attr('r', 4));
    }
}
