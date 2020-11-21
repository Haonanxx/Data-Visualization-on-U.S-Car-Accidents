import * as d3 from 'd3';
function isInArray(arr,value){
    for(var i = 0; i < arr.length; i++){
        if(value === arr[i]){
            return true;
        }
    }
    return false;
}

function draw_timeline(list){
    d3.json("line_chart.json").then(data => {
        var dateParse = d3.timeParse("%Y-%m");
        data.date.forEach(
            function(d,i){data.date[i]=dateParse(d)}
        )
        console.log(data.date)
        var margin = ({top: 10, right: 30, bottom: 30, left: 40})
        var height = 300
        var width = 1000
        //var data = {series: [{name: "A", value: [1, 2, 3, 4]}, {name: "B", value: [2, 4, 6, 8]}], date: [1, 2, 3, 4]}
        var svg = d3.select('#chart4')
            .attr("viewBox", [0, 0, width, height]);
        var x = d3.scaleUtc()
            .domain(d3.extent(data.date))
            .range([margin.left, width - margin.right])
        var y = d3.scaleLinear()
            .domain([0, d3.max(data.series, d => d3.max(d.value))]).nice()
            .range([height - margin.bottom, margin.top])
        var xAxis = g => g
            .attr("transform", `translate(0,${height - margin.bottom})`)
            .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0))
        var yAxis = g => g
            .attr("transform", `translate(${margin.left},0)`)
            .call(d3.axisLeft(y))
            .call(g => g.select(".domain").remove())
            .call(g => g.select(".tick:last-of-type text").clone()
                .attr("x", 3)
                .attr("text-anchor", "start")
                .attr("font-weight", "bold")
                .text(data.y))
        var line = d3.line()
            .x((d, i) => x(data.date[i]))
            .y(d => y(d))

        svg.append("g")
            .call(xAxis);
        svg.append("g")
            .call(yAxis);
        const path = svg.append("g")
            .attr("fill", "none")
            .attr("stroke-width", 1.5)
            .attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "round")
            .selectAll("path")
            .data(data.series)
            .join("path")
            .style("mix-blend-mode", "multiply")
            .attr("d", d => line(d.value))
            .attr("stroke", "steelblue");
        if(list==-1){
            path.attr("stroke","steelblue")
        }
        else{
            path.style("mix-blend-mode", null).attr('stroke',d=>{
                    if(isInArray(list,d.name))
                    {return "red"}
                    else{return "#f1f1f1"}
                })
        }

        console.log(path)
        console.log(isInArray([1,2],1))

    });
}
export {
    draw_timeline
}