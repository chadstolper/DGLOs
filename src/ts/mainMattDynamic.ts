import * as d3 from "d3";
import { Selection } from "d3-selection";
//import {ForceLink} from "d3-force";
import { scaleOrdinal, scaleLinear, schemeCategory10 } from "d3-scale";
import { json as d3json } from "d3-request";
import { Graph, Node, Edge } from "./Graph";
import { DynamicDrinkGraph } from "./DummyGraph";

let time = 0;
let width = 500;
let height = 500;

let simulation: d3.Simulation<{}, undefined>;
let color = d3.scaleOrdinal(d3.schemeCategory20); //random color picker.exe
let chart: Selection<any, {}, any, {}>;
let link: Selection<any, {}, any, {}>, node: Selection<any, {}, any, {}>; //groups for "specific"
let links: Selection<any, {}, any, {}>, nodes: Selection<any, {}, any, {}>; //groups for all

d3.json("./data/dummy/dummy.json", function (response) {

	// simulation.on("tick", ticked);
	let dGraph: DynamicDrinkGraph = new DynamicDrinkGraph(response);
	initSVG();
	draw(dGraph.timesteps[time]);
	initSimulation();



	function initSimulation() {
		simulation = d3.forceSimulation() //init sim for chart?
			.force("link", d3.forceLink().id(function (d: Node): string { return "" + d.id })) //pull applied to link lengths
			.force("charge", d3.forceManyBody()) //push applied to all things from center
			.force("center", d3.forceCenter(width / 2, height / 2)) //define center
			.on("tick", ticked);
	}

	function initSVG() {
		chart = d3.select("#chart").append("svg")
			.attr("width", width)
			.attr("height", height)
			.on("click", function (d, i) { mouseClicked() });

		links = chart.append("g")
			.classed("links", true);

		nodes = chart.append("g")
			.classed("node", true);
	}

	function ticked() {
		console.log("ticking...");
		if (link !== undefined) {
			console.log(link);
			link //as in the lines representing links
				.attr("x1", function (d: Edge) { return d.source.x; })
				.attr("y1", function (d: Edge) { return d.source.y; })
				.attr("x2", function (d: Edge) { return d.target.x; })
				.attr("y2", function (d: Edge) { return d.target.y; });
		} else {
			console.log("No links!")
		}
		if (node !== undefined) {
			console.log(node);
			node
				.attr("cx", function (d: Node) { console.log(new Array<any>(d, d.x)); return d.x; })
				.attr("cy", function (d: Node) { return d.y; });
		} else {
			console.log("No nodes!")
		}
	}

	function draw(graph: Graph): void {
		if (simulation !== undefined) {
			simulation.nodes(graph.nodes); //call for sim tick (and apply force to nodes?)
			(simulation.force("link") as d3.ForceLink<Node, Edge>).links(graph.edges);
		}

		drawLinks(graph.edges);
		drawNodes(graph.nodes);


	}

	function mouseClicked() {
		time = (time + 1) % 3;
		let newTimeStamp = dGraph.timesteps[time];
		// let newEdges: Edge[] = newTimeStamp.edges as Edge[]; //brand new pack of razers
		// let newNodes: Node[] = newTimeStamp.nodes as Node[];

		draw(newTimeStamp);
		// ticked();
	}

	function drawLinks(d: Edge[]) {
		link = links.selectAll("line")
			.data(d, function (d: Edge): string { return "" + d.id; }); //animate existing, dont create new line
		let linkEnter = link
			.enter().append("line"); //create a new line for each edge in edgelist (subdivs defined)
		link.merge(linkEnter).transition()
			.attr("stroke", "black")
			.attr("stroke-width", function (d: Edge): string { return "" + d.weight; });

		//ticked();
	}

	function drawNodes(d: Node[]) {
		node = nodes.selectAll("circle")
			.data(d, function (d: Node): string { return "" + d.id });
		let nodeEnter = node
			.enter().append("circle");
		node.merge(nodeEnter)
			.attr("r", 10)
			.attr("fill", function (d: Node): string { return color("" + d.id); });

		//ticked();
	}
});