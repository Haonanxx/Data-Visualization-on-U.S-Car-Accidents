<template>
  <div class="d3Chart">

    <div class="title">Accidents Data Visulization</div>
    <div class="sub-title">(Data from February 2016 to June 2020)</div>
    <div>
      <img src="cover.jpg"  alt="上海鲜花港 - 郁金香" />
    </div>
    <!--svg width="500" height="500" id="chart">
    </--svg--><svg width="800" height="400" id="chartline"></svg>

    <div>
      <br/><br/><br/><br/><br/><br/><br/><br/>

      <div id="calanderdiv"><svg id="calander" height="50" width="1000"></svg></div>
      <div><svg id="bar" height="50" width="1000"></svg></div>
      <svg id="maphead"></svg>
      <div id="chart4"></div>
    </div>
  </div>
</template>



<!-- "scoped" attribute limits CSS to this component only -->
<style scoped>
  >>> text.label {  /* need to add >>> to gets passed to d3 because vue creates new mapping */
    text-anchor: end;
    alignment-baseline: middle;
    font-size: 24px;
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


  .title {
    margin-bottom: 0px;
    font-size: 24px;
  }
  #selectItem{ margin:1 ; width:320px; height:100px;}
</style>
