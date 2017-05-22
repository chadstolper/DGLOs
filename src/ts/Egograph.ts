import * as d3 from "d3-selection";
import { Heatmap } from "./Heatmap"
import { json as d3json } from "d3-request";
import { DynamicDrinkGraph } from "./DummyGraph";
import { AnimatedHeatmap } from "./AnimatedHeatmap";
import { HeatmapTimeline } from "./HeatmapTimeline"

d3json("data/dummy/dummy.json", function (response: any) {

	let graph: DynamicDrinkGraph = new DynamicDrinkGraph(response);
	let width = 750;
	let height = 750;
	let centralNode = null;
	let incidentEdges = [];
	let neighborNodes = [];
	let svg = d3.selectAll("body").append("svg")
		.attr("width", width)
		.attr("height", height);

	function initCentralNode(nodeID: number) {
		for (let i = 0; i < graph.timesteps[0].nodes.length; i++) {
			if (nodeID === graph.timesteps[0].nodes[i].id) {
				return graph.timesteps[0].nodes[i];
			}
		}
		return null;
	}

	function init(centralNodeID: number) {
		centralNode = initCentralNode(centralNodeID);
		if (centralNode === null) {
			init(0);
		}
	}

	init(20);
	console.log(centralNode);


});