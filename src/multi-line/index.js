/*
* https://bl.ocks.org/mbostock/8033015
*
* */

import * as d3TimeFormat from 'd3-time-format';
import * as d3Selection from 'd3-selection';
import * as d3Scale from 'd3-scale';
import * as d3Voronoi from 'd3-voronoi';
import * as d3Shape from 'd3-shape';
import * as d3Fetch from 'd3-fetch';
import * as d3Array from 'd3-array';
import * as d3Axis from 'd3-axis';

let months ,monthKeys;
const monthParse = d3TimeFormat.timeParse('%Y-%m');

const svg = d3Selection.select('svg'),
  margin = { top : 20, right: 30, bottom: 30, left: 40},
  width = svg.attr('width') - margin.left - margin.right,
  height = svg.attr('height') - margin.top - margin.bottom,
  g = svg.append('g').attr('transform', `translate(${margin.left},${margin.right})`);

const x = d3Scale.scaleTime().range([0, width]);

const y = d3Scale.scaleLinear().range([height, 0]);

const voronoi =
  d3Voronoi
    .voronoi()
    .x(d=>x(d.date))
    .y(d=>y(d.value))
    .extent([[-margin.left, -margin.top], [width + margin.right, height + margin.bottom]]);

const line =
  d3Shape
    .line()
    .x(d=>x(d.date))
    .y(d=>y(d.value));

d3Fetch.tsv(`${staticPath}/multi-line/unemployment.tsv`, type).then(data=>{
  x.domain(d3Array.extent(months));
  y.domain([0, d3Array.max(data, c=> d3Array.max(c.values, d=> d.value))]).nice();
  g
    .append('g')
    .attr('class', 'axis axis--x')
    .attr('transform', `translate(0, ${height})`)
    .call(d3Axis.axisBottom(x));

  g
    .append('g')
    .attr('class', 'axis axis--y')
    .call(d3Axis.axisLeft(y).ticks(10, '%'))
    .append('text')
    .attr("x", 4)
    .attr("y", 0.5)
    .attr("dy", "0.32em")
    .style("text-anchor", "start")
    .style("fill", "#000")
    .style("font-weight", "bold")
    .text("Unemployment Rate");

  g.append('g')
    .attr('class', 'cities')
    .selectAll('path')
    .data(data)
    .enter()
    .append('path')
    .attr('d', function(d){ d.line = this; return line(d.values)}).raise();

  const focus =
    g.append('g')
      .attr('transform', `translate(-100, -100)`)
      .attr('class', 'focus');

  focus
    .append('circle')
    .attr('r', 3.5);

  focus
    .append('text')
    .attr('y', -10);

  const voronoiGroup = g.append('g').attr('class', 'voronoi');

  const polygons = voronoi.polygons(d3Array.merge(data.map(function(d) { return d.values; })));
  console.log('data map', data.map(function(d) { return d.values; }));
  console.log('polygons', polygons);
  voronoiGroup.selectAll("path")
    .data(polygons)
    .enter()
    .append("path")
    .attr("d", function(d) { return d ? "M" + d.join("L") + "Z" : null; })
    .on("mouseover", mouseover)
    .on("mouseout", mouseout);

  d3Selection.select("#show-voronoi")
    .property("disabled", false)
    .on("change", function() { voronoiGroup.classed("voronoi--show", this.checked); });

  function mouseover(d) {
    // 维诺图每个区域的mouseover。
    // 维诺图按照与每个点的距离划分区域
    // 点击 show voronoi 就能看见区域划分
    // 在区域里的坐标都离线上的某个点最近，该点加粗表示
    d3Selection
      .select(d.data.city.line)
      .classed("city--hover", true)
      .raise();
    focus.attr("transform", "translate(" + x(d.data.date) + "," + y(d.data.value) + ")");
    focus.select("text").text(d.data.city.name);
  }

  function mouseout(d) {
    d3Selection.select(d.data.city.line).classed("city--hover", false);
    focus.attr("transform", "translate(-100,-100)");
  }
});
function type(d, i, columns) {
  if(!months) {
    monthKeys = columns.slice(1);
    months = monthKeys.map(monthParse);
  }
  const c = {
    name: d.name.replace(/ (msa|necta div|met necta|met div)$/i, ''),
    values: null
  };
  c.values = monthKeys.map((k, i)=> ({
    city: c,
    date:months[i],
    value: d[k] / 100
  }));
  return c;
}
