export default class BarChart {
    constructor(element, properties, data) {
        properties = Object.assign({
            marginLeft: 20,
            marginTop: 20,
            marginRight: 20,
            marginBottom: 20,
            width: 600,
            height: 160,
            legendHeight: 20,
        }, properties);
        properties.height = properties.height - properties.marginTop - properties.marginBottom;
        properties.width = properties.width - properties.marginLeft - properties.marginRight;

        let maxValue = Math.max(...data.map(d => d.reduce((p,c) => p+c, 0)));

        let x = d3.scale.ordinal().domain(data.map((data, ind) => ind)).rangeRoundBands([0, properties.width], 0.2);
        let y = d3.scale.linear().domain([0, Math.max(...data.map(d => d.reduce((p,c) => p+c)))]).rangeRound([properties.height, 0]);
        let color = d3.scale.ordinal().range(['#2C4866', '#5D7591', '#ADC7E5'].reverse());

        let svg = d3.select(element)
            .attr("width", properties.width + properties.marginLeft + properties.marginRight)
            .attr("height", properties.height + properties.marginTop + properties.marginBottom)
            .append("g")
            .attr("transform", "translate(" + properties.marginLeft + "," + properties.marginTop + ")");

        let day = svg.selectAll('.day')
            .data(data)
            .enter().append('g')
            .attr('transform', (data, ind) => 'translate(' + x(ind) + ',0)');

        // on its own line simply because it's confusing and should probably be cleaned up
        // returns data as [ y0, height ] where y0 is the location of the bottom of the rectangle
        // and height the height of the element 
        let formatData = (d) => d.map((el, ind, arr) => arr.slice(0, ind + 1).reduce((p,c) => p+c, 0))
        let dataCategories = properties.categories.reverse(); // hack
        day.selectAll('rect')
            .data(d => formatData(d).reverse())
            .enter().append('rect')
            .attr('width', x.rangeBand())
            .style('fill', (d,i) => color(dataCategories[i]))
            .attr('y', y(0))
            .attr('height', properties.height - y(0))
            .transition(800).delay((d, i) => 200 * (data[0].length - i))
            .attr('y', d => y(d))
            .attr('height', d => properties.height - y(d));


        let legendSpacing = properties.width / ( data[0].length + 1);
        let legend = svg.selectAll(".legend")
            .data(color.domain().slice().reverse())
            .enter().append("g")
            .attr("class", "legend")
            .attr("transform", (d, i) => 'translate(' + legendSpacing * (i+0.5) + ',' + (properties.height + properties.legendHeight/2) + ')');
        
        legend.append('rect')
            .attr('width', 10)
            .attr('height', 10)
            .style('fill', color);

        legend.append("text")
            .attr("x", 14) 
            .attr("y", 10) 
            .style('font-size', '12px')
            .style('opacity', '0.5')
            .text(d => d);

    }
}

