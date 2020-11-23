<template>
  <div style="height:100%;width:100%;text-align:left;">
    <div ref="basicMapbox" style="height:500px;width:800px;">
      <div id="state-legend" class="legend">
			<h4>Severity</h4>
			<div><span style="background-color: #800026"></span>4</div>
			<div><span style="background-color:#bd0026"></span>3</div>
			<div><span style="background-color:#e31a1c"></span>2</div>
			<div><span style="background-color: #fc4e2a"></span>1</div>
			<div><span style="background-color: #fd8d3c"></span>0</div>	
		</div>
		<div id="map-overlay" class="map-overlay"></div>
    </div>
  </div>
</template>
<script>
import mapboxgl from 'mapbox-gl'
import axios from 'axios'

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
        center: [-95,39.833333], // starting position [lng, lat]
        zoom: 3.2 // starting zoom
      })

      console.log(map)
      var zoomThreshold = 4;
      var overlay = document.getElementById('map-overlay');
      // Create a popup, but don't add it to the map yet.
      var popup = new mapboxgl.Popup({
      closeButton: false
      });

      axios.get('state_county.json').then(res=>
        map.on("load", ()=>{
          map.addLayer({
            'id': 'states',
            'type': 'fill',
            source:{
              type: 'geojson',
              data: res.data
            },
            maxzoom: zoomThreshold,
            layout:{},
            filter: ['==', 'type', 'state'],
            paint:{
            'fill-color': [ 'interpolate', ['linear'], ['*', ['get', 'severity'], 1], 0,"#fd8d3c",1,"#fc4e2a",2,"#e31a1c",3,"#bd0026",4,"#800026"],  //OK - interpolate color proportional to AREA property with a factor of 0.6
            'fill-opacity': 0.6
            }
          });

          map.addLayer({
            'id': 'counties',
            'type': 'fill',
            source:{
              type: 'geojson',
              data: res.data
            },
            minzoom: zoomThreshold,
            layout:{},
            filter: ['==', 'type', 'county'],
            paint:{
            'fill-color': [ 'interpolate', ['linear'], ['*', ['get', 'severity'], 1], 0,"#fd8d3c",1,"#fc4e2a",2,"#e31a1c",3,"#bd0026",4,"#800026"],  //OK - interpolate color proportional to AREA property with a factor of 0.6
            'fill-opacity': 0.6
            }
          });

          map.addLayer({
            'id': 'counties-highlighted',
            'type': 'fill',
            source:{
              type: 'geojson',
              data: res.data
            },
            minzoom: zoomThreshold,
            layout:{},
            filter: ['==', 'id', ''],
            paint:{
            'fill-color':  '#4575b4',  //fixed color
            }
          });

          map.on('mousemove', 'states', function (e) {

        // Change the cursor style as a UI indicator.
        map.getCanvas().style.cursor = 'pointer';
         
        // Single out the first found feature.
        var feature = e.features[0];
         
        // Render found features in an overlay.
        overlay.innerHTML = '';
         
        var title = document.createElement('strong');
        title.textContent =
        feature.properties.name +
        ' State';
         
        var severity = document.createElement('div');
        severity.textContent =
        'Severity: ' + feature.properties.severity.toLocaleString();
         
        overlay.appendChild(title);
        overlay.appendChild(severity);
        overlay.style.display = 'block';
         
        // Add features that share the same state name to the highlighted layer.
        map.setFilter('counties-highlighted', [
        '==',
        'id',
        feature.properties.id
        ]);
         
        // Display a popup with the name of the state
        popup
        .setLngLat(e.lngLat)
        .setText(feature.properties.name)
        .addTo(map);
        });

        map.on('mouseleave', 'states', function () {
            map.getCanvas().style.cursor = '';
            popup.remove();
            map.setFilter('counties-highlighted', ['==', 'id', '']);
            // overlay.style.display = 'none';
            });

        map.on('mousemove', 'counties', function (e) {

            // Change the cursor style as a UI indicator.
            map.getCanvas().style.cursor = 'pointer';
                
            // Single out the first found feature.
            var feature = e.features[0];
                
            // Render found features in an overlay.
            // overlay.innerHTML = '';
                
            var title = document.createElement('strong');
            title.textContent =
            feature.properties.name +
            ' County';
                
            var severity = document.createElement('div');
            severity.textContent =
            'Severity: ' + feature.properties.severity.toLocaleString();
                
            // overlay.appendChild(title);
            // overlay.appendChild(severity);
            // overlay.style.display = 'block';
                
            // Add features that share the same county name to the highlighted layer.
            map.setFilter('counties-highlighted', [
            '==',
            'id',
            feature.properties.id
            ]);
                
            // Display a popup with the name of the county
            popup
            .setLngLat(e.lngLat)
            .setText(feature.properties.name)
            .addTo(map);
            });

            map.on('mouseleave', 'counties', function () {
                map.getCanvas().style.cursor = '';
                popup.remove();
                map.setFilter('counties-highlighted', ['==', 'id', '']);
                // overlay.style.display = 'none';
                });

        })
      )

    }
  },
  
}
</script>
<style>
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

</style>