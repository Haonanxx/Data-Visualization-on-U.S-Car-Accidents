import * as d3 from 'd3';
//import date from "shapefile/dbf/date";
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
        document.getElementById("chartline").innerHTML=""
        var dateParse = d3.timeParse("%H:%M");
        data.date.forEach(
            function(d,i){data.date[i]=dateParse(d)}
        )
        console.log(data.date)
        var margin = ({top: 80, right: 50, bottom: 20, left: 50})
        var height = 500
        var width = 1000
        //var data = {series: [{name: "A", value: [1, 2, 3, 4]}, {name: "B", value: [2, 4, 6, 8]}], date: [1, 2, 3, 4]}
        var svg = d3.select('#chartline')
            .attr("viewBox", [0, 0, width, height]);
        svg.append('text')
            .text('Num')
            .attr("font-size", 25)

        var titletext=svg.append('text')
            .attr('x',300)
            .attr('y',40)
            .attr("font-size", 25)
        if(typeof (list[0])=='undefined')
        {titletext.text("the time line of Accident in U.S.")}
        else{
            titletext.text("the time line of Accident in "+list[0])
        }
        var x = d3.scaleTime()
            .domain([dateParse('00:01'),dateParse('23:00')])
            .range([margin.left, width - margin.right]);

        var y = d3.scaleLinear()
            .domain([0, d3.max(data.series, d => d3.max(d.value))]).nice()
            .range([height - margin.bottom, margin.top])
        var xAxis = g => g
            .attr("transform", `translate(0,${height - margin.bottom})`)
            .call(d3.axisBottom(x).ticks(width / 128).tickSizeOuter(0))

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
        svg.append('text')
            .attr("transform", `translate(0,70)`)
            .text('number of accidents')
        const path = svg.append("g")
            .attr("fill", "none")
            .attr("stroke-width", 1.5)
            .attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "round")
            .selectAll("path")
            .data(data.series)
            .join("path")
            .style("mix-blend-mode", "null")
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

            svg.append("g")
                .attr("fill", "none")
                .attr("stroke-width", 1.5)
                .attr("stroke-linejoin", "round")
                .attr("stroke-linecap", "round")
                .selectAll("path")
                .data(data.series)
                .join("path")
                .style("mix-blend-mode", "null")
                .attr("d", d => {
                    if (isInArray(list,d.name)){
                        return line(d.value)
                    }
                })
                .attr("stroke", "red");

        }

    });
}
export {
    draw_timeline
}