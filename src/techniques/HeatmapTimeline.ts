import { Heatmap } from "./Heatmap"
import { DynamicGraph, Graph } from "./Graph";
import { Selection } from "d3-selection";
import * as d3 from "d3-selection";


export class HeatmapTimeline {


	private _dynamicGraph: DynamicGraph;
	private _location: Selection<any, {}, any, {}>;
	private _width: number;
	private _height: number;
	private _colorDomain = ["white", "gold"];

	constructor(dynamicGraph: DynamicGraph, location: Selection<any, {}, any, {}>, colorDomain?: Array<string>) {
		this._dynamicGraph = dynamicGraph;
		this._location = location;
		this._colorDomain = colorDomain;
		this.draw(this._dynamicGraph.timesteps[0]);
	}

	public draw(graph: Graph) {
		let width = this._width
		let height = this._height
		let colorDomain = this._colorDomain;
		d3.selectAll("svg.timestamp")
			.data(this._dynamicGraph.timesteps)
			.enter().append("svg")
			.attr("width", this._width)
			.attr("height", this._height)
			.classed("timestamp", true)
			.each(function (d, i) {
				console.log(this);
				let heatmap: Heatmap = new Heatmap(d, d3.select(this), ["white", "gold"]);
			});

	}

}
