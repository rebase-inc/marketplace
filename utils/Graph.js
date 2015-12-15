var React = require('react');

export class LineChart {
    constructor(element, dimensions, data) {
        this.graph = d3.select(element).append("svg:svg")
        .attr("width", dimensions.width + 2*dimensions.margin)
        .attr("height", dimensions.height + 2*dimensions.margin)
        .append("svg:g").attr("transform", "translate(" + dimensions.margin + "," + dimensions.margin + ")");

        // if this were later broken out to have an update method, it would probably start here
        var maxYData = Math.max(d3.max(data.openTickets), d3.max(data.closedTickets));
        var scale = {
            x: d3.scale.linear().domain([0, data.openTickets.length - 1]).range([0, dimensions.width]),
            y: d3.scale.linear().domain([0, maxYData]).range([dimensions.height, 0]),
        }

        var line = d3.svg.line().x( function(d,i) { return scale.x(i); }).y(function(d) { return scale.y(d); });
        var graph = d3.select(element).select('g');
        for (var className of  ['openTickets', 'closedTickets']) {
            var currentData = className == 'openTickets' ? data.openTickets : data.closedTickets;
            var text = (cn, d, i) => {
                return (cn == 'openTickets') ?  'Offered ' + d + ' tickets on day ' + i : d + ' tickets were completed on day ' + i;
            }
            var otherData = (className == 'openTickets') ? data.closedTickets : data.openTickets; // there has to be a better way...
            graph.selectAll('.point').data(currentData).enter().append("text")
                .attr("x", function(d, i) { return scale.x(i) - 2; })
                .attr("y", function(d, i) {
                    var offset = (d >= otherData[i]) ? -8 : 18;
                    return scale.y(d) + offset;
                })
                .text((d,i) => d)
                .style('font-size', Math.floor(dimensions.height/4))
                .attr('class', className);
            graph.append("svg:path")
                .attr("d", line(currentData.map(d => 0)))
                .transition(800).delay(100)
                .attr("d", line(currentData))
                .attr('class', className);
            graph.selectAll(".point")
                .data(currentData)
                .enter().append("svg:circle")
                .attr("cx", function(d, i) { return scale.x(i) })
                .attr("r", function(d, i) { return 5 })
                .style("stroke", 'transparent')
                .style("stroke-width", 30)
                .attr('class', className)
                .attr("cy", function(d, i) { return scale.y(0) })
                .transition(800).delay(100)
                .attr("cy", function(d, i) { return scale.y(d) });
            graph.selectAll(".point")
                .on("mouseover", function(d,i) {
                    d3.select(this).transition()
                        .ease("elastic")
                        .duration("400")
                        .attr("r", 7)
                        .select('text')
                        .style({opacity: '1'});
                })
                .on("mouseout", function(d,i) {
                    d3.select(this).transition()
                        .ease("quad")
                        .delay("100")
                        .duration("200")
                        .attr("r", 5)
                        .select('text')
                        .style({opacity: '0'});
                });

        }
    }
};

var _xVals = [-4, -3.75, -3.5, -3.25, -3, -2.75, -2.5, -2.25, -2, -1.75, -1.5, -1.25, -1,
    -0.75, -0.5, -0.25, 0, 0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 2.25, 2.5, 2.75, 3, 3.25, 3.5, 3.75, 4]
var _xVals = [-4, -3.9, -3.8, -3.7, -3.6, -3.5, -3.4, -3.3, -3.2, -3.1, -3, -2.9, -2.8, -2.7, -2.6, -2.5, -2.4,
    -2.3, -2.2, -2.1, -2, -1.9, -1.8, -1.7, -1.6, -1.5, -1.4, -1.3, -1.2, -1.1, -1, -0.9, -0.8, -0.7, -0.6, -0.5,
    -0.4, -0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7,
    1.8, 1.9, 2, 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 2.9, 3, 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 3.9, 4]

