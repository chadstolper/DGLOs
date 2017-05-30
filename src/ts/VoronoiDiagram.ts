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
	private _voronoi: VoronoiLayout<Node> = d3.voronoi<Node>().extent([[-1, -1], [this._width + 1, this._height + 1]]) //set dimensions of voronoi
		.x(function (d: Node) { return d.x; })
		.y(function (d: Node) { return d.y; });
	private _polygons: Selection<any, {}, any, {}>;

	//ugliness
	private _noisePoints: Node[];
	private _cardinalPoints: [number, number][];

	constructor(graph: DynamicGraph, chart: Selection<any, {}, any, {}>) {
		super(graph, chart);
	}

	protected initSVG() {
		super.initSVG();
		this._polygons = this.chart.insert("g", ":first-child")
			.classed("voronoi", true)
			.selectAll("path");

		this._cardinalPoints = [[0, 0], [this._width / 2, 0], [this._width, 0], [0, this._height / 2], [this._width, this._height / 2], [0, this._height], [this._width / 2, this._height], [this._height, this._width]];
		this._noisePoints = [new Node("noise0", "noise", ""), new Node("noise1", "noise", ""), new Node("noise2", "noise", ""), new Node("noise3", "noise", ""), new Node("noise4", "noise", ""), new Node("noise5", "noise", ""), new Node("noise6", "noise", ""), new Node("noise7", "noise", "")];

		for (let i = 0; i < this._cardinalPoints.length; i++) //give noise nodes x,y of cardinals
		{
			this._noisePoints[i].x = this._cardinalPoints[i][0];
			this._noisePoints[i].y = this._cardinalPoints[i][1];
		}
	}

	protected fillInternal() {
		// return (d: any, i: number) => color(this.graph.timesteps[0].nodes[i].type);
		let hold = this.graph;
		return function (d: any, i: number): string {
			console.log(d.type);
			if (hold.timesteps[0].nodes[i].type === "noise") {
				console.log("noise objerct")
				return "black";
			}
			return color(hold.timesteps[0].nodes[i].type);
		}
	}

	protected tickInternal() {
		super.tickInternal();
		let forTest = this.graph.timesteps[0].nodes.concat(this._noisePoints)
		this._polygons = this._polygons
			.data(this._voronoi.polygons(
				(forTest)
			));

		// for (let str of forTest) {
		// 	console.log(str);
		// }
		// console.log(this.graph.timesteps[0].nodes.concat(this._noisePoints))

		this._polygons.exit().remove();
		let newPoly = this._polygons.enter().append("path")
		this._polygons = this._polygons.merge(newPoly)
			.style("stroke", this.fillInternal())
			.style("fill", this.fillInternal())
			//.style("stroke-width", "0.5px")
			.attr("d", function (d: any) {
				return d ? "M" + d.join("L") + "Z" : null;
			});

		//alter FD attr of graphics
		this.nodeGlyphs.attr("stroke", "black")
			.attr("stroke-width", "0.5px")
			.attr("fill", this.fillInternal())
		this.linkGlyphs.attr("stroke", "grey")
			.attr("stroke-width", "0.25px")


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