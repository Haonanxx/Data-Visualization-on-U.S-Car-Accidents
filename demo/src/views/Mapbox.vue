<template>
  <div style="display: table-row;">

    <div style="display: table-cell;height:100%;width:100%;">
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
    <div style="display: table-cell;">
        <svg id="pie_chart" width="960" height="500"></svg>
        <div id = "tooltip"></div>
      </div>
  </div>
</template>
<script>
import mapboxgl from 'mapbox-gl'
import axios from 'axios'
import * as d3 from 'd3';

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
    this.drawPieChart('West Virginia')
    this.init()
  },
  methods: {
    drawPieChart(state_name){
     d3.json('state_road_condition.json').then(jsondata => {
        var data = jsondata.find(d=>d.state==state_name)
        // console.log(data.conditions);

        var svg = d3.select('#pie_chart'),
            width = +svg.attr('width'),
            height = +svg.attr('height'),
            radius = Math.min(width, height) / 2,
            g = svg.append('g')
                .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

        var div = d3.select("body")
            .append("div")
            .attr("class", "tooltip");

        var color = d3.scaleOrdinal(["#88CCEE", "#882255", "#332288", "#117733", "#44AA99", "#CC6677", "#DDCC77", "#AA4499", "#b2df8a", "#865EDA"]);
        //pie layout
        var pie = d3.pie()
            .value(d => {
                // console.log(d.value);
                return d.value
            })
            .sortValues(d3.descending);

        var path = d3.arc()
            .outerRadius(radius)
            .innerRadius(radius - 90);

        var arc = g.selectAll('.arc')
            .data(pie(data.conditions))
            .enter()
            .append('g')
            .attr('class', 'arc'); 

        var positive_conditions = []
        var total_value = 0; //size of this slice
        var pieData = pie(data.conditions);

        pieData.filter(filterData);
        // console.log(filteredPieData);
        // console.log(pieData);

        function filterData(element) {
            total_value += element.value;
            if (element.value > 0) {
                // console.log(element.data.condition);
                positive_conditions.push(element.data.condition)
            }
            return (element.value > 0);
        }

        arc.append('path')
            .attr('d', path)
            .attr('fill', d => color(d.data.condition))
            .attr("cursor", "pointer")
            .on('mousemove', function (d) {
                var percent = this.__data__.value / total_value * 100
                d3.select(this).transition()
                    .duration('50')
                    .attr('opacity', '.7');
                div.style("display", "none");
                div.html("road condition: " + this.__data__.data.condition + "</br>" + "percentage: " + percent.toFixed(2) + '%')
                    .style("left", (d.pageX + 12) + "px")
                    .style("top", (d.pageY - 10) + "px")
                    .style("opacity", 1)
                    .style("display", "block");
            })
            .on('mouseout', function () {
                d3.select(this).transition()
                    .duration('50')
                    .attr('opacity', '1');
                div.html(" ").style("display", "none");
            })

        var legend = g.selectAll('legend_colors')
            .data(color.domain())
            .enter()

        legend.append('circle')
            .attr('cx', -50)
            .attr('cy', function (d, i) {
                return i * 25 - 110;
            })
            .attr('r', '.5rem')
            .style('fill', function (d) {
                if (positive_conditions.includes(d)) {
                    return color(d);
                }
                else {
                    return "#D0CED2"
                }
            })

        legend.append('text')
            .attr('x', -20)
            .attr('y', function (d, i) {
                return i * 25 - 105;
            })
            .text(d => d)
            .style('fill', function (d) {
                if (positive_conditions.includes(d)) {
                    return "black";
                }
                else {
                    return "#D0CED2"
                }
            })

    });
},
    // initialize
    init () {
      const vue = this
      // console.log(vue);
      mapboxgl.accessToken = 'pk.eyJ1IjoicWlhbnFpYW4tdGFuZyIsImEiOiJja2dxNzFwdWkwbzRiMnlxaTFzdzhydDRuIn0.aHbdzBJHQVLpFv6h1i1PkQ'
      const map = new mapboxgl.Map({
        container: this.$refs.basicMapbox,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [-95,39.833333], // starting position [lng, lat]
        zoom: 3.2 // starting zoom
      })

      // console.log(map)
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
          },'settlement-label');

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
          },'settlement-label');

          map.addLayer({
            'id': 'highlighted',
            'type': 'fill',
            source:{
              type: 'geojson',
              data: res.data
            },
            layout:{},
            filter: ['==', 'id', ''],
            paint:{
            'fill-color':  '#4575b4',  //fixed color
            'fill-opacity': 0.7
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
            map.setFilter('highlighted', [
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

        map.on('click', 'states', function (e) {
          var feature = e.features[0];
          vue.drawPieChart(feature.properties.name)
          // console.log(feature.properties.name);
          });

        map.on('mouseleave', 'states', function () {
            map.getCanvas().style.cursor = '';
            popup.remove();
            map.setFilter('highlighted', ['==', 'id', '']);
            overlay.style.display = 'none';
            });

        map.on('mousemove', 'counties', function (e) {

            // Change the cursor style as a UI indicator.
            map.getCanvas().style.cursor = 'pointer';
                
            // Single out the first found feature.
            var feature = e.features[0];
                
            // Render found features in an overlay.
            overlay.innerHTML = '';
                
            var title = document.createElement('strong');
            title.textContent =
            feature.properties.name +
            ' County';
                
            var severity = document.createElement('div');
            severity.textContent =
            'Severity: ' + feature.properties.severity.toLocaleString();
                
            overlay.appendChild(title);
            overlay.appendChild(severity);
            overlay.style.display = 'block';
                
            // Add features that share the same county name to the highlighted layer.
            map.setFilter('highlighted', [
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
                map.setFilter('highlighted', ['==', 'id', '']);
                overlay.style.display = 'none';
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
</style>