import * as d3 from 'd3';
import * as topojson from 'topojson'
import 'jquery'
import * as rect from './rect'


/////////////////////////////////////////////////////////////
//Choropleth code
function drawMap(values){
    var us = values[0];
    var data = values[1];

    //var states = new Map(us.objects.states.geometries.map(d => [d.id, d.properties]))  //🚧  explain

    //var format = d => `${d}%`

    var path = d3.geoPath()

    var color = d3.scaleQuantize([1, 10], d3.schemeBlues[9])  //🚧  explain

    //original line from Observable
    //data = Object.assign(new Map(await d3.csv("unemployment.csv", ({id, rate}) => [id, +rate])), {title: "Unemployment rate (%)"})
    data = Object.assign(new Map(data.map((d) => [d.id, +d.rate])));  //🚧  explain
    data.title = "Unemployment rate (%)";

    path = d3.geoPath()

    // const svg = d3.create("svg")
    var svg = d3.select("#chart")
        .attr("viewBox", [0, 0, 975, 610]);



    svg.append("g")
        .selectAll("path")
        .data(topojson.feature(us, us.objects.states).features)  //🚧  explain
        .join("path")
        .attr("fill", d => color(d.id%10+1))  //🚧  explain
        .attr("d", path)
        .on('click', function (d) {

            //.text(JSON.stringify(this.__data__.id, null, 2));
            rect.draw_Bar(this.__data__.id, this.__data__.properties.name);

            console.log(d)
    });


    //.text(d => `${d.properties.name}, ${states.get(d.id.slice(0, 2)).name} ${format(data.get(d.id))}`);  //🚧  explain

    svg.append("path")
        .datum(topojson.mesh(us, us.objects.states, (a, b) => a !== b))  //🚧  explain
        .attr("fill", "none")
        .attr("stroke", "white")
        .attr("stroke-linejoin", "round")
        .attr("d", path);
}

export{
    drawMap
}

