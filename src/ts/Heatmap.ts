import * as d3 from "d3-selection";
import { Selection } from "d3-selection";
import * as d3Scale from "d3-scale";
import * as d3Array from "d3-array";
import { Graph, Node, Edge } from "./Graph";
import { select } from 'd3-selection';
import 'd3-transition';
import { Visualization } from "./interfaceStaticVisualization";


export class Heatmap implements Visualization {

	protected _width = 750;
	protected _height = 750;
	protected _graph: Graph;
	private _colorDomain = ["white", "black"];
	protected _selection: Selection<any, {}, any, {}>;


	constructor(graph: Graph, div: Selection<any, {}, any, {}>, colorDomain?: Array<string>) {
		if (colorDomain !== undefined) {
			this._colorDomain = colorDomain;
		}
		this._selection = div;
		this._graph = graph;
		this.draw(this._graph);
	}

	get height(): number {
		return this._height;
	}
	set height(height: number) {
		this._height = height;
	}
	get width(): number {
		return this._width;
	}
	set width(width: number) {
		this._width = width;
	}
	get colorDomain(): Array<string> {
		return this._colorDomain;
	}
	set colorDomain(colorDomain: Array<string>) {
		this._colorDomain = colorDomain;
	}
	get selection(): Selection<any, {}, any, {}> {
		return this._selection
	}
	set selection(location: Selection<any, {}, any, {}>) {
		this._selection = location;
	}
	get graph(): Graph {
		return this._graph;
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

		let slots = this._selection.selectAll("rect")
			.data(graph.edges, function (d: Edge): string { return "" + d.id; })

		slots.exit().remove();

		let slotsEnter = slots.enter()
			.append("rect")
			.attr("stroke", "black")
			.attr("id", function (d) {
				return "heatmap-" + d.id;
			})
		//.attr("id", function (d: Edge) { return d.id });

		slots = slots.merge(slotsEnter)
		slots.transition() //TODO: transition slots
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
