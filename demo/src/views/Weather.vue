<template>
  <div class="d3chart">
    <div class="title">Accidents and Weather</div>
    <div class="commands">
      <span class="sort" id="accidents">Sort by Number of Accidents</span>
      <span class="sort" id="temperature">Sort by Temperature</span>
      <span class="sort" id="visibility">Sort by Visibility</span>
      <span class="sort" id="reset">Reset</span>
    </div>
    <svg width="1600" height="1600" id="chart"></svg>
  </div>
</template>

<script>

import * as d3 from 'd3';

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
        .attr('y', 50)
        .attr('x', (d, i) => 20 + 3*i * 10)
        .attr('height', d => d.accidents / d.population * 10000 + 100 )
        .attr('class', 'bar3');
      
      sel.append('rect')
        .attr('y', 50)
        .attr('x', (d, i) => 20 + (3*i+1) * 10)
        .attr('height', d => d.temperature * 4 )
        .attr('class', 'bar');

      sel.append('rect')
        .attr('y', 50)
        .attr('x', (d, i) => 20 + (3*i+2) * 10)
        .attr('height', d => d.visibility * 100 - 750)
        .attr('class', 'bar2');

      sel.append('text')
        .attr('y', 40)
        .attr('x', (d, i) => 30 + (3*i+1) * 10)
        .attr('class', 'label')
        .text(d => d.state);

      var legend = svg.selectAll('.legend')
        .data(this.chartData)
        .enter().append('g')
        .attr('class', 'legend');
      
      legend.append('rect')
        .attr('x', 1100)
        .attr('y', 450)
        .attr('width', 20)
        .attr('height', 10)
        .style('fill', '#7abcff')

      legend.append('text')
        .attr('x',1130)
        .attr('y', 460)
        .text('Average Temperature')
      
      legend.append('rect')
        .attr('x', 1100)
        .attr('y', 430)
        .attr('width', 20)
        .attr('height', 10)
        .style('fill', '#e9c050')

      legend.append('text')
        .attr('x',1130)
        .attr('y', 440)
        .text('Weighted Number (by population) of Accidents')

      legend.append('rect')
        .attr('x', 1100)
        .attr('y', 470)
        .attr('width', 20)
        .attr('height', 10)
        .style('fill', '#e95050')

      legend.append('text')
        .attr('x',1130)
        .attr('y', 480)
        .text('Average Visibility')

      //sel.append('text')
        //.attr('x', d => 90 + d.temperature )
        //.attr('y', (d, i) => 30 + 2*i * 25)
        //.attr('class', 'value')
        //.text(d => Number(d.temperature).toLocaleString());

      //sel.append('text')
      //  .attr('x', d => 90 + d.humidity )
      //  .attr('y', (d, i) => 30 + (2*i+1) * 25)
      //  .attr('class', 'value')
      //  .text(d => Number(d.humidity).toLocaleString());
    },
    sort(mode){
        if (mode === '#accidents') {
          this.chartData.sort((a, b) => d3.descending((a.accidents/a.population),(b.accidents/b.population)));
        } else if (mode === '#temperature') {
          this.chartData.sort((a, b) => d3.descending(a.temperature, b.temperature));
        } else if (mode === '#visibility') {
          this.chartData.sort((a, b) => d3.descending(a.visibility, b.visibility));
        }
        //x.domain(current.map(d => d.state));
        //sortMode = mode;
    },
    toggleSort(id){
      d3.selectAll('.sort')
        .style('background-color', '#eee');
      d3.select(id)
        .style('background-color', 'aqua');
    },
    transition(){
      var delay = function (d, i) {
        return i * 50;
      };
      var svg=d3.select('#chart');
      var transition = svg.transition()
        .duration(750);

      transition.selectAll('rect')
        .delay(delay);
    }
  },
  mounted: function () {
    console.log('mounted');
    
    if (!this.$store.state.vueChartData) {
      d3.csv('weather.csv', function(d){
        return{
          state: d.state,
          temperature: +d.temperature,
          humidity: +d.humidity,
          accidents: +d.accidents,
          population: +d.population,
          visibility: +d.visibility,
        };
      }).then(data => {
        data=data.sort((a,b)=>d3.descending((a.accidents/a.population),(b.accidents/b.population)))
        console.log(data)
        this.chartData = data;
        console.log('chartData set from file');
        console.log('chartData contains', this.chartData.length, 'rows');
        this.$store.commit('vueChartData', this.chartData);

        this.sort('#accidents');
        this.toggleSort('#accidents');
        this.barChart();
        });
    } else {
      this.chartData = this.$store.state.vueChartData;
      console.log('chartData set from store');
      console.log('chartData contains', this.chartData.length, 'rows');
      this.barChart();
    }


  }
}
</script>

<!-- "scoped" attribute limits CSS to this component only -->
<style scoped>
>>> text.label {  /* need to add >>> to gets passed to d3 because vue creates new mapping */
  text-anchor: end;
  alignment-baseline: middle;
  font-size: 12px;
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
  width: 5px;  /* bar height, this can stay fixed */
}

>>> rect.bar2 {
  text-align: right;  /* pull value text to the end of the bar */
  vertical-align: middle;  /* align value text with middle of the bar */
  fill:#e95050;
  width: 5px;  /* bar height, this can stay fixed */
}

>>> rect.bar3 {
  text-align: right;  /* pull value text to the end of the bar */
  vertical-align: middle;  /* align value text with middle of the bar */
  fill:#e9c050;
  width: 5px;  /* bar height, this can stay fixed */
}


.legend {
    font-family: 'Courier New', Courier, monospace;
    font-size: 12px;
    text-anchor: start;
    alignment-baseline: middle
}


.title {
  margin-bottom: 0px;
  font-size: 24px;
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
</style>
