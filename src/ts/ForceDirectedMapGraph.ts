import * as d3 from "d3";
import { polygonHull } from "d3-polygon"
import { ForceDirectedGraph } from "./ForceDirectedGraph";
import { DynamicGraph, Graph, Node, Edge } from "./Graph";
import { Selection } from "d3-selection";
import { scaleOrdinal, schemeCategory20 } from "d3-scale";
import { Coordinate, CoordinateGroup } from "./CoordinateGroup";

const color = scaleOrdinal<string | number, string>(schemeCategory20);

export class ForceDirectedMapGraph extends ForceDirectedGraph {
	//NOTE TO SELF, AGAIN: STOP DELETING SO MUCH STUFF!!!
	private _pointList: number[][];
	private _hull: Selection<any, {}, any, {}>;

	constructor(graph: DynamicGraph, chart: Selection<any, {}, any, {}>) {
		super(graph, chart);
		// super.draw(graph.timesteps[0]);
	}

	protected initSVG() {
		super.initSVG();
		this.chart.on("tick", this.ticked(this));
	}

	protected ticked(self: ForceDirectedMapGraph) {
		return function (): void {
			console.log("hull tick")
			self._pointList = self.graph.timesteps[0].nodes.map(function (d: Node) { return [d.x, d.y]; });
			self._hull = self.chart.selectAll("path")
				.datum(this._pointList);
			self._hull.exit().remove();
			let hullIn = self._hull
				.enter().insert("path", "circle") //insert or append?
			self._hull.merge(hullIn);
			self._hull
				.style("stroke", "yellow") //TODO: make into function, color by group, once groups are a thing...
				.style("fill", "yellow")
				.style("stroke-width", 40)
				.style("stroke-linejoin", "round")
				.style("opacity", .2)
				.attr("d", function (d: any) {
					return "M" + polygonHull(d.values.map(function (i: any) { return [i.x, i.y]; }))
						.join("L") + "Z";
				});
		}
	}
}