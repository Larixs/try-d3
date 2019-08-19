import * as d3 from 'd3';
import { createCanvasAndContext} from 'utils/index'
import { SimulationNodeDatum, Force } from 'd3-force';

interface rangeDataStructure extends SimulationNodeDatum{
    color: Color;
}
enum Color {
    Brown = 'brown',
    Blue = 'steelblue',
    Cade = 'cadetblue',
}

const width = 960, height = 500;
const { canvas, context } = createCanvasAndContext({width, height});
document.body.appendChild(canvas);


const N = 60;
// const nodes = d3.range(nodesNum).map(i=>{
//     return {
//         index: i,
//         color: i < nodesNum / 2 ? Color.Brown : Color.Blue
//     }
// });
let nodes:({index: number, color: any})[] = [];
const colors:Color[]= [Color.Brown, Color.Blue, Color.Cade];
colors.forEach((color)=>{
    nodes = nodes.concat(d3.range(N).map(i => ({
        index: i,
        color: color
    })))
})


const simulation = d3.forceSimulation(nodes)
    .force(Color.Brown + 'x', isolate(d3.forceX(-width / 3), function(d: rangeDataStructure) { return d.color === Color.Brown; }))
    .force(Color.Blue + 'x', isolate(d3.forceX(width / 3), function(d: rangeDataStructure) { return d.color === Color.Blue }))
    .force(Color.Cade + 'x', isolate(d3.forceX(0), function(d: rangeDataStructure) { return d.color === Color.Cade }))
    .force(Color.Brown + 'y', isolate(d3.forceY(), function(d: rangeDataStructure) { return d.color === Color.Brown; }))
    .force(Color.Blue + 'y', isolate(d3.forceY(), function(d: rangeDataStructure) { return d.color === Color.Blue }))
    .force(Color.Cade + 'y', isolate(d3.forceY(-100).strength(0.2), function(d: rangeDataStructure) { return d.color === Color.Cade }))
    .force(Color.Brown + 'charge', isolate(d3.forceManyBody().strength(-20), function(d: rangeDataStructure) { return d.color === Color.Brown }))
    .force(Color.Blue + 'charge', isolate(d3.forceManyBody().strength(-20), function(d: rangeDataStructure) { return d.color === Color.Blue }))
    .force(Color.Cade + 'charge', isolate(d3.forceManyBody().strength(-15), function(d: rangeDataStructure) { return d.color === Color.Cade }))
    // .force("charge", d3.forceManyBody().strength(-10)) // forceManyBody可以模拟重力（strength为正数）和电子的斥力(strength为负数)
    .on('tick', ticked);

function ticked() {
    context.clearRect(0, 0, width, height);
    context.save(); // 保留当前的一些属性，例如fillColor等
    context.translate(width / 2, height / 2); // 平移原点
    nodes.forEach(drawNodes);
    context.restore();// 恢复到上次保存的属性
}
function drawNodes(d:rangeDataStructure) {
    context.beginPath();
    context.moveTo(d.x + 3, d.y);
    context.arc(d.x, d.y, 3, 0, 2 * Math.PI);
    context.fillStyle = d.color;
    context.fill();
}

type t = (d: rangeDataStructure) => boolean

function isolate(force: Force<rangeDataStructure, undefined>, filter:t ){
    const initialize = force.initialize;
    force.initialize = function (nodes) {
        initialize.call(force, nodes.filter(filter))
    };
    return force;
}