var _yVals = [0.00481007105373589, 0.00588403333648915, 0.0071611532738489, 0.008671116590926, 0.0104460306085229,
    0.0125202146382632, 0.0149298851255644, 0.0177127245897184, 0.0209073257351149, 0.0245525052753891, 0.0286864860292165,
    0.0333459506730553, 0.0385649760808487, 0.0443738632961124, 0.0507978846636383, 0.057855976237649, 0.065559409974363,
    0.0739104860663593, 0.0829012907186121, 0.09251256833278, 0.102712759106335, 0.113457253156541, 0.124687910201,
    0.136332889408507, 0.148306827225143, 0.160511391851549, 0.172836231799388, 0.185160322921838, 0.197353703953215,
    0.20927957547588, 0.220796722013619, 0.231762202340904, 0.242034239826277, 0.251475233403071, 0.259954801225345,
    0.267352763760264, 0.273561971388723, 0.278490883762357, 0.282065814235901, 0.284232762499063, 0.284958771715309,
    0.284232762499063, 0.282065814235901, 0.278490883762357, 0.273561971388723, 0.267352763760264, 0.259954801225345,
    0.251475233403071, 0.242034239826277, 0.231762202340904, 0.220796722013619, 0.20927957547588, 0.197353703953215,
    0.185160322921838, 0.172836231799388, 0.160511391851548, 0.148306827225143, 0.136332889408507, 0.124687910201,
    0.113457253156541, 0.102712759106334, 0.0925125683327799, 0.082901290718612, 0.0739104860663592, 0.0655594099743629,
    0.0578559762376489, 0.0507978846636382, 0.0443738632961124, 0.0385649760808486, 0.0333459506730553, 0.0286864860292165,
    0.0245525052753891, 0.0209073257351149, 0.0177127245897184, 0.0149298851255644, 0.0125202146382633, 0.0104460306085229,
    0.00867111659092601, 0.00716115327384891, 0.00588403333648916, 0.0048100710537359]

let _BellCurveData = _xVals.map((x, ind) => ({ x: x, y: _yVals[ind] }));

export class BellCurve {
    constructor(element, dimensions, defaultValue) {
        dimensions.width = dimensions.width || 240;
        dimensions.height = dimensions.height || 50;
        dimensions.margin = dimensions.margin || 18;

        this.min = dimensions.min || 100;
        this.max = dimensions.max || 2000;
        defaultValue = Math.min(defaultValue, this.max);

        this.data = _BellCurveData;

        let graph = d3.select(element).insert("svg:svg", ':first-child')
            .attr("width", dimensions.width + 2*dimensions.margin)
            .attr("height", dimensions.height + 2*dimensions.margin)
            .append("svg:g")
            .attr("transform", "translate(" + dimensions.margin + "," + dimensions.margin + ")");
        this.graph = d3.select(element).select('g');

        let scale = {
            x: d3.scale.linear().domain(d3.extent(_xVals)).range([0, dimensions.width]),
            y: d3.scale.linear().domain(d3.extent(_yVals)).range([dimensions.height, 0]),
        }

        // Add some text
        graph.append('svg:text')
            .attr('x', scale.x(0))
            .attr('y', scale.y(0) + 10)
            .attr('text-anchor', 'middle')
            .attr('font-size', '8px')
            .text('developer talent pool');
        graph.append('svg:text')
            .attr('x', scale.x(-4))
            .attr('y', scale.y(0) + 10)
            .attr('text-anchor', 'start')
            .attr('font-size', '10px')
            .text('novice');
        graph.append('svg:text')
            .attr('x', scale.x(4))
            .attr('y', scale.y(0) + 10)
            .attr('text-anchor', 'end')
            .attr('font-size', '10px')
            .text('expert');

        // Figure out the current cutoff in our coordinate system
        this.cutoff = -4 + Math.round(10*8*(defaultValue - this.min)/(this.max - this.min))/10;

        // Create the line plot
        this.line = d3.svg.line().x(data => scale.x(data.x)).y(data => scale.y(data.y));

        // Create the area plot...Not sure if all three of these elements are needed. TODO: Clean up
        this.area = d3.svg.area().x(data => scale.x(data.x)).y0(data => scale.y(0)).y1(data => scale.y(data.y));
        this.areaElement = this.graph.selectAll('path.area');
        this.areaBorder = this.graph.selectAll('path.areaBorder');

        // Make the area fill stop at the cutoff
        this.areaElement.data([this.data.filter(data => data.x <= this.cutoff)]).enter().append('path')
            .attr("class", "area")
            .attr("d", this.area)
            .attr('fill', 'grey');

        this.areaBorder.data([[{x: this.cutoff, y: 0}, this.data.filter(data => Math.abs(data.x - this.cutoff) <= 0.0001)[0]]]).enter().append('path')
            .attr("class", "areaBorder")
            .attr("d", this.line)
            .attr('fill', 'none')
            .attr('stroke-width', '2px')
            .attr('stroke', 'black');

        // Update the data
        this.update(defaultValue);

        this.graph.append("path")
            .datum(this.data)
            .attr("class", "line")
            .attr("d", this.line)
            .attr('fill', 'none')
            .attr('stroke-width', '2px')
            .attr('stroke', 'black');
    }

