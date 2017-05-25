import * as d3 from "d3";
import { ForceDirectedGraph } from "./ForceDirectedGraph";
import { DynamicGraph, Graph, Node, Edge } from "./Graph";
import { Selection } from "d3-selection";
import { scaleOrdinal, schemeCategory20 } from "d3-scale";
import { Coordinate, CoordinateGroup } from "./CoordinateGroup";

const color = scaleOrdinal<string | number, string>(schemeCategory20);

export class ForceDirectedMapGraph extends ForceDirectedGraph {
	//note to self, stop deleting so much stuff
	private pointList: [][];

	constructor(graph: DynamicGraph, chart: Selection<any, {}, any, {}>) {
		super(graph, chart);

		super.draw(graph.timesteps[0]); //draw graph

		this.pointList = graph.timesteps[0].nodes.map(function (d: Node) { return [d.x, d.y]; })
		let hull = chart.append("path")
			.classed("hull", true)
			.datum(d3.polygonHull(this.pointList))
			.attr("d", function (d: any): any {
				return "M" + d.join("L") + "Z";
			})











		// let pathData: number[][] = [this.graph.timesteps[0].nodes.length][this.graph.timesteps[0].nodes.length]; //array of x,ycoordinates
		// for (let i = 0; i < graph.timesteps[0].nodes.length; i++) {
		// 	// let hold = new Coordinate(graph.timesteps[0].nodes[i].x, graph.timesteps[0].nodes[i].y)
		// 	pathData[i][0] = this.graph.timesteps[0].nodes[i].x;
		// 	pathData[i][1] = this.graph.timesteps[0].nodes[i].y;
		// }
		// console.log(pathData)

		// let path = d3.path();

		// let thing = d3.polygonHull(pathData)





	}

	protected initSVG() {
		super.initSVG();

	}

}