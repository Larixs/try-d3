/*
* [line chart with circle tooltip](https://bl.ocks.org/alandunning/cfb7dcd7951826b9eacd54f0647f48d3)
* [数据](https://www.gesafe.com/simu/product/P047914)
* */
// 曲线的颜色
const COLOR = {
  PRODUCT_0: '#FF5356',
  PRODUCT_1: '#FCE987',
  PRODUCT_2: '#B9D4F4',
  PRODUCT_3: '#A98EDE',
  HS00000: '#CFAD45', // 恒生指数
  GS00000: '#EBB546', // 阳光私募指数
  HS30000: '#69ADE9', // 沪深300指数
  '037.CS': '#E6CAF3', // 中债总指数
  'NH0100.NHF': '#ECADB3', // 南华商品指数
  'SPX.GI': '#7F9AB9' // 标普500指数
};
import * as d3Scale from 'd3-scale';
import * as d3Selection from 'd3-selection';
import * as d3TimeFormat from 'd3-time-format';
import * as d3Array from 'd3-array';
import * as d3Axis from 'd3-axis';
import * as d3Format from 'd3-format';
import * as d3Shape from 'd3-shape';

const svg = d3Selection.select('svg'),
  focusMargin = { top: 20, bottom: 50, left: 50, right: 20},
  contextMargin = {top: 0, bottom: 0, left: 0, right: 0},
  focusWidth = svg.attr('width') - focusMargin.left - focusMargin.right,
  focusHeight = svg.attr('height') - focusMargin.top - focusMargin.bottom,
  contextWidth = svg.attr('width') - contextMargin.left - focusMargin.right,
  contextHeight = svg.attr('height') - contextMargin.top - contextMargin.bottom;

const parseDate = d3TimeFormat.timeParse('%Y-%m-%d');
const formatDate = d3TimeFormat.timeFormat('%Y-%m');

const x = d3Scale.scaleTime().range([0, focusWidth]),
  focusY = d3Scale.scaleLinear().range([focusHeight, 0]);

const focusXAxis =
    d3Axis
      .axisBottom(x)
      .tickFormat(formatDate)
      .tickSize(10)
      .tickSizeOuter(0),
  focusYAxis =
    d3Axis
      .axisLeft(focusY)
      .tickSizeOuter(-focusWidth)
      .tickSizeInner(-focusWidth)
      // .tickValues([0, 0.2, 0.4, 0.6, 0.8, 1])
      .tickFormat(d3Format.format('.0%'))
      // .ticks(5, '.0%');
const focusG =
  svg
    .append('g')
    .attr('class', 'focus')
    .attr('transform', `translate(${focusMargin.left}, ${focusMargin.top})`);

const hoverLine =
  focusG
    .append('g')
    .attr('class', 'hover-line')
    .style('display','none');

hoverLine
  .append('line')
  .attr('class', 'x-hover-line line')
  .attr('y1', 0)
  .attr('y2', focusHeight);

const hoverCircle = hoverLine
  .append('circle')
  .attr('r', 7.5);


export const initChart = function initChart(items) {
  const base = items[0];
  const baseY = +base.unit_nv;
  const points = items.map(i=> ({
    x: parseDate(i.trading_date),
    y: (+i.unit_nv - baseY) / baseY
  }));
  const xExtents = d3Array.extent(points, i=>i.x);
  const yExtents = d3Array.extent(points, i=>i.y);
  const yRoundExtents = getRoundExtents(yExtents);
  x.domain(xExtents);
  focusY.domain(yRoundExtents);

  correctTicks(focusY, focusYAxis)

  const focusLine =
    d3Shape
      .line()
      .x(d=>x(d.x))
      .y(d=>focusY(d.y))
      .curve(d3Shape.curveLinear)
  focusG
    .append('g')
    .attr('class', 'axis axis--x')
    .attr('transform', `translate(0, ${focusHeight})`)
    .call(focusXAxis);

  focusG
    .append('g')
    .attr('class', 'axis axis--y')
    .call(focusYAxis);

  focusG
    .append('path')
    .datum(points)
    .attr('class', 'area')
    .attr("stroke", COLOR.PRODUCT_0)
    .attr("stroke-width", 1.5)
    .attr("fill", 'none')
    .attr('d', focusLine)

  focusG
    .append('rect')
    .attr('class', 'hover-overlay')
    .attr('width', focusWidth)
    .attr('height', focusHeight)
    .attr('fill', 'none')
    .on('mouseover', ()=>{ hoverLine.style('display', null)})
    .on('mouseout', () => { hoverLine.style('display', 'none')})
    .on('mousemove', mouseMove);

  function mouseMove() {
    const x0 = x.invert(d3Selection.mouse(this)[0]),
      bisectDate = d3Array.bisector(d=>d.x).left,
      i = bisectDate(points, x0, 1),
      d0 = points[i-1],
      d1 = points[i],
      d = x0 - d0.x > d1.x - x0 ? d1 : d0;
    hoverLine
      .attr('transform', `translate(${x(d.x)}, 0)`);
    hoverCircle.attr('cy', focusY(d.y))
    // hoverLine.select('.x-hover-line').attr('y2', focusHeight - focusY(d.y));
  }

};

function getRoundExtents(extents) {
  // const distance = Math.abs(extents[0] - extents[1]) / 5;
  return extents
}

function correctTicks(scale, axis) {
  const ticks = scale.ticks(4);
  const diff = ticks[1] - ticks[0];
  ticks.push(ticks[ticks.length-1] + diff);
  ticks.unshift(ticks[0] - diff);
  scale.domain([ticks[0], ticks[ticks.length-1]]);
  axis.tickValues(ticks);
}
