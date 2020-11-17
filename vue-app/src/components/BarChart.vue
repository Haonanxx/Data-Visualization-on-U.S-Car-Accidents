<template>
  <div class="d3barchart">

    <div v-if='data'>
      <div class="title">{{ title }}</div>
      <svg class="chart" ref="svg" width="400" height="300"/>  <!-- ref is a vue reference! -->
    </div>
  </div>
</template>

<script>
import * as d3 from 'd3';

export default {
  name: 'd3barchart',
  props: {
    title: String,
    data: {  //this.data in component
      type: Array
    }    
  },
  methods: {
    barChart() {
      var svg = d3.select(this.$refs["svg"]);  //refs to reference the svg in this component
      var sel = svg.selectAll('rect')
        .data(this.data)  //this.data from the data prop
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
    },
  },
  mounted() {
    this.barChart();
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
>>> svg.chart {
  background-color: aliceblue;
}

>>> text.label {
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
  height: 20px;  /* bar height, this can stay fixed */
}

>>> .title {
  margin-bottom: 0px;
  margin-top: 20px;
  font-size: 12px;
}
</style>
