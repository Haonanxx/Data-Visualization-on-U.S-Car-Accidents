<template>
  <div class="d3Chart">

    <div class="title">Accidents and Time&Date&Population</div>
    <div class="sub-title">(Data from February 2016 to June 2020)</div>
    <div id="selectItem">
      Type of Map: <select class="selector" id="selector"></select>

      Choose State<select class="selector2" id="selector2"></select>
      <br/>
      <br/>
    </div>
    <svg width="500" height="500" id="chart"></svg>
    <svg width="500" height="500" id="chart3"></svg>
    <svg width="700" height="350" id="chartline"></svg>


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
  .basicMapbox {
    position: relative;
    height: 700px;
    width: 1100px;
    display: inline-block;
  }
  #map {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 100%;
  }

  .legend {
    background-color: #fff;
    border-radius: 3px;
    bottom: 30px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    font: 12px/20px 'Helvetica Neue', Arial, Helvetica, sans-serif;
    padding: 10px;
    position: absolute;
    right: 10px;
    z-index: 1;
  }

  .legend h4 {
    margin: 0 0 10px;
  }

  .legend div span {
    border-radius: 50%;
    display: inline-block;
    height: 10px;
    margin-right: 5px;
    width: 10px;
  }

  .map-button {
    font: 20px 'Helvetica Neue', Arial, Helvetica, sans-serif;
    background-color: #414040;
    color: white;
    padding: 5px 10px;
    text-align: center;
    box-shadow: 0 5px #999;
    border-radius: 10px;
    position: absolute;
    /* width: 300; */
    top: 10px;
    right: 10px;
    -webkit-transition-duration: 0.4s; /* Safari */
    transition-duration: 0.4s;
    /* padding: 10px; */
    display: inline-block;
    cursor: pointer;
  }

  .map-button:hover {
    background-color: rgb(103, 103, 103); /* Green */
    color:  white;
  }

  .map-overlay {
    font: 12px/20px 'Helvetica Neue', Arial, Helvetica, sans-serif;
    background-color: #fff;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    border-radius: 3px;
    position: absolute;
    /* width: 300; */
    top: 10px;
    left: 10px;
    padding: 10px;
    display: none;
  }

  .arc text {
    font: 20px sans-serif;
    text-anchor: middle;
  }

  .arc path {
    stroke: #fff;
  }
  .tooltip{
    position: absolute;
    display: none;
    width: auto;
    height: auto;
    background: none repeat scroll 0 0 white;
    border: 0 none;
    border-radius: 8px 8px 8px 8px;
    box-shadow: -3px 3px 15px #888888;
    color: black;
    font: 15px 'Helvetica Neue', Arial, Helvetica, sans-serif;
    padding: 5px;
    text-align: center;
  }
  .left {
    float: left;
    width: 60%;
    padding: 0 20px;
    overflow: hidden;
  }
  .right {
    /* background-color: lightblue; */
    float: left;
    width: 30%;
    padding: 20px 25px;
    margin-top: 20px;
  }

  .axis path,
  .axis line {
    fill: none;
    stroke: black;
    shape-rendering: crispEdges;
  }

  .axis text {
    font-family: Courier;
    font-size: 2em;
  }

  text {
    font-family: Courier;
    font-size: 1.5em;
  }

  div.commands {
    font-family: Courier;
    font-size: 0.85em;
    font-weight: bold;
    text-align: center;
    cursor: default;
    user-select: none;
  }

  .bar {
    fill: #FB6E51;
  }

  text.xlabel {
    text-anchor: middle;
  }

  text.ylabel {
    font-size: 2em;
    text-anchor: middle;
    alignment-baseline: central;
  }

  text.name {
    font-weight: bold;
    text-anchor: middle;
    alignment-baseline: central;
  }

  .sort {
    border-radius: 3px;
    background-color: #eee;
    display: inline-block;
    cursor: default;
  }

  .sort,
  label {
    font-family: Courier;
    color: #444;
    padding: 5px;
    margin: 5px;
  }

  label {
    vertical-align: text-bottom;
  }

  .filter {
    border-radius: 3px;
    background-color: #eee;
    padding: 5px;
    margin: 5px;
    color: #444;
    text-align: left;
    display: inline-block;
    cursor: default;
  }

  .init {
    border-radius: 3px;
    background-color: #eee;
    padding: 5px;
    margin: 5px;
    color: #444;
    text-align: left;
    display: inline-block;
    cursor: default;
  }
  .slider {
    -webkit-appearance: none;
    width: 190px;
    height: 15px;
    border-radius: 5px;
    background: #d3d3d3;
    outline: none;
    opacity: 0.7;
    -webkit-transition: .2s;
    transition: opacity .2s;
  }

  .slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 25px;
    height: 25px;
    border-radius: 50%;
    background: #4CAF50;
    cursor: pointer;
  }

  .slider::-moz-range-thumb {
    width: 25px;
    height: 25px;
    border-radius: 50%;
    background: #4CAF50;
    cursor: pointer;
  }
  .y-axis{
    font-size: 24px;
  }

  text.name,
  text.value {
    text-anchor: middle;
    fill: black;
    font-size: 0.5em;
  }

  #chart {
    width: 100%;
    height: 350px;
    background-color: #ffeeee;
  }



  #selectItem{ margin:1 ; width:500px; height:20px;}

</style>