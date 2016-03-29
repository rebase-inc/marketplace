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
        let arcWidth = dimensions.height / 7;

        let arc = d3.svg.arc()
            .outerRadius(d => d.data.category == 'approved' ? radius - arcWidth / 3 : radius)
            .innerRadius(d => d.data.category == 'approved' ? radius - arcWidth * 2/3 : radius - arcWidth);

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
