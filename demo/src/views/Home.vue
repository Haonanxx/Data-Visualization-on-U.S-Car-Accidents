<template>
  <div class="d3Chart">

    <div class="title">Accidents and Time&Date</div>
    <div class="sub-title">(Data from February 2016 to June 2020)</div>
    <div id="selectItem">
      <select class="selector" id="selector"></select>
      <br/>
      <br/>
    </div>
    <!--svg width="500" height="500" id="chart">
    </--svg--><svg width="800" height="400" id="chart3"></svg>

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
  //import * as yixiang from '../../public/map.js'
  import * as lines from '../../public/timeline.js'
  import * as cland from '../../public/clander.js'
  import $ from 'jquery'
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
      $(".selector").val("pxx");

      $(".selector").append(`<option value='U.S.'>U.S.</option>`);

      d3.csv('population_state.csv').then(function(data){
        for(var i=0;i<data.length;i++){
          if(data[i].state!="Arkansas")
          {var state=data[i].state
          $(".selector").append(`<option value=${state}>${state}</option>`);}
        }

      })
      $(".selector").on("change",function(){
        if($(".selector").find("option:selected").text()=="U.S."){
          lines.draw_timeline(-1)
        }
        else{
          //alert($(".selector").find("option:selected").text())
        lines.draw_timeline([$(".selector").find("option:selected").text()])}
      })

      console.log('mounted');
      cland.draw_clander()
      lines.draw_timeline(-1)
      var promises = [];

      promises.push(d3.json("counties-albers-10m.json"));
      promises.push(d3.csv("ch_Data.csv"));

      Promise.all(promises).then(function (values) {  //🚧  explain
        //yixiang.drawMap(values)
        console.log(values)
      });

    }
  }
</script>

<!-- "scoped" attribute limits CSS to this component only -->
<style scoped>
  >>> text.label {  /* need to add >>> to gets passed to d3 because vue creates new mapping */
    text-anchor: end;
    alignment-baseline: middle;
    font-size: 24px;
    fill: black;
  }

  >>> text.value {
    font-family: 'Courier New', Courier, monospace;
    font-weight: bolder;
    font-size: 12px;
    text-anchor: end;
    alignment-baseline: middle;
    fill: #eee;
  }

  >>> rect.bar {
    text-align: right;  /* pull value text to the end of the bar */
    vertical-align: middle;  /* align value text with middle of the bar */
    fill:#7abcff;
    height: 20px;  /* bar height, this can stay fixed */
  }


  .title {
    margin-bottom: 0px;
    font-size: 24px;
  }
  #selectItem{ margin:1 ; width:320px; height:100px;}
</style>
