import * as d3 from "d3-selection";
import { Selection } from "d3-selection";
import * as d3Scale from "d3-scale";
import * as d3Array from "d3-array";
import { Graph, Node, Edge } from "./Graph";


export class Heatmap {

	private _width: number;
	private _height: number;
	private _colorDomain: Array<string>;
	private _location: Selection<any, {}, any, {}>;

	constructor(width: number, height: number, colorDomain: Array<string>, location: Selection<any, {}, any, {}>) {
		this._width = width;
		this._height = height;
		this._colorDomain = colorDomain;
		this._location = location;
	}

	get height(): number {
		return this._height;
	}
	set height(height: number) {
		this._height = height;
	}
	get width(): number {
		return this.width;
	}
	set width(_width: number) {
		this.width = _width;
	}
	get colorDomain(): Array<string> {
		return this._colorDomain;
	}
	set colorDomain(colorDomain: Array<string>) {
		this._colorDomain = colorDomain;
	}

	public draw(graph: Graph) {
		let arraySize = graph.nodes.length;


		/* this color scale determines the coloring of the matrix heatmap.
		The domain is from the lightest edge in the set of edges to the
		heaviest edge in the set of edges. The range is defaultColorDomain,
		which can be changed */
		let colorMap = d3Scale.scaleLinear<string>()
			.domain(this.createColorDomain(graph.edges))
			.range(this._colorDomain);

		let slots = this._location.selectAll("rect")
			.data(graph.edges, function (d: Edge): string { return "" + d.id; })
		let slotsEnter = slots.enter()
			.append("rect")
			.attr("stroke", "black")
			.attr("id", function (d) {
				return "heatmap-" + d.id;
			});

		slots = slots.merge(slotsEnter)
			.attr("x", function (d) {
				return (+d.source.id / graph.nodes.length) * 100 + "%";
			})
			.attr("y", function (d) {
				return (+d.target.id / graph.nodes.length) * 100 + "%";
			})
			.attr("width", this._width / arraySize)
			.attr("height", this._height / arraySize)
			.attr("fill", function (d) {
				return colorMap(d.weight);
			})

	}

	/* takes a list of edges.
	returns a 2-element array with the lightest edge weight as the first element
	and the heaviest edge weight as the second element.*/
	public createColorDomain(edges: Array<Edge>) {
		return d3Array.extent(edges, function (d: Edge): number {
			return d.weight;
		});
	}

}
