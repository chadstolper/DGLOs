import * as d3 from "d3-selection";
import { Heatmap } from "./Heatmap"
import { json as d3json } from "d3-request";
import { Node, Edge } from "./Graph"
import { DynamicDrinkGraph } from "./DummyGraph";
import { AnimatedHeatmap } from "./AnimatedHeatmap";
import { HeatmapTimeline } from "./HeatmapTimeline"

d3json("data/dummy/dummy.json", function (response: any) {

	let graph: DynamicDrinkGraph = new DynamicDrinkGraph(response);
	let width = 750;
	let height = 750;
	let centralNode = graph.timesteps[0].nodes[0];
	let incidentEdges: Array<Edge> = [];
	let neighborNodes: Array<Node> = [];
	let svg = d3.selectAll("body").append("svg")
		.attr("width", width)
		.attr("height", height);


	function init(centralNodeID: number) {
		centralNode = initCentralNode(centralNodeID);
		if (centralNode === null) {
			init(0);
		}
		getIncidentEdges(0);
		//console.log(incidentEdges);
		getNeighborNodes(0);
		console.log(neighborNodes);
	}
	init(10);

	//sets the central node
	function initCentralNode(nodeID: number) {
		for (let i = 0; i < graph.timesteps[0].nodes.length; i++) {
			if (nodeID === graph.timesteps[0].nodes[i].id) {
				return graph.timesteps[0].nodes[i];
			}
		}
		return null;
	}
	//gets edges incident to a node for a given timestep
	function getIncidentEdges(timestep: number) {
		for (let i = 0; i < graph.timesteps[timestep].edges.length; i++) {
			if (
				(graph.timesteps[timestep].edges[i].source.id === centralNode.id) ||
				(graph.timesteps[timestep].edges[i].target.id === centralNode.id)) {
				incidentEdges.push(graph.timesteps[timestep].edges[i]);
			}
		}
	}
	//gets the neighboring nodes to the central node
	function getNeighborNodes(timestep: number) {
		for (let n of incidentEdges) {
			for (let m of graph.timesteps[timestep].nodes) {
				if (m !== centralNode && (n.source.id === m.id || n.target.id === m.id)) {
					neighborNodes.push(m);
				}
			}
		}
	}
	//draws the egograph
	function draw() {

	}



});