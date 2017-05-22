import * as d3 from "d3-selection";
import { Heatmap } from "./Heatmap"
import { json as d3json } from "d3-request";
import { Node, Edge } from "./Graph"
import { DynamicDrinkGraph } from "./DummyGraph";
import { AnimatedHeatmap } from "./AnimatedHeatmap";
import { HeatmapTimeline } from "./HeatmapTimeline"

d3json("data/dummy/dummy.json", function (response: any) {

	let dGraph: DynamicDrinkGraph = new DynamicDrinkGraph(response);
	let curGraph = dGraph.timesteps[0];
	let curTimeStep = 0;
	let width = 750;
	let height = 750;
	let centralNode = curGraph.nodes[0];
	let incidentEdges: Array<Edge> = [];
	let neighborNodes: Array<Node> = [];
	// let svg = d3.selectAll("body").append("svg")
	// 	.attr("width", width)
	// 	.attr("height", height);


	function init(centralNodeID: number) {
		centralNode = initCentralNode(centralNodeID);
		if (centralNode === null) {
			init(0);
		}
		getIncidentEdges(0);
		//console.log(incidentEdges);
		getNeighborNodes(0);
		console.log(neighborNodes);
		draw();
	}
	init(10);

	//sets the central node
	function initCentralNode(nodeID: number): Node {
		for (let n of curGraph.nodes) {
			if (n.id === nodeID) {
				return n;
			}
		}
		return null;
	}
	//gets edges incident to a node for a given timestep
	function getIncidentEdges(timestep: number) {
		for (let n of curGraph.edges) {
			if (n.target.id === centralNode.id || n.source.id === centralNode.id) {
				incidentEdges.push(n);
			}
		}
	}
	//gets the neighboring nodes to the central node
	function getNeighborNodes(timestep: number) {
		for (let n of incidentEdges) {
			for (let m of curGraph.nodes) {
				if (m !== centralNode && (n.source.id === m.id || n.target.id === m.id)) {
					neighborNodes.push(m);
				}
			}
		}
	}
	//draws the egograph
	function draw() {
		let horizontalAdjustment = "50%"
		let verticalAdjustment = "20%"
		let svg = d3.select("body").append("div").append("svg")
			.attr("width", width)
			.attr("height", height);
		let centralNodeGlyph = svg.data([centralNode])
			.append("cirlce")
			.attr("cx", horizontalAdjustment)
			.attr("cy", verticalAdjustment)
			.attr("r", 10)
			.attr("fill", "red");
		let edgeGlyphs = svg.data(incidentEdges)
			.enter().append("line")
			.attr("x1", 10)
			.attr("y1", 10)
			.attr("x2", Math.random() * 100)
			.attr("y2", Math.random() * 100)
			.attr("stroke", "black")
			.attr("stroke-width", "2");


	}



});