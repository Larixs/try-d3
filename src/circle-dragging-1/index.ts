/*
* https://observablehq.com/@d3/circle-dragging-i
* */

import * as d3Selection from "d3-selection";
import { createSvgElement} from 'utils/index'
import { drag, dragStart, dragEnd, dataStructure, createRandomCircles, createCircles } from "./func";
import * as d3Chromatic from "d3-scale-chromatic";
import * as d3Drag from "d3-drag";

const width = 960, height = 600, circleRadius = 32;
document.body.appendChild(createSvgElement('svg', {
    "stroke-width": 2,
    width,
    height
}));
const svg = d3Selection.select('svg');

let circles = createRandomCircles(20, width, height, circleRadius);

bindCircleWithData();

const button = document.body.querySelector('#add-circle');
button.addEventListener('click', function () {
    circles.push(...createCircles(5, width, height, circleRadius));
    bindCircleWithData();
}, false);


export function bindCircleWithData() {
    svg
        .selectAll('circle')
        //@ts-ignore
        .data(circles, function (d:dataStructure) {
            return d.id
        }) // 需要为每个节点绑定key，不然在增加圆圈后，会出现节点拉拽错位的情况
        .enter()
        .append('circle')
        .attr('cx', (d: dataStructure) => d.x)
        .attr('cy', (d: dataStructure) => d.y)
        .attr('r', circleRadius)
        .attr('fill', () => d3Chromatic.schemeSet3[Math.floor(Math.random() * 12)])
        .call(
            d3Drag
                .drag()
                .on('start', dragStart)
                .on('drag', drag)
                .on('end', dragEnd)
        )
}

