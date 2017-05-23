import { Heatmap } from "./Heatmap"
import { DynamicGraph, Graph } from "./Graph";
import { Selection } from "d3-selection";
import * as d3 from "d3-selection";


export class HeatmapTimeline {


	private _dynamicGraph: DynamicGraph;
	private _location: Selection<any, {}, any, {}>;
	private _width: number;
	private _height: number;
	private _colorDomain: Array<string>;

	constructor(width: number, height: number, colorDomain: Array<string>, location: Selection<any, {}, any, {}>,
		dynamicGraph: DynamicGraph) {
		this._height = height;
		this._width = width;
		this._dynamicGraph = dynamicGraph;
		this._location = location;
		this._colorDomain = colorDomain;
		this.init();
	}

	private init() {
		let width = this._width
		let height = this._height
		let location = this._location;
		let colorDomain = this._colorDomain;
		console.log(width, height);
		d3.selectAll("svg.timestamp")
			.data(this._dynamicGraph.timesteps)
			.enter().append("svg")
			.attr("width", this._width)
			.attr("height", this._height)
			.classed("timestamp", true)
			.each(function (d, i) {
				console.log(this);
				let heatmap: Heatmap = new Heatmap(width, height, colorDomain, d3.select(this));
				heatmap.draw(d);
			});

	}

}
