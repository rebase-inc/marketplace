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

            graph.selectAll('.point').data(data).enter().append("text")
                .attr("x", function(d, i) { return scale.x(i) - 2; })
                .attr("y", function(d, i) { return scale.y(d) - 8; })
                .text((d,i) => d)
                .style('font-size', Math.floor(props.height/4))
                .attr('class', className); 
    }
};

d3Chart.destroy = function(el) {
    // Any clean-up would go here
};

module.exports = {
    lineChart: d3Chart,
}
