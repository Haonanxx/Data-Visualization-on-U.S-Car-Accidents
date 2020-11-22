<template>
  <div style="height:100%;width:100%;text-align:left;">
    <div ref="basicMapbox" style="height:500px;width:1100px;"></div>
  </div>
</template>
<script>
import mapboxgl from 'mapbox-gl'
export default {
  props: {
    mapWidth: {
      type: String
    },
    mapHeight: {
      type: String
    }
  },
  data () {
    return {
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    // initialize
    init () {
      mapboxgl.accessToken = 'pk.eyJ1IjoicWlhbnFpYW4tdGFuZyIsImEiOiJja2dxNzFwdWkwbzRiMnlxaTFzdzhydDRuIn0.aHbdzBJHQVLpFv6h1i1PkQ'
      const map = new mapboxgl.Map({
        container: this.$refs.basicMapbox,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [-98.583333,39.833333], // starting position [lng, lat]
        zoom: 3.5 // starting zoom
      })
      console.log(map)
    }
  },
  computed: {
    mapSize () {
      let styleObj = {
        width: this.mapWidth,
        height: this.mapHeight
      }
      return styleObj
    }
  }
}
</script>
<style>
/* @import url('https://api.tiles.mapbox.com/mapbox-gl-js/v0.44.2/mapbox-gl.css'); */
  .basicMapbox {
      position: relative;
      height: 700px;
      width: 1100px;
      display: inline-block;
  }

</style>