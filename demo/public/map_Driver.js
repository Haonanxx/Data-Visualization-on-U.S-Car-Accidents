import * as d3 from 'd3';
import * as topojson from 'topojson'
import 'jquery'
//import * as line from './timeline'


/////////////////////////////////////////////////////////////
//Choropleth code
function drawMap(values){
    document.getElementById("chart").innerHTML=""
    var us = values[0];
    var data = values[1];

    //var states = new Map(us.objects.states.geometries.map(d => [d.id, d.properties]))  //🚧  explain

    //var format = d => `${d}%`

    var path = d3.geoPath()

    var color = d3.scaleQuantize([Math.log(578759), Math.log(39512223)], d3.schemeOranges[9])  //🚧  explain
    var color2 = d3.scaleQuantize([1,10], d3.schemeOranges[9])
    //original line from Observable
    //data = Object.assign(new Map(await d3.csv("unemployment.csv", ({id, rate}) => [id, +rate])), {title: "Unemployment rate (%)"})
    data = Object.assign(new Map(data.map((d) => [d.id, +d.rate])));  //🚧  explain
    console.log(data)
    data.title = "Unemployment rate (%)";

    path = d3.geoPath()

    // const svg = d3.create("svg")
    var svg=d3.select("#chart")
    var colordata=[1,2,3,4,5,6,7,8,9]
    console.log(colordata)
    svg.selectAll('rect')
        .data(colordata)
        .enter()
        .append("rect")
        .attr('x',d=>580+30*d)
        .attr('y',10)
        .attr("width", 30)
        .attr("height", 30)
        .attr('fill',d=>color2(d))
    svg.append('text')
        .attr('x',180)
        .attr('y',0)
        .text('Population in different states')
        .attr("font-size", 35)
    svg.append("text")
        .attr('x',580+30)
        .attr('y',55)
        .text('10^5')
    svg.append("text")
        .attr('x',580+30*9)
        .attr('y',55)
        .text('10^7')
    svg.append("text")
        .attr('x',580+30*5)
        .attr('y',55)
        .text('10^6')
    svg = d3.select("#chart")
        .attr("viewBox", [0, 0, 975, 610]);


    var outstatelist=[]
    svg.append("g")
        .selectAll("path")
        .data(topojson.feature(us, us.objects.states).features)  //🚧  explain
        .join("path")
        .attr("stroke", "black")
        .attr("fill", d =>{
            //console.log(data.get(d.id)%10)

            return color(Math.log(data.get(d.id)))

        })  //🚧  explain
        .attr("d", path)
        .on('click', function (d) {
            outstatelist.push(this.__data__.properties.name)
            console.log(outstatelist)
            scartchart([this.__data__.id])
            //.text(JSON.stringify(this.__data__.id, null, 2));
           // line.draw_timeline([this.__data__.properties.name])
            console.log(d)
    });


    //.text(d => `${d.properties.name}, ${states.get(d.id.slice(0, 2)).name} ${format(data.get(d.id))}`);  //🚧  explain

    svg.append("path")
        .datum(topojson.mesh(us, us.objects.states, (a, b) => a !== b))  //🚧  explain
        .attr("fill", "none")
        .attr("stroke", "black")
        .attr("stroke-linejoin", "round")
        .attr("d", path);
    //line.draw_timeline(-1)
    scartchart(-1)

}
function scartchart(list){
    document.getElementById("chart3").innerHTML=""
    var svg_chart=d3.select('#chart3')
    var height = 500
    var width = 500
    var margin = ({top: 50, right: 50, bottom: 50, left: 40})
    d3.csv('population_data.csv').then(data=>{
        var y = d3.scaleLinear()
            .domain([Math.log(10), Math.log(816825)]).nice()
            .range([height-margin.bottom, margin.top])
        var x=d3.scaleLinear()
            .domain([Math.log(578759), Math.log(39512223)]).nice()
            .range([margin.left, width-margin.right])
        var r=d3.scaleLinear()
            .domain([Math.log(578759), Math.log(39512223)]).nice()
            .range([2,10])
        var xAxis = g => g
            .attr("transform", `translate(0,${height - margin.bottom})`)
            .call(d3.axisBottom(x).ticks(width / 64).tickSizeOuter(0))
        var yAxis = g => g
            .attr("transform", `translate(${margin.left},0)`)
            .call(d3.axisLeft(y))
        svg_chart.append("g")
            .call(xAxis);
        svg_chart.append("g")
            .call(yAxis);
        svg_chart.append('text')
            .attr("transform", `translate(${width/2},${height - margin.bottom/3})`)
            .text('Population')
        svg_chart.append('text')
            .attr("transform", `translate(0,${height/2}) rotate(90)`)
            .text('num of Accidents')
        svg_chart.append('text')
            .attr('x',100)
            .attr('y',30)
            .text('the relationship between population and accidents')
        var circle=svg_chart.selectAll('circle')
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", function(d) {
                return x(Math.log(d.rate));
            })
            .attr("cy", function(d) {
                return y(Math.log(+d.accident));
            })
            .attr("r", function(d){ return r(Math.log(d.rate))})
        circle.data(data)
            .attr('fill','gray')
        console.log(data)


        if(list==-1){console.log('hello')

        }

        else{
            circle.data(data)
                .attr('fill',function(d){
                    if(d.id==list[0]){return 'red'}
                    else{return 'gray'}
                })
            for (var i=0;i<data.length;i++)
            {
                if(data[i].id==list[0]){
                    svg_chart.append("text")
                        .attr("x", x(Math.log(data[i].rate))-20)
                        .attr("y",y(Math.log(+data[i].accident))
                        )
                        .text(data[i].state)
                }
            }
        }

        console.log(data)
    })
}
export{
    drawMap,
    scartchart
}

