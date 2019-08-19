import * as d3Scale from 'd3-scale';
import * as d3Selection from 'd3-selection';
import * as d3Ease from 'd3-ease';
import * as d3Interpolators from 'd3-interpolate';
import * as d3Axis from 'd3-axis';
const svg = d3Selection.select('svg'),
  margin = { top: 210, right: 20, bottom: 220, left: 20},
  width = svg.attr('width') - margin.left - margin.right,
  height = svg.attr('height') - margin.top - margin.bottom,
  g = svg.append('g').attr('transform', `translate(${margin.left}, ${margin.top})`);


const x = d3Scale.scaleLinear().domain([0, 1]).range([0, width]).interpolate(easeInterpolate(d3Ease.easeQuadInOut));

g.append('g')
  .attr('class', 'axis axis--x')
  .call(d3Axis.axisBottom(x));

function easeInterpolate(ease) {
  return function(start, end) {
    // ?? interpolate的参数为啥不直接是map用的函数呢，而是一个返回值为map用函数的函数？
    const  i = d3Interpolators.interpolate(start,end);
    return function(tick) {// map 时用的函数
      return i(ease(tick));
    }
  }
}
