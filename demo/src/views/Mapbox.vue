<template>
  <div style="display: table-row;">

    <div style="display: table-cell;">
      <div ref="basicMapbox" style="height:500px;width:800px;">
        <div id="state-legend" class="legend">
        <h4>Severity</h4>
        <div><span style="background-color: #800026"></span>4</div>
        <div><span style="background-color:#bd0026"></span>3</div>
        <div><span style="background-color:#e31a1c"></span>2</div>
        <div><span style="background-color: #fc4e2a"></span>1</div>
        <div><span style="background-color: #fd8d3c"></span>0</div>	
      </div>
      <button id="total" class="map-button">total</button>
      <div id="map-overlay" class="map-overlay"></div>
      </div>
    </div>
    <div style="display: table-cell;">
        <div id = "pie-title"></div>
        <svg id = "pie_chart" width="600" height="450"></svg>
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
    // this.drawPieChart('West Virginia')
    this.init()
  },
  methods: {
    // ,
    // initialize
    init () {
      // const vue = this
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
      var pie_title = document.getElementById('pie-title');
      // Create a popup, but don't add it to the map yet.
      var popup = new mapboxgl.Popup({
      closeButton: false
      });


      var condition_list = ['Amenity', 'Bump', 'Crossing', 'Give_Way', 'Junction', 'No_Exit', 'Railway',
                'Station', 'Stop', 'Traffic_Signal']
      var oldPieData = []
      var filteredPieData = []
      console.log(oldPieData);
      console.log(filteredPieData);
      drawPieChart("total")
      function drawPieChart(state_name){
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

                  var color = d3.scaleOrdinal(["#88CCEE", "#882255", "#332288", "#117733", "#44AA99", "#CC6677", "#f2ff00", "#AA4499", "#b2df8a", "#865EDA"]);
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

                  

                  var positive_conditions = []
                  var total_value = 0; //size of this slice
                  var pieData = pie(data.conditions);
                  oldPieData = filteredPieData
                  // console.log(oldPieData);
                  filteredPieData = pieData.filter(filterData);
                  // console.log(filteredPieData);
                  // console.log(pieData);
                  

                  function filterData(element) {
                      total_value += element.value;
                      if (element.value > 0) {
                          // console.log(element.data.condition);
                          positive_conditions.push(element.data.condition)
                      }
                      // console.log(total_value);
                      return (element.value > 0);
                  }

                  var arc = g.selectAll('.arc')
                      .data(filteredPieData)
                      .enter()
                      .append('g')
                      .attr('class', 'arc'); 

                  arc.append('path')
                      .attr('d', path)
                      .attr("cursor", "pointer")
                      .attr('fill', d => color(d.data.condition))
                      .transition()
                      .duration(1000)
                      .attrTween("d", pieTween);
                  // arc.transition()
                  //     .duration(1000)
                  //     .attrTween("d", pieTween);
                  arc.exit()
                      .transition()
                      .duration(1000)
                      .attrTween("d", removePieTween)
                      .remove();


                  arc.on('mousemove', function (d) {
                          var percent = this.__data__.value / total_value * 100
                          // console.log(this);
                          // d3.select(this)
                          //     .attr('opacity', '.7');
                          div.style("display", "none");
                          div.html("road condition: " + this.__data__.data.condition + "</br>" + "percentage: " + percent.toFixed(2) + '%')
                              .style("left", (d.pageX + 12) + "px")
                              .style("top", (d.pageY - 10) + "px")
                              .style("opacity", 1)
                              .style("display", "block");
                      })

                  arc.on('mouseout', function () {
                      // d3.select(this).transition()
                      //     .duration('50')
                      //     .attr('opacity', '1');
                      div.html(" ").style("display", "none");
                  })

                  function pieTween(d, i) {
                      var start_angel;
                      var end_angel;
                      console.log(d);
                      //   console.log(i);
                      if (oldPieData[i]) {
                            // console.log(oldPieData[i]);
                          start_angel = oldPieData[i].startAngle;
                          end_angel = oldPieData[i].endAngle;
                      } else if (!(oldPieData[i]) && oldPieData[i-1]) {
                          start_angel = oldPieData[i-1].endAngle;
                          end_angel = oldPieData[i-1].endAngle;
                      } else if (!(oldPieData[i - 1]) && oldPieData.length > 0) {
                          start_angel = oldPieData[oldPieData.length - 1].endAngle;
                          end_angel = oldPieData[oldPieData.length - 1].endAngle;
                      } else {
                          start_angel = 0;
                          end_angel = 0;
                      }

                      var ip = d3.interpolate({ startAngle: start_angel, endAngle: end_angel }, { startAngle: d.startAngle, endAngle: d.endAngle });
                      return function (t) {
                          //   console.log(t);
                          var b = ip(t);
                          // console.log("hhhhhh");
                          return path(b);
                      };
                  }

                  function removePieTween(d) {
                    console.log("RRR");
                      var start_angel = 2 * Math.PI;
                      var end_angel = 2 * Math.PI;
                      var ip = d3.interpolate({ startAngle: d.startAngle, endAngle: d.endAngle }, { startAngle: start_angel, endAngle: end_angel });
                      return function (t) {
                          var b = ip(t);
                          console.log("REmove");
                          return path(b);
                      };
                  }

                  var legend = g.selectAll('legend_colors')
                      .data(condition_list)
                      .enter()

                  legend.append('circle')
                      .attr('cx', -45)
                      .attr('cy', function (d, i) {
                          return i * 22 - 100;
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
                      .attr('x', -25)
                      .attr('y', function (d, i) {
                          return i * 22 - 94;
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
          // console.log(filteredPieData);
                  // return filteredPieData

              });
          }
            // drawPieChart('Ohio')
            // console.log(ad);


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
            // 'fill-opacity': 0.6
            'fill-outline-color': 'white'
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
            // 'fill-opacity': 0.6
            'fill-outline-color': 'white'

            }
          },'settlement-label');

          map.addLayer({
            'id': 'hover_state_highlighted',
            'type': 'fill',
            source:{
              type: 'geojson',
              data: res.data
            },
            maxzoom: zoomThreshold,
            layout:{},
            filter: ['==', 'id', ''],
            paint:{
            'fill-color':  '#00ffff',  //fixed color
            'fill-opacity': 0.6
            }
          },'settlement-label');

          map.addLayer({
            'id': 'click_state_highlighted',
            'type': 'fill',
            source:{
              type: 'geojson',
              data: res.data
            },
            maxzoom: zoomThreshold,
            layout:{},
            filter: ['==', 'id', ''],
            paint:{
            'fill-color':  '#00ffff',  //fixed color
            'fill-opacity': 1
            }
          },'settlement-label');

          map.addLayer({
            'id': 'hover_county_highlighted',
            'type': 'fill',
            source:{
              type: 'geojson',
              data: res.data
            },
            minzoom: zoomThreshold,
            layout:{},
            filter: ['==', 'id', ''],
            paint:{
            'fill-color':  '#00ffff',  //fixed color
            'fill-opacity': 0.6
            }
          },'settlement-label');

          // map.addLayer({
          //   'id': 'click_county_highlighted',
          //   'type': 'fill',
          //   source:{
          //     type: 'geojson',
          //     data: res.data
          //   },
          //   minzoom: zoomThreshold,
          //   layout:{},
          //   filter: ['==', 'id', ''],
          //   paint:{
          //   'fill-color':  '#00ffff',  //fixed color
          //   'fill-opacity': 1
          //   }
          // },'settlement-label');

          var total = document.getElementById('total');
          var title_state = document.createElement('strong');
            title_state.textContent = 'the US'
          pie_title.innerHTML = '';
          pie_title.textContent =
            'The percentage of road conditions of traffic accidents in ';
            
            pie_title.appendChild(title_state);

          // var tot = document.createElement('button');

          total.addEventListener('click', function () {
          drawPieChart("total")
          map.setFilter('click_state_highlighted', ['==', 'id', '']);
          var title_state = document.createElement('strong');
            title_state.textContent = 'the US'
          pie_title.innerHTML = '';
          pie_title.textContent =
            'The percentage of road conditions of traffic accidents in ';
            pie_title.appendChild(title_state);
          
          });

          map.on('click', 'states', function (e) {
          var feature = e.features[0];
          // Add feature that has the same state name to the highlighted layer.
          map.setFilter('click_state_highlighted', ['==', 'id', feature.properties.id]);
          drawPieChart(feature.properties.name)
          var title_state = document.createElement('strong');
            title_state.textContent = feature.properties.name.toLocaleString()
          pie_title.innerHTML = '';
          pie_title.textContent =
            'The percentage of road conditions of traffic accidents in ';
            pie_title.appendChild(title_state);         
          });

          // map.on('click', 'counties', function (e) {
          // var feature = e.features[0];
          // // Add feature that has the same state name to the highlighted layer.
          //   map.setFilter('click_county_highlighted', ['==', 'id', feature.properties.id]);
          // drawPieChart(feature.properties.name)
          // });

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
            
            // Add feature that has the same state name to the highlighted layer.
            map.setFilter('hover_state_highlighted', [
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
            map.setFilter('hover_state_highlighted', ['==', 'id', '']);
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
            map.setFilter('hover_county_highlighted', [
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
                map.setFilter('hover_county_highlighted', ['==', 'id', '']);
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
</style>