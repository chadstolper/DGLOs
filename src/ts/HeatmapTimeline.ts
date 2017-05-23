import { Heatmap } from "./Heatmap"
import { DynamicGraph, Graph } from "./Graph";
import { Selection } from "d3-selection";
import * as d3 from "d3-selection";


export class HeatmapTimeline extends Heatmap {

	private _dynamicGraph: DynamicGraph;
	private _curGraph: Graph;
	private _numTimeSteps: number;
	private _graphArray: Array<Graph>;
	private _svg: Selection<any, {}, any, {}>;


	constructor(width: number, height: number, colorDomain: Array<string>, location: Selection<any, {}, any, {}>,
		dynamicGraph: DynamicGraph) {
		super(width, height, colorDomain, location);
		this._dynamicGraph = dynamicGraph;
		this._numTimeSteps = dynamicGraph.timesteps.length;
		this._svg = location;
		this.init(colorDomain, location);

	}


	// //this function will move the _curGraph forward through the _dynamicGraph.timesteps array,
	// //looping back to the start from the finish. 
	// private timeStepForward() {
	// 	this._curTimeStep = (this._curTimeStep + 1) % this._numTimeSteps;
	// 	this._curGraph = this._dynamicGraph.timesteps[this._curTimeStep];
	// }

	// //this function is similar to timeStepForward(), except it moves _curGraph backwards
	// //through the _dynamicGraph.timestamps array.
	// private timeStepBackward() {
	// 	this._curTimeStep = (this._curTimeStep - 1) % this._numTimeSteps;
	// 	this._curGraph = this._dynamicGraph.timesteps[this._curTimeStep];
	// }

	private init(colorDomain: Array<string>, location: Selection<any, {}, any, {}>) {
		for (let n of this._dynamicGraph.timesteps) {
			super.draw(n);
		}
	}
	private svgFactory() {
		let width = super.width;
		let height = super.height;
		let svg = d3.selectAll("body").append("svg")
			.attr("width", width)
			.attr("height", height);
		return svg;
	}

}
