import * as d3 from 'd3';
import * as topojson from 'topojson'
import 'jquery'

import * as line from './timeline'


/////////////////////////////////////////////////////////////
//Choropleth code
function drawMap(values){
    var us = values[0];
    var data = values[1];

    //var states = new Map(us.objects.states.geometries.map(d => [d.id, d.properties]))  //🚧  explain

    //var format = d => `${d}%`

    var path = d3.geoPath()

    var color = d3.scaleQuantize([1, Math.log(820000)], d3.schemeBlues[9])  //🚧  explain

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
        .attr('fill',d=>color(d*Math.log(820000)/9))
    svg.append('text')
        .attr('x',180)
        .attr('y',0)
        .text('the number of accidents in different states')
        .attr("font-size", 35)
    svg.append("text")
        .attr('x',580+30)
        .attr('y',55)
        .text('10')
    svg.append("text")
        .attr('x',580+30*9)
        .attr('y',55)
        .text('10^6')
    svg.append("text")
        .attr('x',580+30*5)
        .attr('y',55)
        .text('10^3')
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
            //.text(JSON.stringify(this.__data__.id, null, 2));
            line.draw_timeline([this.__data__.properties.name])
            console.log(d)
    });


    //.text(d => `${d.properties.name}, ${states.get(d.id.slice(0, 2)).name} ${format(data.get(d.id))}`);  //🚧  explain

    svg.append("path")
        .datum(topojson.mesh(us, us.objects.states, (a, b) => a !== b))  //🚧  explain
        .attr("fill", "none")
        .attr("stroke", "black")
        .attr("stroke-linejoin", "round")
        .attr("d", path);
    line.draw_timeline(-1)

}

export{
    drawMap
}

