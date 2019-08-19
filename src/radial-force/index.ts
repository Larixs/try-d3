// name: radial force
// from: https://bl.ocks.org/mbostock/cd98bf52e9067e26945edd95e8cf6ef9

// simulation.force(forceName[,_force])
// forceName是力的名称，如果有_force的话，那么就是绑定_force到simulation上并且取名为forceName
// 如果没有_force，那就是根据forceName（自定义）去找之前绑定的力。
// 用法像jquery的attr。

import * as d3 from  'd3';
import { SimulationNodeDatum } from 'd3-force';
import init from './init';

interface rangeDataStructure extends SimulationNodeDatum{
    type: RangeType;
}
enum RangeType {
    typeA = 'a',
    typeB = 'b',
}

init();
const rangeA = new Array(80).fill(0).map(()=>({
  type: RangeType.typeA
}));
const rangeB = new Array(160).fill(0).map(()=>({
  type: RangeType.typeB
}));
const config = {
  [RangeType.typeA]: {
    radial: 100,
    fillColor: 'brown'
  },
  [RangeType.typeB]: {
    radial: 200,
    fillColor: 'steelblue'
  }
};
const nodes = [].concat(rangeA, rangeB);

const circles = d3.select('svg')
  .append('g')
  .selectAll('circle')// 选中所有circle（此时为空）
  .data(nodes) // 绑定nodes到选定circle上（此时数据多于节点数量）
  .join('circle') // 补全数据多余circle的部分，增加circle数量至数据数量（此时数据等于节点数量）
  .attr('r', 2.5)
  .attr('fill', function(d: rangeDataStructure) {
    return config[d.type].fillColor;
  });

d3.forceSimulation(nodes)
    .force('charge', d3.forceCollide().radius(8))
    .force('r', d3.forceRadial(function(d: rangeDataStructure) {
        return config[d.type].radial;
    }))
    .on('tick', function() {
      // 计算出来的位置赋给每一个圆圈
      circles
        .attr("cx", d => d.x) // 如果不用两个'charge'和'r'的force，点也有d.x和d.y，为啥？forceSimulation做了啥处理
        .attr("cy", d => d.y)
    });
