import * as d3force from "d3-force";
import { Simulation } from "d3-force";
import { Selection } from "d3-selection";
import { scaleOrdinal, schemeCategory20 } from "d3-scale";
import { DynamicDrinkGraph } from "./DummyGraph";
import { DynamicGraph, Graph, Node, Edge } from "./Graph";
import { transition } from "d3-transition";

export class ForceDirectedGraph {
	protected _width = 500;
	protected _height = 500;
	private _graph: DynamicGraph;
	private _simulation: Simulation<{}, undefined>;
	private color = scaleOrdinal<string | number, string>(schemeCategory20); //random color picker.exe
	private _chart: Selection<any, {}, any, {}>;
	private _linkGlyphs: Selection<any, {}, any, {}>;
	private _nodeGlyphs: Selection<any, {}, any, {}>; //groups for "specific"
	private linksG: Selection<any, {}, any, {}>;
	private nodesG: Selection<any, {}, any, {}>; //groups for all
	private _alpha = .3;
	private _radiusCircle = 10;

	public constructor(graph: DynamicGraph, chart: Selection<any, {}, any, {}>) {
		this._chart = chart;
		this._graph = graph;
		this._width = +chart.attr("width");
		this._height = +chart.attr("height");
		this.initSVG();
	}

	get graph() {
		return this._graph;
	}

	get chart() {
		return this._chart;
	}

	protected get simulation() {
		return this._simulation;
	}

	protected get nodeGlyphs() {
		return this._nodeGlyphs;
	}
	protected get linkGlyphs() {
		return this._linkGlyphs;
	}
	protected get width() {
		return this._width;
	}
	protected get height() {
		return this._height;
	}
	public set alpha(alpha: number) {
		this._alpha = alpha;
	}
	public set radius(newRad: number) {
		this._radiusCircle = newRad;
	}


	protected initSimulation() { //begin simulation of the graphics
		this._simulation = d3force.forceSimulation() //init sim for chart?
			.force("link", d3force.forceLink().id(function (d: Node): string { return "" + d.id })) //pull applied to link lengths
			.force("charge", d3force.forceManyBody().strength(-50)) //push applied to all things from center
			//.force("charge", d3force.forceManyBody()) //push applied to all things from center
			.force("center", d3force.forceCenter(this._width / 2, this._height / 2)) //define center
			.on("tick", this.ticked(this));

		// (this._simulation.force("link") as d3force.ForceLink<Node, Edge>).strength(function (d: Edge): number { return d.weight * +.05 });

		//console.log("sim started")
	}

	protected ticked(self: ForceDirectedGraph) { //tock
		return () => this.tickInternal();
	}

	protected tickInternal() { //tick
		//console.log("tick", this);
		if (this.linkGlyphs !== undefined) {
			this.linkGlyphs //as in the lines representing links
				.attr("x1", function (d: Edge) { return d.source.x; })
				.attr("y1", function (d: Edge) { return d.source.y; })
				.attr("x2", function (d: Edge) { return d.target.x; })
				.attr("y2", function (d: Edge) { return d.target.y; });
		} else {
			console.log("No links!");
		}
		if (this.nodeGlyphs !== undefined) {
			this.nodeGlyphs
				.attr("cx", function (d: Node) {
					return d.x;
				})
				.attr("cy", function (d: Node) { return d.y; });
		} else {
			console.log("No nodes!");
		}
	}












	protected initSVG() { //manipulate a passed svg to assign groups for nodes and edges
		this.linksG = this._chart.append("g")
			.classed("links", true);

		this.nodesG = this._chart.append("g")
			.classed("node", true);
	}

	public draw(graph: Graph): void { //draw call for graphics, and check for simulation running
		this.drawLinks(graph.edges);
		this.drawNodes(graph.nodes);

		//console.log(this.linkGlyphs);
		//console.log(this.nodeGlyphs);

		if (this._simulation === undefined) {
			this.initSimulation();
		}

		if (this._simulation !== undefined) {
			this._simulation.nodes(graph.nodes); //call for sim tick (and apply force to nodes?)
			(this._simulation.force("link") as d3force.ForceLink<Node, Edge>).links(graph.edges);

			this._simulation.alpha(this._alpha).restart();
		}
	}





	protected drawLinks(edges: Edge[]) { //does what it says on the tin
		this._linkGlyphs = this.linksG.selectAll("line")
			.data(edges, function (d: Edge): string { return "" + d.id; }); //animate existing, dont create new line
		this.linkGlyphs.exit().remove();
		let linkEnter = this.linkGlyphs.enter().append("line") //create a new line for each edge in edgelist (subdivs defined)
			.attr("stroke", "black");
		this._linkGlyphs = this.linkGlyphs.merge(linkEnter)
		this.linkGlyphs//.transition()
			.attr("stroke-width", function (d: Edge): number { return d.weight; });
	}

	protected drawNodes(nodes: Node[]) { //does what it says on the tin
		this._nodeGlyphs = this.nodesG.selectAll("circle")
			.data(nodes, function (d: Node): string { return "" + d.id });
		this.nodeGlyphs.exit().remove();
		let nodeEnter = this.nodeGlyphs.enter().append("circle")
			.attr("id", function (d: any): string | number { return d.name; });
		this._nodeGlyphs = this.nodeGlyphs.merge(nodeEnter);
		this.nodeGlyphs
			.attr("r", this._radiusCircle)
			.attr("fill", (d: Node) => {
				return this.color(d.id);
			});
	}
}