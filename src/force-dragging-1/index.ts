/**
https://bl.ocks.org/mbostock/2675ff61ea5e063ede2b5d63c08020c7

 drag events文档
 https://github.com/d3/d3-drag#drag-events

 **/

declare const staticPath: string;
import { createSvgElement} from 'utils/index'
import * as d3Force from 'd3-force';
import * as d3Fetch from 'd3-fetch';
import * as d3Selection from "d3-selection";
import * as d3Drag from "d3-drag";
import {SimulationNodeDatum, ForceLink, SimulationLinkDatum} from "d3-force";
import './index.css';

interface nodeDataStructure extends SimulationNodeDatum{
    id: any,
    group: any
}
interface linkDataStructure extends SimulationLinkDatum<SimulationNodeDatum>{
    source: any,
    target: any,
    value: any,
}

function init() {
    const svg = createSvgElement('svg',{
        width: width,
        height: height
    });
    document.body.appendChild(svg);
    return d3Selection.select('svg')
}
const width = 960, height = 600;
const svg = init();

const simulation = d3Force.forceSimulation()
    .force('link', d3Force.forceLink().id((d:nodeDataStructure) => d.id))
    .force('charge', d3Force.forceManyBody())
    .force('center', d3Force.forceCenter(width / 2, height / 2));

d3Fetch.json(`${staticPath}/force-dragging-1/miserables.json`).then((graph)=>{
    const link = svg.append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(graph.links)
        .enter()
        .append("line");
    const nodes =
        svg.append('g')
            .attr('class', 'nodes')
            .selectAll('circle')
            .data(graph.nodes)
            .enter()
            .append('circle')
            .attr('r', 2.5)
            .call(
                d3Drag
                    .drag()
                    .on("start", dragStarted)
                    .on("drag", dragged)
                    .on("end", dragended)
            );
    nodes.append('title') // ??为啥不可以连续操作，直接给nodes添加title
            .text(function (d: nodeDataStructure) {
                return d.id;
            });

    simulation.nodes(graph.nodes)
        .on('tick', ticked);
    simulation.force<ForceLink<SimulationNodeDatum, SimulationLinkDatum<SimulationNodeDatum>>>('link')
        .links(graph.links);
    function dragStarted(d: nodeDataStructure) {
        if(d3Selection.event.active === 0){
            // active表示除了当前dragStart事件以外，还有几个dragStart事件
            simulation.alphaTarget(0.1).restart();
        }
        d.fx = d.x;
        d.fy = d.y;
    }
    function dragged(d: nodeDataStructure) {
        d.fx = d3Selection.event.x;
        d.fy = d3Selection.event.y;
    }
    function dragended(d: nodeDataStructure) {
        if(d3Selection.event.active === 0){
            // active表示除了当前dragStart事件以外，还有几个dragStart事件
            simulation.alphaTarget(0);
        }
        d.fx = null;
        d.fy = null;
    }
    function ticked() {
        link
            .attr('x1', (d:linkDataStructure) => d.source.x)
            .attr('y1', (d:linkDataStructure) => d.source.y)
            .attr('x2', (d:linkDataStructure) => d.target.x)
            .attr('y2', (d:linkDataStructure) => d.target.y);
        nodes.attr('cx', (d:nodeDataStructure) => d.x)
            .attr('cy', (d:nodeDataStructure) => d.y)
    }
}).catch(error=>{
    console.log(error);
});

