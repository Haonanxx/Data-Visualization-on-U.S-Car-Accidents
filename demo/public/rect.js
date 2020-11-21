import * as d3 from 'd3';
function draw_Bar(id,name){
        console.log(id,name);
        d3.json("rect.json").then(data =>{
            console.log('hhh')
            console.log(data);
            var data_use=data[id];
            var svg = d3.select("#chart3");

            svg.append("rect")

            svg.select('rect')
                .attr("x", 200)
                .attr("y", 400-data_use*20)
                .attr("width", 50)
                .attr("height", data_use*20);
            svg.append('text')
            svg.select('text')
                .attr("x",200)
                .attr('y',400-data_use*20-10)
                .text(name)

        });




}
export {
    draw_Bar
}