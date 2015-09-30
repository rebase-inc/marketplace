var React = require('react');

var d3Chart = {}

d3Chart.create = function(element, props, state) {
    // Create the svg element. This only needs to be done once. Use insert(..., ':first-child') so it goes before text
    var graph = d3.select(element).append("svg:svg")
        .attr("width", props.width + 2*props.margin)
        .attr("height", props.height + 2*props.margin)
        .append("svg:g").attr("transform", "translate(" + props.margin + "," + props.margin + ")");
    this.update(element, props, state);
};

d3Chart.update = function(element, props, state) {

    var maxYData = Math.max(d3.max(state.openTickets), d3.max(state.closedTickets));
    var scale = {
        x: d3.scale.linear().domain([0, state.openTickets.length - 1]).range([0, props.width]),
        y: d3.scale.linear().domain([0, maxYData]).range([props.height, 0]),
    }

    var line = d3.svg.line().x( function(d,i) { return scale.x(i); }).y(function(d) { return scale.y(d); });
    var graph = d3.select(element).select('g');
    for (var className of  ['openTickets', 'closedTickets']) {
        var data = className == 'openTickets' ? state.openTickets : state.closedTickets;
        var text = (cn, d, i) => {
            return (cn == 'openTickets') ?  'Offered ' + d + ' tickets on day ' + i : d + ' tickets were completed on day ' + i;
        }
        var otherData = (className == 'openTickets') ? state.closedTickets : state.openTickets; // there has to be a better way...
        graph.selectAll('.point').data(data).enter().append("text")
            .attr("x", function(d, i) { return scale.x(i) - 2; })
            .attr("y", function(d, i) {
                var offset = (d >= otherData[i]) ? -8 : 18;
                return scale.y(d) + offset;
            })
            .text((d,i) => d)
            .style('font-size', Math.floor(props.height/4))
            .attr('class', className);
        graph.append("svg:path")
            .attr("d", line(data))
            .attr('class', className);
        graph.selectAll(".point")
            .data(data)
            .enter().append("svg:circle")
            .attr("cx", function(d, i) { return scale.x(i) })
            .attr("cy", function(d, i) { return scale.y(d) })
            .attr("r", function(d, i) { return 5 })
            .style("stroke", 'transparent')
            .style("stroke-width", 30)
            .attr('class', className)
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
};

d3Chart.destroy = function(el) {
    // Any clean-up would go here
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

var bellCurve = {}

bellCurve.create = function(element, props, state) {
    var graph = d3.select(element).insert("svg:svg", ':first-child')
        .attr("width", props.width + 2*props.margin)
        .attr("height", props.height + 2*props.margin)
        .append("svg:g")
        .attr("transform", "translate(" + props.margin + "," + props.margin + ")");
    this.data = _xVals.map((x, i) => ({ q: x, p: _yVals[i]}));
    var scale = {
        x: d3.scale.linear().domain(d3.extent(_xVals)).range([0, props.width]),
        y: d3.scale.linear().domain(d3.extent(_yVals)).range([props.height, 0]),
    }
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
    this.line = d3.svg.line().x(d => scale.x(d.q)).y(d => scale.y(d.p));
    this.area = d3.svg.area().x(d => scale.x(d.q)).y0(d => scale.y(0)).y1(d => scale.y(d.p));
    this.graph = d3.select(element).select('g');

    this.cutoff = -4 + Math.round(10*8*(state.cutoff_price - state.minimum_price)/(state.maximum_price - state.minimum_price))/10;
    this.areaElement = this.graph.selectAll('path.area');
    this.areaBorder = this.graph.selectAll('path.areaBorder');
    this.areaElement.data([this.data.filter(d => d.q <= this.cutoff)]).enter().append('path')
        .attr("class", "area")
        .attr("d", this.area)
        .attr('fill', 'grey');
    this.areaBorder.data([[{q: this.cutoff, p: 0}, this.data.filter(d => Math.abs(d.q - this.cutoff) <= 0.0001)[0]]]).enter().append('path')
        .attr("class", "areaBorder")
        .attr("d", this.line)
        .attr('fill', 'none')
        .attr('stroke-width', '2px')
        .attr('stroke', 'black');

    this.update(element, props, state);

    this.graph.append("path")
        .datum(this.data)
        .attr("class", "line")
        .attr("d", this.line)
        .attr('fill', 'none')
        .attr('stroke-width', '2px')
        .attr('stroke', 'black');

};

bellCurve.update = function(element, props, state) {
    this.cutoff = -4 + Math.round(10*8*(state.cutoff_price - state.minimum_price)/(state.maximum_price - state.minimum_price))/10;
    this.graph.selectAll('path.area').data([this.data.filter(d => d.q <= this.cutoff + 0.0001)]).attr('d', this.area);
    this.graph.selectAll('path.areaBorder').data([[{q: this.cutoff, p: 0}, this.data.filter(d => Math.abs(d.q - this.cutoff) <= 0.0001)[0]]]).attr('d', this.line);
};

let donutChart = {}
donutChart.create = function(element, props, data) {

    let totalDevelopers = data.reduce((pv, cv) => pv + cv.population, 0);

    let radius = props.height / 2;
    let arcWidth = props.height / 5;

    let arc = d3.svg.arc()
        .outerRadius(d => d.data.category == 'offered' ? radius - arcWidth / 3 : radius)
        .innerRadius(d => d.data.category == 'offered' ? radius - arcWidth *2/3 : radius - arcWidth);

    let pie = d3.layout.pie().sort(null).value(function(d) { return d.population; });

    let svg = d3.select(element).insert("svg:svg", ':first-child')
        .attr("width", props.width + 2*props.margin)
        .attr("height", props.height + 2*props.margin)
        .append("svg:g")
        .attr("transform", "translate(" + props.height / 2 + "," + props.height / 2 + ")");

    if (!!totalDevelopers) {
        var g = svg.selectAll(".arc")
            .data(pie(data))
            .enter().append("g")
            .attr("class", "arc");
    } else {
        var g = svg.selectAll('.arc')
            .data(pie([{color: '#F5B651', population: 999}]))
            .enter().append('g')
            .attr('class', 'arc');
    }

    g.append('text')
        .attr('text-anchor', 'middle')
        .attr('font-size', '14px')
        .attr('fill', 'transparent')
        .attr('dy', '4px')
        .attr('class', 'percentage');

    let path = g.append("path")
        .attr("d", arc)
        .style('stroke', 'hsla(204, 45%, 98%, 1)')
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
            var x = props.height - legendSize;
            var y = i * height - offset;
            return 'translate(' + x + ',' + y + ')';
        });

    legend.append('rect')
        .attr('width', legendSize)
        .attr('height', legendSize)
        .style('fill', d => d.color)
        .style('stroke', d => d.color);

    let fontSize = props.height / 6;
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
        let percentage = !!totalDevelopers ? Math.round(100 * parentData.population / totalDevelopers) + '%' : '';
        svg.select('.percentage').text(percentage).attr('fill', parentData.color);

    });
    hoverableElements.on('mouseleave', function(d, i) {
        svg.selectAll('path,.legend').transition().style('opacity', 1.0);
        svg.select('.percentage').attr('fill', 'transparent');
    });



}


module.exports = {
    lineChart: d3Chart,
    bellCurve: bellCurve,
    donutChart: donutChart,
}
