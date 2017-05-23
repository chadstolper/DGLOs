import { Heatmap } from "./Heatmap"
import { DynamicGraph, Graph } from "./Graph";
import { Selection } from "d3-selection";
import * as d3 from "d3-selection";


export class HeatmapTimeline /*extends Heatmap*/ {

	private _dynamicGraph: DynamicGraph;
	private _location: Selection<any, {}, any, {}>;
	private _width: number;
	private _height: number;
	private _colorDomain: Array<string>;

	//private _curGraph: Graph;
	//private _numTimeSteps: number;
	//private _graphArray: Array<Graph>;
	//private _svg: Selection<any, {}, any, {}>;


	constructor(width: number, height: number, colorDomain: Array<string>, location: Selection<any, {}, any, {}>,
		dynamicGraph: DynamicGraph) {
		this._height = height;
		this._width = width;
		this._dynamicGraph = dynamicGraph;
		this._location = location;
		this._colorDomain = colorDomain;
		this.init();
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

	private init(/*colorDomain: Array<string>, location: Selection<any, {}, any, {}>*/) {
		let width = this._width
		let height = this._height
		let location = this._location;
		let colorDomain = this._colorDomain;
		d3.selectAll("svg.timestamp")
			.attr("width", this._width)
			.attr("height", this._height)
			.data(this._dynamicGraph.timesteps)
			.enter().append("svg")
			.classed("timestamp", true)
			.each(function (d, i) {
				console.log(this);
				let heatmap: Heatmap = new Heatmap(width, height, colorDomain, d3.select(this));
				heatmap.draw(d);
			});

	}

	private heatmapGenerator() {
		let self = this;

	}

	// private functio() {
	// 	let self = this;
	// 	return function (d, i) {
	// 		let heatmap: Heatmap = new Heatmap()
	// 		self.draw(self._curGraph);
	// 	}

	// }

	// private svgFactory() {
	// 	let width = super.width;
	// 	let height = super.height;
	// 	let svg = d3.selectAll("body").append("svg")
	// 		.attr("width", width)
	// 		.attr("height", height);
	// 	return svg;
	// }

}
