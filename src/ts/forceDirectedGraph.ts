import * as d3force from "d3-force";
import { Simulation } from "d3-force";
import { Selection } from "d3-selection";
import { scaleOrdinal, schemeCategory20 } from "d3-scale";
import { DynamicDrinkGraph } from "./DummyGraph";
import { Graph, Node, Edge } from "./Graph";

export class ForceDirectedGraph {
	private time = 0;
	private width: number;
	private height: number;
	private graph: DynamicDrinkGraph;
	private simulation: Simulation<{}, undefined>;
	private color = scaleOrdinal<string | number, string>(schemeCategory20); //random color picker.exe
	private chart: Selection<any, {}, any, {}>;
	private linkGlyphs: Selection<any, {}, any, {}>;
	private nodeGlyphs: Selection<any, {}, any, {}>; //groups for "specific"
	private linksG: Selection<any, {}, any, {}>;
	private nodesG: Selection<any, {}, any, {}>; //groups for all

	constructor(graph: DynamicDrinkGraph, chart: Selection<any, {}, any, {}>, width: number, height: number) {
		this.width = width;
		this.height = height;
		this.time = 0;
		this.chart = chart;
		this.graph = graph;
		this.initSVG();
		this.draw(graph.timesteps[this.time]);
	}

	initSimulation() { //begin simulation of the graphics
		this.simulation = d3force.forceSimulation() //init sim for chart?
			.force("link", d3force.forceLink().id(function (d: Node): string { return "" + d.id })) //pull applied to link lengths
			.force("charge", d3force.forceManyBody().strength(-10)) //push applied to all things from center
			.force("center", d3force.forceCenter(this.width / 2, this.height / 2)) //define center
			.on("tick", this.ticked);
	}

	initSVG() { //manipulate a passed svg to assign groups for nodes and edges
		this.chart.on("click", this.mouseClicked);

		this.linksG = this.chart.append("g")
			.classed("links", true);

		this.nodesG = this.chart.append("g")
			.classed("node", true);
	}

	ticked() { //tock
		// console.log("ticking...");
		console.log(this.linkGlyphs);
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

	draw(graph: Graph): void { //draw call for graphics, and check for simulation running
		this.drawLinks(graph.edges);
		this.drawNodes(graph.nodes);

		console.log(this.linkGlyphs);
		console.log(this.nodeGlyphs);

		if (this.simulation === undefined) {
			this.initSimulation();
		}

		if (this.simulation !== undefined) {
			this.simulation.nodes(graph.nodes); //call for sim tick (and apply force to nodes?)
			(this.simulation.force("link") as d3force.ForceLink<Node, Edge>).links(graph.edges)
				.strength(function (d: Edge): number { return d.weight * -.01 });
		}
	}

	mouseClicked() { //mouselistener, update timestep of graph
		console.log(this.graph.timesteps[this.time]);
		let curGraph: Graph = this.graph.timesteps[this.time];
		this.time = (this.time + 1) % 3;
		let newGraph: Graph = this.graph.timesteps[this.time];

		this.communicateNodePositions(curGraph, newGraph);

		this.draw(newGraph);
	}

	communicateNodePositions(from: Graph, to: Graph) { //pass previous node positions to next generation
		for (let n of from.nodes) {
			let n_prime: Node = to.nodes.find(function (d: Node) { return d.id === n.id; });
			n_prime.x = n.x;
			n_prime.y = n.y;
			n_prime.vx = n.vx;
			n_prime.vy = n.vy;
		}
	}

	drawLinks(edges: Edge[]) { //does what it says on the tin
		this.linkGlyphs = this.linksG.selectAll("line")
			.data(edges, function (d: Edge): string { return "" + d.id; }); //animate existing, dont create new line
		let linkEnter = this.linkGlyphs.enter().append("line") //create a new line for each edge in edgelist (subdivs defined)
			.attr("stroke", "black");
		this.linkGlyphs = this.linkGlyphs.merge(linkEnter)
		this.linkGlyphs.transition()
			.attr("stroke-width", function (d: Edge): number { return d.weight; });
	}

	drawNodes(nodes: Node[]) { //does what it says on the tin
		this.nodeGlyphs = this.nodesG.selectAll("circle")
			.data(nodes, function (d: Node): string { return "" + d.id });
		let nodeEnter = this.nodeGlyphs.enter().append("circle")
			.attr("id", function (d: any): string | number { return d.name; });
		this.nodeGlyphs = this.nodeGlyphs.merge(nodeEnter);
		this.nodeGlyphs
			.attr("r", 10)
			.attr("fill", "red"); //function (d: Node): string { return this.color(d.id); });
	}
}