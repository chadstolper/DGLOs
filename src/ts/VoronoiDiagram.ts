import * as d3 from "d3";
import { polygonHull } from "d3-polygon"
import { ForceDirectedGraph } from "./ForceDirectedGraph";
import { DynamicGraph, Graph, Node, Edge } from "./Graph";
import { Selection } from "d3-selection";
import { scaleOrdinal, schemeCategory20 } from "d3-scale";

const color = scaleOrdinal<string | number, string>(schemeCategory20);

//cousin to chef boyardee
export class VoronoiDiagram extends ForceDirectedGraph {
	private _voronoi = d3.voronoi().extent([[-1, -1], [this.width + 1, this.height + 1]]); //set dimensions of voronoi
	private _polygons: Selection<any, {}, any, {}>;

	constructor(graph: DynamicGraph, chart: Selection<any, {}, any, {}>) {
		super(graph, chart);
		// super.draw(graph.timesteps[0]);
	}

	protected initSVG() {
		super.initSVG();
		this._polygons = this.chart.append("g")
			.classed("path", true);
	}

	protected tickInternal() {
		super.tickInternal();

		this._polygons = this._polygons.selectAll("path")
			.data(this._voronoi.polygons(
				this.graph.timesteps[0].nodes.map(function (d: Node) { return [d.x, d.y]; }) as [number, number][]
			))
			.enter().append("path")
			.attr("d", function (d) {
				return d ? "M" + d.join("L") + "Z" : null; //copied, i half-understand it...
			})
			.style("stroke", "black")
			.style("fill", "none")
			.style("stroke-width", "1px");

	}
}