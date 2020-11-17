<template>
  <div class="smallMultiples">

    <BarChart/>
    
    <div v-if="datasets.length == 0">Looks like we have no data!</div>
    <div v-else>
      
      <h3 class="mt-4">Datasets</h3>

      We have {{datasets.length}} datasets:

      <!-- adding '1' to the key to avoid vue warning of duplicate keys in component -->
      <div style="text-alight: left" v-for="(item, index) in datasets" :key="index + '1'"> 
        Dataset at index {{index}} has {{item.length}} rows
      </div>

      <h3 class="mt-4">Plots</h3>

      <BarChart :data="datasets[0]" title="Top 10 COVID-19 confirmed in US, Aug 31 2020 (source Johns Hopkins University)"/>
      <BarChart :data="datasets[1]" title="Top 10 COVID-19 confirmed in US, Aug 31 2020 (source Johns Hopkins University)"/>

      <!-- plot datasets using v-for directive -->
      <BarChart v-for="(item, index) in datasets" :key="index" :data="item" :title="'Dataset ' + index + ': Top 10 COVID-19 confirmed in US, Aug 31 2020 (source Johns Hopkins University)'"/>
    </div>

  </div>
</template>

<script>

import BarChart from '@/components/BarChart.vue'  // @ is an alias to /src

import * as d3 from 'd3';
// import axios from "axios";  //uncomment if you want to use axios instead of d3 to load data

export default {
  name: 'smallMultiples',
  components: {
    BarChart
  },
  data: function () {
    return {
      datasets: [],
    }
  },  
  mounted: function () {
    var promises = [];
    promises.push(d3.json('covid-19-confirmed-083120.json'));
    promises.push(d3.json('covid-19-confirmed-083120.json'));

    var that = this;  //`this` points to the component instance, to use it inside Promises.all we set it to that

    //Using Promise.all and d3 to wait for all the promises to resolve
    Promise.all(promises).then(result => {
      that.datasets = result;
    });
    
    //alternatively you can use axios with a bit more work!
    // var promises = [];
    // promises.push(axios.get('covid-19-confirmed-083120.json'));
    // promises.push(axios.get('covid-19-confirmed-083120.json'));

    // axios.all(promises).then(result => {
    //   result.forEach(d => {
    //     that.datasets.push(d.data);
    //   });
    // });
  }
}
</script>
