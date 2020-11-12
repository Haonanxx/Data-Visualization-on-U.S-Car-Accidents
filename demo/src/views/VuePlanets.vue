<template>
  <div class="vuePlanets">

    <!-- data binding using text interpolation with the “Mustache” syntax -->
    <div>Here is the data: {{JSON.stringify(chartData)}}</div>

    <div class="title">Distances of planets to sun</div>

    <!-- v-for directive to render a list of items based on an array -->
    <div class="item" v-for="(item, index) in chartData" :key="index">
      <div class="label"> {{item.label}} </div>
      
      <!-- :style is a short-hand for v-bind:style to allow data binding on component attributes -->
      <div class="bar" :style="'width:' + item.dist / 10 + 'px;'">
        <span class="value">{{Number(item.dist).toLocaleString()}}</span>
      </div>
    </div>

  </div>
</template>

<script>

import axios from "axios";

export default {
  name: 'vuePlanets',
  data: function () {
    return {
      chartData: null,
    }
  },  
  mounted: function () {
    console.log('mounted');
    
    // `this` points to the component instance
    //if vueChartData is not in the store we fetch-it
    if (!this.$store.state.vuePlanetsData) {
      axios.get('planets.json').then(result => {
        this.chartData = result.data;  
        console.log('chartData set from file');
        console.log('chartData contains', this.chartData.length, 'rows');
        this.$store.commit('vuePlanetsData', this.chartData);
        });
    } else {
      this.chartData = this.$store.state.vuePlanetsData;
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
  color:rgb(0, 0, 0);
  font-family: 'Courier New', Courier, monospace;
  font-weight: bolder;
  vertical-align: middle;
  line-height: 20px;
  margin-right: 5px;
  font-size: 12px;
}
</style>

