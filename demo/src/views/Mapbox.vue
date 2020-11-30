<template>
  <div>
    <div>
    <div class="left">
      <h3>Severity of traffic accidents of the states and counties in the US</h3>
      <div ref="basicMapbox" style="height:500px;width:800px;margin-left:50px" >
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
    <div class="right">
        <div id = "pie-title"></div>
        <br>
        <svg id = "pie_chart" width="450" height="450"></svg>
      </div>
</div>
<div>
  <div class="left">
    <div>
        <h3>The number of times the traffic accidents happened near the infrastructures in 49 states of the US from 2016 to 2020 with 4 different severities</h3>
    </div>

    <div id="chart"></div>
  </div>
<div class="right">
  <br><br><br><br><br><br>
  <div class="commands">
        <span class="filter" id="all">All 10 infrastructures</span>
    </div>
    <div class="commands">
        <span class="filter" id="top5">Top 5 infrastructures </span>
    </div>
    <br>
    <div class="slidecontainer">
      <input type="range" min="1" max="4" value="1" class="slider" id="myRange">
      <div style="word-spacing: 45px">1 2 3 4</div>
      <p>Severity: <span id="demo"></span></p>
    </div>
    </div>
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
    this.drawBar()
    this.init()
  },
  methods: {
    drawBar(){
    // margin convention
var margin = { top: 20, left: 100, bottom: 50, right: 50 },
width = 900 - margin.left - margin.right,
height = 400 - margin.top - margin.bottom;

var svg = d3.select('#chart').append('svg')
.attr('width', width + margin.left + margin.right)
.attr('height', height + margin.top + margin.bottom)
.append('g')
.attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');

// Declare scale function for x axis and y axis
var x = d3.scaleBand();
var y = d3.scaleLinear();
var pScale = d3.scalePoint();

// Draw x axis at the bottom
var xAxis;
xAxis = d3.axisBottom()
    .scale(x)
    .ticks(0)
    .tickSize(0)
    .tickFormat('');

//draw y axis with ticks on the left
var yAxis = d3.axisLeft()
    .scale(y)
    .ticks(5, 'd');

// Declare delay time for index of data based on their indice
var delay = function (d, i) {
return i * 50;
};

// Declare variables
var all, top5;
var current, sortMode;

// Load GDP.json with d3
d3.json('severity_condition.json').then(data => {
    
    // const data = data
    all = data.filter(d => {if (d.Severity == 1) return d})

    //Set top for top 5 by values
    top5 = all.sort(function(a,b){return d3.descending(+a.Value, +b.Value)})
            .slice(0,5)

            filter('#all');
            sort('#descending_value');
            
            toggleFilter('#all');
            // toggleSort('#descending_value');
            
            draw();

    function update(severity_num){
        all = data.filter(d => {if (d.Severity == severity_num) return d})
// console.log(all);
    //Set top for top 5 by values
    top5 = all.sort(function(a,b){return d3.descending(+a.Value, +b.Value)})
            .slice(0,5)

            filter('#all');
            sort('#descending_value');
            
            toggleFilter('#all');
            // toggleSort('#descending_value');
            
            redraw();
            // resize()
    }
    
        


d3.select(window).on('resize', resize);

resize(); //call resize in case we start small!

    var slider = document.getElementById("myRange");
    var output = document.getElementById("demo");
    
    output.innerHTML = slider.value;
    // console.log(slider.value);
    slider.oninput = function() {
        output.innerHTML = this.value;
        //   console.log(this.value);
        update(slider.value)
        
    // console.log(slider.value);
    
      
    }



// initial settings (all 10 countries ordered alphabetic by name) before clicking on any button

});




//implement click events to sort descendingly by value
d3.select('#descending_value')
.on('click', () => {
sort('#descending_value');
transition();
// toggleSort('#descending_value');
});


//filter event handlers
//implement click events to show all
d3.select('#all')
.on('click', () => {


filter('#all');


sort(sortMode);

// toggleSort(sortMode);
toggleFilter('#all');

redraw();
});

//implement click events to show top 5 by value
d3.select('#top5')
.on('click', () => {

filter('#top5');
sort(sortMode);

// toggleSort(sortMode);
toggleFilter('#top5');

redraw();})


// define filtering function
function filter(mode) {


if (mode === '#all') {
    current = JSON.parse(JSON.stringify(all));
} else if (mode === '#top5') {
    current = JSON.parse(JSON.stringify(top5));
} 
// filterMode = mode;
}

// define sorting function
function sort(mode) {

    current.sort((a, b) => d3.descending(+a.Value, +b.Value));

//Sorted country names as the discrete domain of x scaler. The positions of them on x axis may change after sorting in current, so map again.
x.domain(current.map(d => d.Condition));
sortMode = mode;

}




//define function to highlight the toggled sorting label
function toggleFilter(id) {
d3.select('.init')
    .style('background-color', '#FB6E51')
    .style("cursor", "pointer");
d3.selectAll('.filter')
    .style('background-color', '#ffcdb2')
    .style("cursor", "pointer");

d3.select(id)
    .style('background-color', '#FB6E51')
    .style("cursor", "pointer");
}

//Define function to draw the initial bar chart
function draw() {
  width = parseInt(d3.select('#chart').style('width')) - margin.left - margin.right;
        height = parseInt(d3.select('#chart').style('height')) - margin.top - margin.bottom;
  // console.log("HHHHHHH");
//var x = d3.scaleBand();
//Map the countries in current as the discrete domain of the axis in the translated group
x.domain(current.map(d => d.Condition))
    .range([0, width])
    .paddingInner(0.3)
    .paddingOuter(0.3); //add outer padding to scaleBand

pScale.domain(current.map(d => d.Condition))
    .range([0, width]);

//var y = d3.scaleLinear();
// console.log(height)
y.domain([0, d3.max(current, d => +d.Value)])
    .range([height, 0])
    .nice();

// Draw x axis at the bottom

xAxis = d3.axisBottom()
    .scale(x)
    .ticks(0)
    .tickSize(0)
    .tickFormat('');
// Append the group translate height in vertical from the position translated last time, with ticks on the bottom then draw x axis 
svg.append('g')
    .attr('class', 'x-axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis);

//draw y axis with ticks on the left
yAxis = d3.axisLeft()
    .scale(y)
    .ticks(5, 'd');

svg.append('g')
    .attr('class', 'y-axis')
    .call(yAxis);



// Draw bars
    // The x coordernate of the star point of each bar is the value mapping from the discrete domain.
    // y(d.Value) is  the value in the range mapping from Value of the domain of y
    // bandwidth() is the width of the scaled bar by d3.scaleBand
svg.selectAll('.bar')
    .data(current, d => d.Condition)
    .enter()
    .append('rect')
    .attr('class', 'bar')
    .attr('x', d => x(d.Condition))
    .attr('y', d => y(+d.Value))
    .attr('width', x.bandwidth())
    .attr('height', d => height - y(+d.Value));


svg.selectAll('.line')
    .data(current, d => d.Condition)
    .enter()
    .append('line')
    .attr('class', 'line')
    .attr('x1', function (d) {
        return pScale(d.Condition);
    })
    .attr('y1', function (d) {
        return y(+d.Value);
    })
    .attr('x2', function (d) {
        return pScale(d.Condition);
    })
    .attr('y2', y(0))
    .attr('stroke', 'black')
    .attr('stroke-width', '5px');

    svg.selectAll('.circle')
    .data(current, function (d) {
        return d.Condition;
    })
    .enter()
    .append('circle')
    .attr('class', 'circle')
    .attr('cx', function (d) {
        return pScale(d.Condition);
    })
    .attr('cy', function (d) {
        return y(+d.Value);
    })
    .attr('r', 7)
    .attr('fill', '#FB6E51');

    
svg.selectAll('.name')
    .data(current, d => d.Condition)
    .enter()
    .append('text')
    .text(d => {
      // console.log(d.Name);
      return d.Name})
    .attr('class', 'name')
    .attr('x', d => {
      // console.log(height+10);
      return x(d.Condition) + x.bandwidth() / 2})
    .attr('y', height+10 );

svg.selectAll('.value')
                .data(current, d => +d.Value)
                .enter()
                .append('text')
                
                .text(d => {
                  // console.log(d.Name);
                  return +d.Value})
                .attr('class', 'value')
                .attr('x', d => {
                  // console.log(height+10);
                  return pScale(d.Condition)})
                .attr('y', d=>y(+d.Value)-10 );
                // .style('display', 'none');

svg.append('text')
    .attr('x', - height / 2)
    .attr('y', - margin.left * 0.7)
    .attr('transform', 'rotate(-90)')
    .attr('class', 'ylabel')
    .append('tspan').text('Number of accidents')
    .style('baseline-shift', 'super')
    .style('font-size', '15px');
}

    function resize() {

      // console.log("RESIZE");
        width = parseInt(d3.select('#chart').style('width')) - margin.left - margin.right;
        height = parseInt(d3.select('#chart').style('height')) - margin.top - margin.bottom;

        svg.attr('width', width)
            .attr('height', height)

        x.range([0, width]);
        pScale.range([0, width]);
        y.range([height, 0]).nice();

        if (width < 550) {
          // console.log("<550");
            svg.selectAll('.circle')
                .data(current, function (d) {
                    return d.Condition;
                }) //UPDATE
                .attr('cx', function (d) {
                    return pScale(d.Condition);
                })
                .attr('cy', function (d) {
                    return y(+d.Value);
                });

            svg.selectAll('.line')
                .data(current, function (d) {
                    return d.Condition;
                }) //UPDATE
                .attr('x1', function (d) {
                    return pScale(d.Condition);
                })
                .attr('y1', function (d) {
                    return y(+d.Value);
                })
                .attr('x2', function (d) {
                    return pScale(d.Condition);
                })
                .attr('y2', y(0));


    
            svg.selectAll('.name')
                .data(current, d => d.Condition)
                
                .text(d => {
                  // console.log(d.Name);
                  return d.Name})
                .attr('class', 'name')
                .attr('x', d => {
                  // console.log("resize name");
                  return pScale(d.Condition)})
                .attr('y', height+10 )
                .style('display', 'initial');

            svg.selectAll('.value')
                .data(current, d => d.Condition)
                
                .text(d => {
                  // console.log("resize value");
                  return +d.Value})
                .attr('class', 'value')
                .attr('x', d => {
                  return pScale(d.Condition)})
                .attr('y', d=>y(+d.Value)-10 )
                .style('display', 'initial');


            svg.select('.x-axis').style('display', 'none');
            svg.select('.y-axis').style('display', 'none');
            svg.selectAll('.bar').style('display', 'none');
            svg.selectAll('.circle').style('display', 'initial');
            svg.selectAll('.line').style('display', 'initial');
        } else {
            svg.selectAll('.bar')
                .data(current, function (d) {
                    // console.log(current);
                    return d.Condition;
                }) //UPDATE
                .attr('x', function (d) {
                    return x(d.Condition);
                })
                .attr('y', function (d) {
                    return y(+d.Value);
                })
                .attr('width', x.bandwidth())
                .attr('height', function (d) {
                    return height - y(+d.Value);
                });

            svg.selectAll('.name')
                .data(current, d => d.Condition)
                
                .text(d => {
                  // console.log(d.Name);
                  return d.Name})
                .attr('class', 'name')
                .attr('x', d => {
                  // console.log(height+10);
                  return  x(d.Condition) + x.bandwidth() / 2})
                .attr('y', height+10 )
            

            // yAxis.ticks(Math.max(height / 100, 2)); //one every 100 pixels
            // xAxis.ticks(Math.max(width / 100, 2));

            svg.select('.x-axis')
                .attr('transform', 'translate(0,' + height + ')')
                .call(xAxis);

            svg.select('.y-axis')
                .call(yAxis);

            svg.select('.x-axis').style('display', 'initial');
            svg.select('.y-axis').style('display', 'initial');
            svg.selectAll('.name').style('display', 'initial');
            svg.selectAll('.value').style('display', 'none');
            svg.selectAll('.bar').style('display', 'initial');
            svg.selectAll('.circle').style('display', 'none');
            svg.selectAll('.line').style('display', 'none');
        }
    }




//define function for transition
function transition() {
var transition = svg.transition()
    .duration(1000);

transition.selectAll('.bar')
    .delay(delay)
    .attr('x', d => x(d.Condition));

transition.selectAll('.name')
    .delay(delay)
    .attr('x', d => x(d.Condition) + x.bandwidth() / 2);
}

//Redraw because the data change, the number of bars and x labels become smaller after filtering, so the shapes of bars change after rescaling. 
function redraw() {
  width = parseInt(d3.select('#chart').style('width')) - margin.left - margin.right;
        height = parseInt(d3.select('#chart').style('height')) - margin.top - margin.bottom;
    //update scale
    x.domain(current.map(d => d.Condition))

 pScale.domain(current.map(d => d.Condition))
    .range([0, width]);

// Append the group translate height in vertical from the position translated last time, with ticks on the bottom then draw x axis 
svg.select('.x-axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis);

    y.domain([0, d3.max(current, d => +d.Value)])
    .range([height, 0])
    .nice();


//draw y axis with ticks on the left
var yAxis = d3.axisLeft()
    .scale(y)
    .ticks(5, 'd');

d3.select('.y-axis')
    .transition()  
    .duration(1000)  
    .call(yAxis);


// data join for bars
var bars = svg.selectAll('.bar')
    .data(current, d => d.Condition);

// exit
bars.exit()
    .transition()  
    .duration(500)  
    .style('opacity', 0)  
    .remove();
// update
bars.transition()
    .duration(1500)
    .delay(delay)
    .attr('x', d => {
        // console.log(x(d.Condition));
        return x(d.Condition)})
    .attr('width', x.bandwidth())
    .attr('class','bar');


// enter
bars.enter()
    .append('rect')
    .attr('x', d => x(d.Condition))  
    .attr('y', y(0))  
    .attr('width', x.bandwidth())
    .attr('class', 'bar')
    .transition()  
    .duration(1500)  
    .attr('class', 'bar')  
    .attr('x', d => x(d.Condition))  
    .attr('y', d => {
        // console.log(y(+d.Value));
        return y(+d.Value)})  
    .attr('width', x.bandwidth())  
    .attr('height', d => height - y(+d.Value))
    // .style('display','none')
    ;  
// console.log(width);
// if(width<550){
//   svg.selectAll('.bar').style('display', 'none');
// }


// DATA JOIN FOR NAMES.
var name = svg.selectAll('.name')
    .data(current, d => d.Condition);

// UPDATE.
name.transition()
    .duration(1000)
    .delay(delay)
    .attr('x', d => (width<550?pScale(d.Condition):x(d.Condition) + x.bandwidth() / 2))
    .attr('class', 'name');
// EXIT.    
name.exit()
    .transition()
    .duration(1000)
    .style('opacity', 0)
    .remove();
// ENTER.
name.enter()
    .append('text')
    .attr('x', d => (width<550?pScale(d.Condition):x(d.Condition) + x.bandwidth() / 2))
    .attr('y', height +10 )
    .attr('class', 'name')
    .style('opacity', 0)
    .transition()
    .duration(1000)
    .text(d => d.Name)
    .attr('class', 'name')
    .attr('x', d => (width<550?pScale(d.Condition):x(d.Condition) + x.bandwidth() / 2))
    .attr('y', height+10 )
    .style('opacity', 1);



// DATA JOIN FOR VALUES.
var value = svg.selectAll('.value')
    .data(current, d => +d.Value)
    .attr('class','value');
// UPDATE.
value.transition()
    .duration(1000)
    .delay(delay)
    .attr('x', d => pScale(d.Condition))
    .attr('class','value');
// EXIT.    
value.exit()
    .transition()
    .duration(1000)
    .attr('class','value')
    .style('opacity', 0)
    .remove();
// ENTER.
value.enter()
    .append('text')
    .attr('x', d => pScale(d.Condition))
    .attr('y', d=>y(+d.Value)-10 )
    .attr('class','value')
    .style('opacity', 0)
    .transition()
    .duration(1000)
    .text(d => +d.Value)
    .attr('class','value')
    .attr('x', d => {
        // console.log("fds",y(+d.Value)-10);
        return pScale(d.Condition)})
    .attr('y', d=>y(+d.Value)-10 )
    .style('opacity', 1);



// data join for lines
var lines = svg.selectAll('.line')
    .data(current, d => d.Condition);

// update
lines.transition()
    .duration(500)
    .delay(delay)
    .attr('x1', function (d) {
        return pScale(d.Condition);
    })
    .attr('y1', function (d) {
        return y(+d.Value);
    })
    .attr('x2', function (d) {
        return pScale(d.Condition);
    })
    .attr('y2', y(0))
    .attr('stroke', 'black')
    .attr('stroke-width', '5px')
    .attr('class', 'line');

// exit
lines.exit()
    .transition()  
    .duration(500)  
    .style('opacity', 0)  
    .remove();

// enter
lines.enter()
    .append('line')
    .attr('x1', function (d) {
        return pScale(d.Condition);
    })
    .attr('y1', function (d) {
        return y(+d.Value);
    })
    .attr('x2', function (d) {
        return pScale(d.Condition);
    })
    .attr('y2', y(0)) 
    .attr('class', 'line')
    .transition()  
    .duration(500)  
    .attr('class', 'line')
    .attr('x1', function (d) {
        return pScale(d.Condition);
    })
    .attr('y1', function (d) {
        return y(+d.Value);
    })
    .attr('x2', function (d) {
        return pScale(d.Condition);
    })
    .attr('y2', y(0))
    .attr('stroke', 'black')
    .attr('stroke-width', '5px');


// data join for lines
var circles = svg.selectAll('.circle')
    .data(current, d => d.Condition);


// update
circles.transition()
    .duration(500)
    .delay(delay)
    .attr('cx', function (d) {
        return pScale(d.Condition);
    })
    .attr('cy', function (d) {
        return y(+d.Value);
    })
    .attr('r', 7)
    .attr('fill', '#FB6E51')
    .attr('class', 'circle');

// exit
circles.exit()
    .transition()  
    .duration(500)  
    .style('opacity', 0)  
    .remove();



// enter
circles.enter()
    .append('circle')
    .attr('class', 'circle')
    .attr('cx', function (d) {
        return pScale(d.Condition);
    })
    .attr('cy', function (d) {
        return y(+d.Value);
    })
    .attr('r', 7) 
    .transition()  
    .duration(500)  
    .attr('class', 'circle')
    .attr('cx', function (d) {
        return pScale(d.Condition);
    })
    .attr('cy', function (d) {
        return y(+d.Value);
    })
    .attr('r', 7)
    .attr('fill', '#FB6E51');
   

resize()
}
}

,
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
      // console.log(oldPieData);
      // console.log(filteredPieData);
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
                      // console.log(d);
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
            title_state.style.color="red"

          pie_title.innerHTML = '';
          pie_title.textContent =
            'The percentage of appearance of infrastructures for traffic accidents in ';
            pie_title.style.fontSize = "18.72px"
            pie_title.style.fontWeight = "bold"
            pie_title.appendChild(title_state);

          // var tot = document.createElement('button');

          total.addEventListener('click', function () {
          drawPieChart("total")
          map.setFilter('click_state_highlighted', ['==', 'id', '']);
          var title_state = document.createElement('strong');
            title_state.textContent = 'the US'
            title_state.style.color="red"
          pie_title.innerHTML = '';
          pie_title.textContent =
            'The percentage of road conditions of traffic accidents in ';
             pie_title.style.fontSize = "18.72px"
            pie_title.style.fontWeight = "bold"
            pie_title.appendChild(title_state);
          
          });

          map.on('click', 'states', function (e) {
          var feature = e.features[0];
          // Add feature that has the same state name to the highlighted layer.
          map.setFilter('click_state_highlighted', ['==', 'id', feature.properties.id]);
          drawPieChart(feature.properties.name)
          var title_state = document.createElement('strong');
            title_state.textContent = feature.properties.name.toLocaleString()
            title_state.style.color="red"
          pie_title.innerHTML = '';
          pie_title.textContent =
            'The percentage of road conditions of traffic accidents in ';
             pie_title.style.fontSize = "18.72px"
            pie_title.style.fontWeight = "bold"
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
.left {
  float: left;
  width: 60%;
  padding: 0 20px;
  overflow: hidden;
}
.right {
  /* background-color: lightblue; */
  float: left;
  width: 30%;
  padding: 20px 25px;
  margin-top: 20px;
}

.axis path,
        .axis line {
            fill: none;
            stroke: black;
            shape-rendering: crispEdges;
        }

        .axis text {
            font-family: Courier;
            font-size: 0.85em;
        }

        text {
            font-family: Courier;
            font-size: 0.65em;
        }

        div.commands {
            font-family: Courier;
            font-size: 0.85em;
            font-weight: bold;
            text-align: center;
            cursor: default;
            user-select: none;
        }

        .bar {
            fill: #FB6E51;
        }

        text.xlabel {
            text-anchor: middle;
        }

        text.ylabel {
            font-size: 2em;
            text-anchor: middle;
            alignment-baseline: central;
        }

        text.name {
            font-weight: bold;
            text-anchor: middle;
            alignment-baseline: central;
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

        label {
            vertical-align: text-bottom;
        }

        .filter {
            border-radius: 3px;
            background-color: #eee;
            padding: 5px;
            margin: 5px;
            color: #444;
            text-align: left;
            display: inline-block;
            cursor: default;
        }

        .init {
            border-radius: 3px;
            background-color: #eee;
            padding: 5px;
            margin: 5px;
            color: #444;
            text-align: left;
            display: inline-block;
            cursor: default;
        }
        .slider {
            -webkit-appearance: none;
            width: 190px;
            height: 15px;
            border-radius: 5px;  
            background: #d3d3d3;
            outline: none;
            opacity: 0.7;
            -webkit-transition: .2s;
            transition: opacity .2s;
          }
          
          .slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 25px;
            height: 25px;
            border-radius: 50%; 
            background: #4CAF50;
            cursor: pointer;
          }
          
          .slider::-moz-range-thumb {
            width: 25px;
            height: 25px;
            border-radius: 50%;
            background: #4CAF50;
            cursor: pointer;
          }
          .y-axis{
            font-size: 24px;
          }

          text.name,
          text.value {
              text-anchor: middle;
              fill: black;
              font-size: 0.5em;
          }

          #chart {
              width: 100%;
              height: 350px;
              background-color: #ffeeee;
          }

</style>