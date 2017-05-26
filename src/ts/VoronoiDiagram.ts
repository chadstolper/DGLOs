import * as d3 from "d3";
import { polygonHull } from "d3-polygon"
import { ForceDirectedGraph } from "./ForceDirectedGraph";
import { DynamicGraph, Graph, Node, Edge } from "./Graph";
import { Selection } from "d3-selection";
import { scaleOrdinal, schemeCategory20 } from "d3-scale";
import { VoronoiLayout } from "d3-voronoi";

const color = scaleOrdinal<string | number, string>(schemeCategory20);

//cousin to chef boyardee
export class VoronoiDiagram extends ForceDirectedGraph {
	private _voronoi: VoronoiLayout<Node> = d3.voronoi<Node>().extent([[-1, -1], [this.width + 1, this.height + 1]]) //set dimensions of voronoi
		.x(function (d: Node) { return d.x; })
		.y(function (d: Node) { return d.y; });
	private _polygons: Selection<any, {}, any, {}>;

	constructor(graph: DynamicGraph, chart: Selection<any, {}, any, {}>) {
		super(graph, chart);
		// super.draw(graph.timesteps[0]);
	}

	protected initSVG() {
		super.initSVG();
		this._polygons = this.chart.append("g")
			.classed("voronoi", true)
			.selectAll("path");
	}

	protected fillInternal() {
		return (d: any, i: number) => color(this.graph.timesteps[0].nodes[i].id);
	}

	protected tickInternal() {
		super.tickInternal();

		this._polygons = this._polygons
			.data(this._voronoi.polygons(this.graph.timesteps[0].nodes))

		this._polygons.exit().remove();
		let newPoly = this._polygons.enter().append("path")
		this._polygons = this._polygons.merge(newPoly)
			//.style("stroke", "black")
			.style("fill", this.fillInternal())
			//.style("stroke-width", "0.5px")
			.attr("d", function (d: any) {
				return d ? "M" + d.join("L") + "Z" : null;
			});;


		//////////PLAN B//////////
		// this._polygons.remove();
		// this._polygons = this._polygons
		// 	.data(this._voronoi.polygons(this.graph.timesteps[0].nodes));
		// this._polygons.enter().append("path")
		// 	.style("stroke", "black")
		// 	.style("fill", "none")
		// 	.style("stroke-width", "0.5px")
		// 	.attr("d", function (d: any) {
		// 		return d ? "M" + d.join("L") + "Z" : null;
		// 	});;

	}
}