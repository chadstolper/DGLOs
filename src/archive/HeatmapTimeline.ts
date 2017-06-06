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

	set width(w: number) {
		this._width = w;
	}

	set height(h: number) {
		this._height = h;
	}

	constructor(dynamicGraph: DynamicGraph, location: Selection<any, {}, any, {}>, colorDomain?: Array<string>) {
		this._dynamicGraph = dynamicGraph;
		this._location = location;
		this._colorDomain = colorDomain;
		if (location.attr("width")) { this._width = +location.attr("width"); }
		if (location.attr("height")) { this._height = +location.attr("height"); }
		// this.draw(this._dynamicGraph.timesteps[0]);
	}

	public draw(graph: Graph) {
		let colorDomain = this._colorDomain;
		let dgraph = this._dynamicGraph;
		let size = Math.sqrt(2 * (this._width * this._height / dgraph.timesteps.length));
		this._location.selectAll("svg.timestamp")
			.data(this._dynamicGraph.timesteps)
			.enter().append("svg")
			.attr("width", size)
			.attr("height", size)
			//.attr("x", function (d, i) { return (i / dgraph.timesteps.length) * 100 + "%"; })
			.classed("timestamp", true)
			.each(function (d, i) {
				console.log(this);
				let heatmap: Heatmap = new Heatmap(d, d3.select(this), colorDomain);
			});

	}

}
