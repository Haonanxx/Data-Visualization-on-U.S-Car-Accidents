<template>
  <div class="vueChart">

    <!-- data binding using text interpolation with the “Mustache” syntax -->
    <div>Here is the data: {{JSON.stringify(chartData)}}</div>

    <div class="title">Top 10 COVID-19 confirmed in US, Aug 31 2020 (source Johns Hopkins University)</div>

    <!-- v-for directive to render a list of items based on an array -->
    <div class="item" v-for="(item, index) in chartData" :key="index">
      <div class="label"> {{item.label}} </div>
      
      <!-- :style is a short-hand for v-bind:style to allow data binding on component attributes -->
      <div class="bar" :style="'width:' + item.value / 1000 + 'px;'">
        <span class="value">{{Number(item.value).toLocaleString()}}</span>
      </div>
    </div>

  </div>
</template>

<script>

import axios from "axios";

export default {
  name: 'vueChart',
  data: function () {
    return {
      chartData: null,
    }
  },  
  mounted: function () {
    console.log('mounted');
    
    // `this` points to the component instance
    //if vueChartData is not in the store we fetch-it
    if (!this.$store.state.vueChartData) {
      axios.get('covid-19-confirmed-083120.json').then(result => {
        this.chartData = result.data;  
        console.log('chartData set from file');
        console.log('chartData contains', this.chartData.length, 'rows');
        this.$store.commit('vueChartData', this.chartData);
        });
    } else {
      this.chartData = this.$store.state.vueChartData;
      console.log('chartData set from store');
      console.log('chartData contains', this.chartData.length, 'rows');
    }
  }
}
</script>

<style>
.title {
  margin-bottom: 10px;
  font-size: 12px;
}
.item {
  text-align: left;
  margin-bottom: 5px;
}
.bar {
  display: inline-block;
  text-align: right;
  vertical-align: middle;
  background-color:#7abcff;
  height: 20px;
}
.label {
  display: inline-block;
  text-align: right;
  vertical-align: middle;
  line-height: 20px;
  width: 20%;
  font-size: 12px;
  margin-right: 12px;
}
.value {
  color:#eee;
  font-family: 'Courier New', Courier, monospace;
  font-weight: bolder;
  vertical-align: middle;
  line-height: 20px;
  margin-right: 5px;
  font-size: 12px;
}
</style>
