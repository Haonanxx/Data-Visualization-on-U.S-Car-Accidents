<template>
  <div class="d3Chart">

    <div class="title">Accidents and Time&Date&Drivers</div>
    <div class="sub-title">(Data from February 2016 to June 2020)</div>
    <div id="selectItem">
      Type of Map: <select class="selector" id="selector"></select>

      Choose State<select class="selector2" id="selector2"></select>
      <br/>
      <br/>
    </div>
    <svg width="500" height="500" id="chart"></svg><svg width="500" height="500" id="chart3"></svg>
    <svg width="800" height="400" id="chartline"></svg>

    <div>
      <br/><br/><br/><br/><br/><br/><br/><br/>

      <div id="calanderdiv"><svg id="calander" height="50" width="1000"></svg></div>
      <div><svg id="bar" height="50" width="1000"></svg></div>
      <svg id="maphead"></svg>
      <div id="chart4"></div>
    </div>

  </div>
</template>

<script>

  import * as d3 from 'd3';
  import * as yixiang from '../../public/map_Driver.js'
  //import * as cland from '../../public/clander.js'
  //import * as barchart from '../../public/barchart.js'
  import * as yixiang2 from '../../public/map.js'
  import $ from "jquery";
  //import * as lines from "../../public/timeline";
  import * as lines from '../../public/timeline.js'
  import * as cland from '../../public/clander.js'
  //import * as lines from "../../public/timeline";
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
      $(".selector2").val("pxx");

      $(".selector2").append(`<option value='U.S.'>U.S.</option>`);

      d3.csv('population_state.csv').then(function(data){
        for(var i=0;i<data.length;i++){
          if(data[i].state!="Arkansas")
          {var state=data[i].state
            $(".selector2").append(`<option value=${data[i].id}>${state}</option>`);}
        }

      })
      $(".selector2").on("change",function(){
        if($(".selector2").find("option:selected").text()=="U.S."){
          lines.draw_timeline(-1)
        }
        else{
          //alert($(".selector").find("option:selected").text())
          lines.draw_timeline([$(".selector2").find("option:selected").text()])}
        yixiang.scartchart([$(".selector2").val()])
      })





      $(".selector").append(`<option value="Accident">Num of Accidents</option>`);
      $(".selector").append(`<option value="Population">Population</option>`)
      $(".selector").on("change",function(){
        if($(".selector").find("option:selected").text()=="Num of Accidents"){
          var promises = [];

          promises.push(d3.json("counties-albers-10m.json"));
          promises.push(d3.csv("ch_Data.csv"));

          Promise.all(promises).then(function (values) {  //🚧  explain
            yixiang2.drawMap(values)
            //console.log(values)
          });

        }
        else{
          promises = [];
          promises.push(d3.json("counties-albers-10m.json"));
          promises.push(d3.csv("population_state.csv"));

          Promise.all(promises).then(function (values) {  //🚧  explain
            yixiang.drawMap(values)
          });
      }})

      var promises = [];
      promises.push(d3.json("counties-albers-10m.json"));
      promises.push(d3.csv("ch_Data.csv"));

      Promise.all(promises).then(function (values) {  //🚧  explain
        yixiang2.drawMap(values)
      });
      cland.draw_clander()
      lines.draw_timeline(-1)

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
  }


  #selectItem{ margin:1 ; width:500px; height:20px;}

</style>