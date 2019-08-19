/**
 * https://bl.ocks.org/mbostock/87746f16b83cb9d5371394a001cbd772
 * */

import * as d3Selection from 'd3-selection';
import * as d3Scale from 'd3-scale';
import * as d3Axis from 'd3-axis';
import * as d3Random from 'd3-random';
import * as d3Array from 'd3-array';
import * as d3Brush from 'd3-brush';

const randomX = d3Random.randomUniform(0, 10),
  randomY = d3Random.randomNormal(0.5, 0.12),
  data = d3Array.range(800).map(()=> [randomX(), randomY()]);

const svg = d3Selection.select('svg'),
  margin = {top: 194, right: 50, bottom: 214, left: 50},
  width = svg.attr('width') - margin.left - margin.right,
  height = svg.attr('height') - margin.top - margin.bottom,
  g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);


const x = d3Scale.scaleLinear().domain([0, 10]).range([0,width]);

const y = d3Scale.scaleLinear().range([height, 0]);

const brush = d3Brush.brushX().extent([[0,0], [width, height]]).on('start brush', brushed)

const dot =
  g
    .append('g')
    .attr('fill-opacity', 0.2)
    .selectAll('circle')
    .data(data)
    .enter()
    .append('circle')
    .attr('transform', function(d) {
      return `translate(${x(d[0])}, ${y(d[1])})`;
    })
    .attr('r', 3.5);

g
  .append('g')
  .call(brush)
  .call(brush.move, [3,5].map(x))
  .selectAll('.overlay')
  .on('mousedown touchstart', beforebrushed, true)
g
  .append('g')
  .attr('transform', `translate(0, ${height})`)
  .call(d3Axis.axisBottom(x))

function beforebrushed() {
  d3Selection.event.stopImmediatePropagation();
  d3Selection.select(this.parentNode).transition().call(brush.move, x.range());
}
function brushed() {
  const extent = d3Selection.event.selection.map(x.invert, x); // 从range转换为domain
  dot.classed('selected', function(d) { return extent[0] <= d[0] && d[0] <= extent[1]});
}