    update(value) {
        // Update the cutoff
        this.cutoff = -4 + Math.round(10*8*(value - this.min)/(this.max - this.min))/10;

        // Update the area fill
        this.graph.selectAll('path.area').data([this.data.filter(data => data.x <= this.cutoff + 0.0001)]).attr('d', this.area);

        // Update the area border
        this.graph.selectAll('path.areaBorder').data([[{x: this.cutoff, y: 0}, this.data.filter(data => Math.abs(data.x - this.cutoff) <= 0.0001)[0]]]).attr('d', this.line);
    }

};

// TODO: Expand this into constructor and update methods
export class DonutChart {
    constructor(element, dimensions, data) {
        let svg = d3.select(element).insert("svg:svg", ':first-child')
            .attr("width", dimensions.width + 2*dimensions.margin)
            .attr("height", dimensions.height + 2*dimensions.margin)
            .append("svg:g")
            .attr("transform", "translate(" + dimensions.height / 2 + "," + dimensions.height / 2 + ")");

        const totalOfAllCategories = data.reduce((prev, curr) => prev + curr.population, 0);
        data = !!totalOfAllCategories ? data : [{ color: '#F5B651', population: 1 }];

        let radius = dimensions.height / 2;
        let arcWidth = dimensions.height / 5;

        let arc = d3.svg.arc()
            .outerRadius(d => d.data.category == 'approved' ? radius - arcWidth / 3 : radius)
            .innerRadius(d => d.data.category == 'approved' ? radius - arcWidth *2/3 : radius - arcWidth);

        let pie = d3.layout.pie().sort(null).value(function(d) { return d.population; });

        const dataForNullCase = [{color: '#F5B651', population: 1 }];
        let g = svg.selectAll('.arc').data(pie(data)).enter().append('g').attr('class', 'arc');

        g.append('text')
            .attr('text-anchor', 'middle')
            .attr('font-size', '12px')
            .attr('fill', 'transparent')
            .attr('dy', '4px')
            .attr('class', 'percentage');

        g.append("path")
            .attr('d', arc)
            .attr('class', 'matchesHoverState')
            .style('stroke-width', '2px')
            .style("fill", d => d.data.color);

        let legendSize = 8;
        let legendSpacing = 8;
        let legend = svg.selectAll('.legend')
            .data(data)
            .enter()
            .append('g')
            .attr('class', 'legend')
            .attr('transform', function(d, i) {
                var height = legendSize + legendSpacing;
                var offset =  height * 3 / 2;
                var x = dimensions.height - 2*legendSize;
                var y = i * height - offset;
                return 'translate(' + x + ',' + y + ')';
            });

        legend.append('rect')
            .attr('width', legendSize)
            .attr('height', legendSize)
            .style('fill', d => d.color)
            .style('stroke', d => d.color);

        let fontSize = dimensions.height / 5.5;
        legend.append('text')
            .text(d => d.population + ' ' + d.category)
            .attr('font-size', fontSize)
            .style('fill', d => d.color)
            .attr('transform', () => 'translate(' + (legendSize + fontSize) + ',' + legendSize + ')');

        let hoverableElements = svg.selectAll('path,.legend');
        hoverableElements.on('mouseover', function(d,i) {
            var parentData = d.data || d;
            svg.selectAll('path,.legend').transition().style('opacity',function (data) {
                let childCategory = !!data.data ? data.data.category : data.category;
                return (parentData.category == childCategory) ? 1.0 : 0.35;
            });
            let percentage = !!totalOfAllCategories ? Math.round(100 * parentData.population / totalOfAllCategories) + '%' : '';
            svg.select('.percentage').text(percentage).attr('fill', parentData.color);

        });
        hoverableElements.on('mouseleave', function(d, i) {
            svg.selectAll('path,.legend').transition().style('opacity', 1.0);
            svg.select('.percentage').attr('fill', 'transparent');
        });
    }
}
