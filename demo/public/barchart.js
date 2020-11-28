import * as d3 from 'd3';
function drawbarchart() {
    var xScale = d3.scaleBand()
        .round(true)
        .paddingInner(0.05);

    var pScale = d3.scalePoint();

    var yScale = d3.scaleLinear();

    var xAxis = d3.axisBottom()
        .scale(xScale);

    var pAxis = d3.axisBottom()
        .scale(pScale);
    console.log(pAxis)

    var yAxis = d3.axisLeft()
        .scale(yScale);

    d3.tsv("planet.tsv", function (d) {
        return {
            name: d.name,
            gravity: +d.gravity,
            temperature: +d.temperature,
            distance: +d.distance,
        };
    }).then(function (data) {

        var margin = { top: 10, left: 40, bottom: 40, right: 20 };
        var width = parseInt(d3.select('#chart4').style('width')) - margin.left - margin.right;
        var height = parseInt(d3.select('#chart4').style('height')) - margin.top - margin.bottom;

        var svg = d3.select('#chart4')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');

        xScale.domain(data.map(function (d) {
            return d.name;
        }))
            .range([0, width]);

        pScale.domain(data.map(function (d) {
            return d.name;
        }))
            .range([0, width]);

        yScale.domain([0, d3.max(data, function (d) {
            return d.gravity;
        })])
            .range([height, 0]);

        svg.append('g')
            .attr('class', 'x axis')
            .attr('transform', 'translate(0,' + height + ')')
            .call(xAxis);

        svg.append('g')
            .attr('class', 'y axis')
            .call(yAxis)
            .append('text')
            .attr('transform', 'rotate(-90)')
            .attr('y', 6)
            .attr('dy', '.7em')
            .text('Gravity (ms')
            .append('tspan')
            .style('baseline-shift', 'super')
            .style('font-size', '0.7em')
            .text('-2')
            .append('tspan')
            .style('baseline-shift', 'normal')
            .style('font-size', '1.43em')
            .text(')');

        svg.selectAll('.bar')
            .data(data, function (d) {
                return d.name;
            })
            .enter()
            .append('rect')
            .attr('class', 'bar')
            .attr('x', function (d) {
                return xScale(d.name);
            })
            .attr('y', function (d) {
                return yScale(d.gravity);
            })
            .attr('width', xScale.bandwidth())
            .attr('height', function (d) {
                return height - yScale(d.gravity);
            })
            .attr('fill', 'red');

        svg.selectAll('.line')
            .data(data, function (d) {
                return d.name;
            })
            .enter()
            .append('line')
            .attr('class', 'line')
            .attr('x1', function (d) {
                return pScale(d.name);
            })
            .attr('y1', function (d) {
                return yScale(d.gravity);
            })
            .attr('x2', function (d) {
                return pScale(d.name);
            })
            .attr('y2', yScale(0))
            .attr('stroke', 'black')
            .attr('stroke-width', '5px');

        svg.selectAll('.circle')
            .data(data, function (d) {
                return d.name;
            })
            .enter()
            .append('circle')
            .attr('class', 'circle')
            .attr('cx', function (d) {
                return pScale(d.name);
            })
            .attr('cy', function (d) {
                return yScale(d.gravity);
            })
            .attr('r', 7)
            .attr('fill', 'red');

        svg.selectAll('.name')
            .data(data, function (d) {
                return d.name;
            })
            .enter()
            .append('text')
            .text(function (d) {
                return d.name;
            })
            .attr('class', 'name')
            .attr('x', function (d) {
                return xScale(d.name) + xScale.bandwidth() / 2;
            })
            .attr('y', function (d) {
                console.log(d)
                return height + 10;
            })

        svg.selectAll('.gravity')
            .data(data, function (d) {
                return d.name;
            })
            .enter()
            .append('text')
            .text(function (d) {
                return d.gravity + ' ms';
            })
            .attr('class', 'gravity')
            .attr('x', function (d) {
                return xScale(d.name) + xScale.bandwidth() / 2;
            })
            .attr('y', function (d) {
                console.log(d)
                return height + 20;
            })
            .append('tspan').text('-2')
            .style('baseline-shift', 'super')
            .style('font-size', '0.7em');

        d3.select(window).on('resize', resize);

        resize(); //call resize in case we start small!

        function resize() {
            width = parseInt(d3.select('#chart4').style('width')) - margin.left - margin.right;
            height = parseInt(d3.select('#chart4').style('height')) - margin.top - margin.bottom;

            svg.attr('width', width)
                .attr('height', height)

            xScale.range([0, width]);
            pScale.range([0, width]);
            yScale.range([height, 0]).nice();

            if (width < 550) {
                svg.selectAll('.circle')
                    .data(data, function (d) {
                        return d.name;
                    }) //UPDATE
                    .attr('cx', function (d) {
                        return pScale(d.name);
                    })
                    .attr('cy', function (d) {
                        return yScale(d.gravity);
                    });

                svg.selectAll('.line')
                    .data(data, function (d) {
                        return d.name;
                    }) //UPDATE
                    .attr('x1', function (d) {
                        return pScale(d.name);
                    })
                    .attr('y1', function (d) {
                        return yScale(d.gravity);
                    })
                    .attr('x2', function (d) {
                        return pScale(d.name);
                    })
                    .attr('y2', yScale(0));

                svg.selectAll('.name')
                    .data(data, function (d) {
                        return d.name;
                    }) //UPDATE
                    .attr('x', function (d) {
                        return pScale(d.name);
                    })
                    .attr('y', function (d) {
                        console.log(d)
                        return height + 20;
                    })
                    .style('display', 'initial');

                svg.selectAll('.gravity')
                    .data(data, function (d) {
                        return d.name;
                    }) //UPDATE
                    .attr('x', function (d) {
                        return pScale(d.name);
                    })
                    .attr('y', function (d) {
                        console.log(d)
                        return height + 30;
                    })
                    .style('display', 'initial');

                svg.select('.x.axis').style('display', 'none');
                svg.select('.y.axis').style('display', 'none');
                svg.selectAll('.bar').style('display', 'none');
                svg.selectAll('.circle').style('display', 'initial');
                svg.selectAll('.line').style('display', 'initial');
            } else {
                svg.selectAll('.bar')
                    .data(data, function (d) {
                        return d.name;
                    }) //UPDATE
                    .attr('x', function (d) {
                        return xScale(d.name);
                    })
                    .attr('y', function (d) {
                        return yScale(d.gravity);
                    })
                    .attr('width', xScale.bandwidth())
                    .attr('height', function (d) {
                        return height - yScale(d.gravity);
                    });

                yAxis.ticks(Math.max(height / 100, 2)); //one every 100 pixels
                xAxis.ticks(Math.max(width / 100, 2));

                svg.select('.x.axis')
                    .attr('transform', 'translate(0,' + height + ')')
                    .call(xAxis);

                svg.select('.y.axis')
                    .call(yAxis);

                svg.select('.x.axis').style('display', 'initial');
                svg.select('.y.axis').style('display', 'initial');
                svg.selectAll('.name').style('display', 'none');
                svg.selectAll('.gravity').style('display', 'none');
                svg.selectAll('.bar').style('display', 'initial');
                svg.selectAll('.circle').style('display', 'none');
                svg.selectAll('.line').style('display', 'none');
            }
        }
    });
}
export {
    drawbarchart
}
