/**
 * https://bl.ocks.org/mbostock/ebb45892cc6ec5e6c902
 * */
import * as d3Selection from 'd3-selection';
import * as d3Scale from 'd3-scale';
import * as d3Fetch from 'd3-fetch';
import * as d3Array from 'd3-array';
import * as d3Axis from 'd3-axis';
import * as d3Timer from 'd3-timer';
import * as d3 from 'd3';
console.log('d3Timer', d3Timer);

const canvas = d3Selection.select('canvas').node(),
  context = canvas.getContext("2d");

const margin  = { top: 20, right: 20, bottom: 30, left: 40},
  width = canvas.width - margin.left - margin.right,
  height = canvas.height - margin.top - margin.bottom;

const svg =
  d3Selection
    .select('svg')
    .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

const x = d3Scale.scaleLinear().rangeRound([0, width - 2]);

const y = d3Scale.scaleLinear().rangeRound([height-2, 0]);

context.translate(margin.left, margin.top);
context.globalCompositeOperation = 'multiply'; // 设置要在绘制新形状时应用的合成操作的类型
context.fillStyle = 'rgba(60,180,240,0.6)';

d3Fetch.tsv(`${staticPath}/diamonds-1/diamonds.tsv`, function(d) {
  d.carat = +d.carat;
  d.price = +d.price;
  return d;
}).then(function(diamonds) {
  x.domain(d3Array.extent(diamonds, d=>d.carat));
  y.domain(d3Array.extent(diamonds, d=>d.price));
  // 纬线
  svg.append('g')
    .attr('class', 'grid grid--x')
    .call(d3Axis.axisLeft(y).tickSize(-width).tickFormat(()=>''));

  // 经线
  svg.append('g')
    .attr('class', 'grid grid--y')
    .attr('transform', `translate(0,${height})`)
    .call(d3Axis.axisBottom(x).tickSize(-height).tickFormat(()=>''));

  // 坐标轴y
  svg.append('g')
    .attr('class', 'axis axis--y')
    .call(d3Axis.axisLeft(y).ticks(10, 's'))
    .append('text')
    .attr('x', 10)
    .attr('y', 10)
    .attr('dy', '0.71em')
    .attr('fill', '#000')
    .attr('font-weight', 'bold')
    .attr('text-anchor', 'start')
    .text('Price (US$)');

  // 坐标轴x
  svg.append('g')
    .attr('class', 'axis axis--x')
    .attr('transform', `translate(0,${height})`)
    .call(d3Axis.axisBottom(x))
    .append('text')
    .attr('x', width - 10)
    .attr('y', -10)
    .attr('dy', '-0.35em')
    .attr('fill', '#000')
    .attr('font-weight', 'bold')
    .attr('text-anchor', 'end')
    .text('Mass (carats)');

  d3Array.shuffle(diamonds); // 打乱数组，获得更好的绘制效果
  const t = d3Timer.timer(function() {
    for( let i = 0, n = 500, d; i < n; ++i){
      if(!(d=diamonds.pop())) return t.stop();
      // context.fillRect(x(d.carat), y(d.price), Math.max(2, x(d.carat + 0.01) - x(d.carat)), 2);
      context.fillRect(x(d.carat), y(d.price), 2, 2);
    }
  })
});
