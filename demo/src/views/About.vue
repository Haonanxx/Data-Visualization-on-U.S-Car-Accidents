<template>
  <div class="d3Chart">

    <div class="title">Accidents and Drivers</div>
    <div class="sub-title">(Data from February 2016 to June 2020)</div>
    <svg width="500" height="500" id="chart"></svg><svg width="500" height="500" id="chart3"></svg>

    <div>
      <div id="calander"></div>
      <svg id="maphead"></svg>
      <svg id="chart4"></svg>
    </div>
  </div>
</template>

<script>

  import * as d3 from 'd3';
  import * as yixiang from '../../public/map_Driver.js'
  import * as cland from '../../public/clander.js'
  import * as barchart from '../../public/barchart.js'
  cland.draw_clander()
  export default {
    name: 'd3Chart',
    data: function () {
      return {
        chartData: null,
      }
    },
    methods: {
      barChart() {
        var svg = d3.select('#chart');
        var sel = svg.selectAll('rect')
                .data(this.chartData)
                .enter();

        sel.append('rect')
                .attr('x', 100)
                .attr('y', (d, i) => 20 + i * 25)
                .attr('width', d => d.value / 1000)
                .attr('class', 'bar');

        sel.append('text')
                .attr('x', 90)
                .attr('y', (d, i) => 30 + i * 25)
                .attr('class', 'label')
                .text(d => d.label);

        sel.append('text')
                .attr('x', d => 90 + d.value / 1000)
                .attr('y', (d, i) => 30 + i * 25)
                .attr('class', 'value')
                .text(d => Number(d.value).toLocaleString());
      }
    },
    mounted: function () {
      var promises = [];

      promises.push(d3.json("counties-albers-10m.json"));
      promises.push(d3.csv("population_state.csv"));

      Promise.all(promises).then(function (values) {  //🚧  explain
        yixiang.drawMap(values)
      });
      barchart.drawbarchart()
    }


  }
</script>

<!-- "scoped" attribute limits CSS to this component only -->
<style scoped>




  .title {
    margin-bottom: 0px;
    font-size: 24px;
  }
  .axis path,
  .axis line {
    shape-rendering: crispEdges;
  }

  .axis text {
    fill: black;
  }

  text.name,
  text.gravity {
    text-anchor: middle;
    fill: black;
    font-size: 0.5em;
  }

  #chart4 {
    width: 100%;
    height: 350px;
    background-color: #ffeeee;
  }

</style>
