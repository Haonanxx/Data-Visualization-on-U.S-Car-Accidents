import * as d3 from 'd3';
//D3 data join
function drawPieChart(state){
    d3.csv('state_road_condition.csv', d => {
        d.value = +d.state;
        d.condition = d.Condition;
        return d;
    }).then(data => {
        var svg = d3.select('#pie_chart'),
            width = +svg.attr('width'),
            height = +svg.attr('height'),
            radius = Math.min(width, height) / 2,
            g = svg.append('g')
                .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');
    
        var div = d3.select("body")
            .append("div")
            .attr("class", "tooltip");
    
        var color = d3.scaleOrdinal(["#88CCEE", "#882255", "#332288", "#117733", "#44AA99", "#CC6677", "#DDCC77", "#AA4499", "#b2df8a", "#865EDA"]);
        //pie layout
        var pie = d3.pie()
            .value(d => {
                return d.value
            })
            .sortValues(d3.descending);
    
        var path = d3.arc()
            .outerRadius(radius)
            .innerRadius(radius - 90);
    
        var arc = g.selectAll('.arc')
            .data(pie(data))
            .enter()
            .append('g')
            .attr('class', 'arc');
    
        var conditions = []
        var total_value = 0; //size of this slice
        pieData = pie(data);
        filteredPieData = pieData.filter(filterData);
    
        function filterData(element, index) {
            total_value += element.value;
            if (element.value > 0) {
                conditions.push(element.data.Condition)
            }
            return (element.value > 0);
        }
    
        arc.append('path')
            .attr('d', path)
            .attr('fill', d => color(d.data.condition))
            .attr("cursor", "pointer")
            .on('mousemove', function (d, i) {
                var percent = this.__data__.value / total_value * 100
                d3.select(this).transition()
                    .duration('50')
                    .attr('opacity', '.7');
                div.style("display", "none");
                div.html("road condition: " + this.__data__.data.condition + "</br>" + "percentage: " + percent.toFixed(2) + '%')
                    .style("left", (d.pageX + 12) + "px")
                    .style("top", (d.pageY - 10) + "px")
                    .style("opacity", 1)
                    .style("display", "block");
            })
            .on('mouseout', function (d, i) {
                d3.select(this).transition()
                    .duration('50')
                    .attr('opacity', '1');
                div.html(" ").style("display", "none");
            })
    
        var legend = g.selectAll('legend_colors')
            .data(color.domain())
            .enter()
    
        legend.append('circle')
            .attr('cx', -50)
            .attr('cy', function (d, i) {
                return i * 25 - 110;
            })
            .attr('r', '.5rem')
            .style('fill', function (d) {
                if (conditions.includes(d)) {
                    return color(d);
                }
                else {
                    return "#D0CED2"
                }
            })
    
        legend.append('text')
            .attr('x', -20)
            .attr('y', function (d, i) {
                return i * 25 - 105;
            })
            .text(d => d)
            .style('fill', function (d) {
                if (conditions.includes(d)) {
                    return "black";
                }
                else {
                    return "#D0CED2"
                }
            })
    });
}
export{
    drawPieChart
}