import * as d3 from 'd3';
function draw_clander(){
    var svg2=d3.select("#map")
        .attr("height",30)
        .attr('width',960)
    svg2.append("g")
        .selectAll("text")
        //定义标签文字(年份)的位置以及文字的旋转角度、文字内容
        .data(["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"])
        .enter().append("text")
        .attr("transform", (d,i)=>{
            console.log(d)

            return "translate(" +(73*i+90)+ ",30)"})
        .attr("font-family", "sans-serif")
        .attr("font-size", 15)
        .attr("text-anchor", "middle")
        .text(d=>d);

    var width = 960
      var   height = 136
       var  cellSize = 17   //定义每个方格的大小

    var formatPercent = d3.format(".1%"); //定义一个百分数格式函数，规定百分数精确度小数点后1位
    console.log(formatPercent)
    // 定义颜色函数，使用量化比例尺映射，即定义域为连续的，从-0.05到0.05，而值域是离散的颜色值
    var color = d3.scaleQuantize()
        .domain([0, 5000])
        .range(d3.schemeOranges[9]);

    // 定义10个svg组，分别用来展示从1990年到2010年的数据
    var svg = d3.select("#chart4")
        .selectAll("svg")
        .data(d3.range(2016, 2021))
        .enter().append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + ((width - cellSize * 53) / 2) + "," + (height - cellSize * 7 - 1) + ")");

    // 定义每个年份对应的group旁边的标签

    svg.append("text")
        //定义标签文字(年份)的位置以及文字的旋转角度、文字内容
        .attr("transform", "translate(-6," + cellSize * 3.5 + ")rotate(-90)")
        .attr("font-family", "sans-serif")
        .attr("font-size", 15)
        .attr("text-anchor", "middle")
        .text(function(d) { return d; });

    // 定义每个年份中代表天的小方格
    var rect = svg.append("g")
        .attr("fill", "none")
        .attr("stroke", "#ccc")
        .selectAll("rect")
        //计算一组小方格的数量，调用d3的timeDays方法，获取两个时间之间的天数，例如，计算从1999年的第一天到2000年的第一天,则参数为new Date(1999,0,1)到 new Date(2000,0,1)，timeDays返回天序列
        .data(function(d) { return d3.timeDays(new Date(d, 0, 1), new Date(d + 1, 0, 1)); })
        .enter().append("rect")
        .attr("width", cellSize)
        .attr("height", cellSize)
        // 返回一年有多少个周，确定一组小方格的横向位置
        .attr("x", function(d) { return d3.timeWeek.count(d3.timeYear(d), d) * cellSize; })
        // 返回天，确定一组小方格的纵向位置
        .attr("y", function(d) { return d.getDay() * cellSize; })
        // 定义当前小方格上对应的日期的格式
        .datum(d3.timeFormat("%Y-%m-%d"));

    // 勾勒月份的分割线
    svg.append("g")
        .attr("fill", "none")
        .attr("stroke", "#000")
        .selectAll("path")
        .data(function(d) { return d3.timeMonths(new Date(d, 0, 1), new Date(d + 1, 0, 1)); })
        .enter().append("path")
        .attr("d", pathMonth);


    rect.attr("fill", d=>{
        //console.log(d)
        if(d=='2018-04-10')
        {return 'red'}
        else{return 'gray'}
    });
    d3.json("clander.json").then(data => {
        //console.log(data)
        rect.attr("fill", d=>{
            //console.log(d)
            //console.log(data[d])
            if(typeof (data[d])=='undefined'){return 'gray'}
            return color(data[d])

        });
    });

}
function pathMonth(t0) {
    var  cellSize = 17
    var t1 = new Date(t0.getFullYear(), t0.getMonth() + 1, 0),
        d0 = t0.getDay(), w0 = d3.timeWeek.count(d3.timeYear(t0), t0),
        d1 = t1.getDay(), w1 = d3.timeWeek.count(d3.timeYear(t1), t1);
    return "M" + (w0 + 1) * cellSize + "," + d0 * cellSize
        + "H" + w0 * cellSize + "V" + 7 * cellSize
        + "H" + w1 * cellSize + "V" + (d1 + 1) * cellSize
        + "H" + (w1 + 1) * cellSize + "V" + 0
        + "H" + (w0 + 1) * cellSize + "Z";
}
export {
    draw_clander
}