import * as d3Selection from "d3-selection";
import {SimulationNodeDatum} from "d3-force";
import * as d3Array from "d3-array";
import * as d3Chromatic from "d3-scale-chromatic";
import * as d3Drag from "d3-drag";


export interface dataStructure {
    x: number;
    y: number;
    id: number;
}
export function dragStart() {
    d3Selection.select(this).raise().attr('stroke', 'pink');
}

export function drag(d:SimulationNodeDatum) {
    d3Selection
        .select(this)
        .attr("cx", d.x = d3Selection.event.x)
        .attr("cy", d.y = d3Selection.event.y);
}

export function dragEnd() {
    d3Selection.select(this).attr('stroke', null);
}

export function initRandomCirclePosition(width: number, height: number, circleRadius: number): dataStructure {
    return {
        x: Math.random() * (width - circleRadius * 2) + circleRadius,
        y: Math.random() * (height - circleRadius * 2) + circleRadius,
        id: Math.random()
    }
}
export function initCirclePosition(width: number, height: number, circleRadius: number): dataStructure {
    return {
        x: circleRadius,
        y: circleRadius,
        id: Math.random()
    }
}

export function createRandomCircles(num:number, width: number, height: number, circleRadius: number) {
    return d3Array.range(num).map(()=>initRandomCirclePosition(width,height,circleRadius))
}
export function createCircles(num:number, width: number, height: number, circleRadius: number) {
    return d3Array.range(num).map(()=>initCirclePosition(width,height,circleRadius))
}

