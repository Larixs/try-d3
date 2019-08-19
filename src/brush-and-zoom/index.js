/**
* https://bl.ocks.org/mbostock/34f08d5e11952a80609169b7917d4172
* */
import * as d3Selection from 'd3-selection';
import * as d3TimeFormat  from 'd3-time-format';
import * as d3Scale from 'd3-scale';
import * as d3Axis from 'd3-axis';
import * as d3Brush from 'd3-brush';
import * as d3Shape from 'd3-shape';
import * as d3Fetch from 'd3-fetch';
import * as d3Array from 'd3-array';
import * as d3Zoom from 'd3-zoom';

import * as d3 from 'd3';

const svg = d3Selection.select('svg'),
  margin = {top: 20, right: 20, bottom: 110, left: 40},
  margin2 = {top: 430, right: 20, bottom: 30, left: 40},
  width = +svg.attr('width') - margin.left - margin.right,
  height = +svg.attr('height') - margin.top - margin.bottom,
  height2 = +svg.attr('height') - margin2.top - margin2.bottom;

const parseDate = d3TimeFormat.timeParse('%b %Y'); // practice of partially applied function

const x = d3Scale.scaleTime().range([0, width]),
  x2 = d3Scale.scaleTime().range([0, width]),
  y = d3Scale.scaleLinear().range([height, 0]),
  y2 = d3Scale.scaleLinear().range([height2, 0]);

const xAxis = d3Axis.axisBottom(x),
  xAxis2 = d3Axis.axisBottom(x2),
  yAxis = d3Axis.axisLeft(y)

const brush =
  d3Brush
    .brushX()
    .extent([[0,0], [width, height2]])
    .on('brush end', brushed);

const zoom =
  d3Zoom
    .zoom()
    .scaleExtent([1, 400])
    .translateExtent([[0,0], [width, height]])
    .extent([[0,0], [width, height]]) // ?? 不知道是什么的范围
    // .extent([[0,0], [100, 100]])
    .on('zoom', zoomed);

const area =
  d3Shape
    .area()
    .curve(d3Shape.curveMonotoneX)
    .x(d => x(d.date))
    .y0(height)
    .y1(d => y(d.price));

const area2 =
  d3Shape
    .area()
    .curve(d3Shape.curveMonotoneX)
    .x(d=>x2(d.date))
    .y0(height2) // bottom border
    .y1(d=> y2(d.price)) // curve

svg.append("defs").append("clipPath") // 隐藏多余的图表部分
  .attr("id", "clip")
  .append("rect")
  .attr("width", width)
  .attr("height", height);

const focus =
  svg
    .append('g')
    .attr('class', 'focus')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

const context =
  svg
    .append('g')
    .attr('class', 'context')
    .attr('transform', `translate(${margin2.left}, ${margin2.top})`);

d3Fetch.csv(`${staticPath}/brush-and-zoom/sp500.csv`, function(d) {
  d.date = parseDate(d.date);
  d.price = +d.price;
  return d;
}).then((data)=>{
  const xDomain = d3Array.extent(data, d=>d.date);
  const yMax = d3Array.max(data, d=>d.price);
  x.domain(xDomain);
  y.domain([0, yMax]);
  x2.domain(x.domain());
  y2.domain(y.domain());

  focus
    .append('path')
    .datum(data)
    .attr('class', 'area')
    .attr('d', area);

  context
    .append('path')
    .datum(data)
    .attr('class', 'area')
    .attr('d', area2);

  focus
    .append('g')
    .attr('class', 'axis axis--x')
    .attr('transform', `translate(0, ${height})`)
    .call(xAxis);

  focus
    .append('g')
    .attr('class', 'axis axis--y')
    .call(yAxis);

  context
    .append('g')
    .attr('class', 'axis axis--x')
    .attr('transform', `translate(0, ${height2})`)
    .call(xAxis2);

  context
    .append('g')
    .attr('class', 'brush')
    .call(brush)
    .call(brush.move, x2.range());

  svg
    .append('rect')
    .attr('class', 'zoom')
    .attr('width', width)
    .attr('height', height)
    .attr('transform', `translate(${margin.left}, ${margin.top})`)
    .call(zoom);
});

function zoomed() {
  if (d3Selection.event.sourceEvent && d3Selection.event.sourceEvent.type === "brush") return; // ignore zoom-by-brush
  const t = d3Selection.event.transform;
  x.domain(t.rescaleX(x2).domain());
  focus.select('.area').attr('d', area);
  focus.select('.axis--x').call(xAxis);
  context.select(".brush").call(brush.move, x.range().map(t.invertX, t));
}
function brushed() {
  if(d3Selection.event.sourceEvent && d3Selection.event.sourceEvent.type === 'zoom') return; // ignore brush-by-zoom ???
  const s = d3Selection.event.selection || x2.range();
  x.domain(s.map(x2.invert, x2));
  focus.select('.axis--x').call(xAxis);
  focus.select('.area').attr('d', area);
  // 更换brush区域后，手动调整zoom的区域，否则在zoom时会回到更换brush之前的状态
  console.log('width/s', width / (s[1] - s[0]));
  svg.select(".zoom").call(zoom.transform, d3Zoom.zoomIdentity
    .scale(width / (s[1] - s[0]))
    .translate(-s[0], 0));
}

