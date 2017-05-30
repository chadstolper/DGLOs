import * as d3 from "d3-selection";
import { Heatmap } from "./Heatmap"
import { json as d3json } from "d3-request";
import { Node, Edge } from "./Graph"
import { DynamicDrinkGraph } from "./DummyGraph";
import { AnimatedHeatmap } from "./AnimatedHeatmap";
import { HeatmapTimeline } from "./HeatmapTimeline"
import { Egograph } from "./Egograph"
import { transition } from "d3-transition"

d3json("data/dummy/dummy.json", function (response: any) {

	let dGraph: DynamicDrinkGraph = new DynamicDrinkGraph(response);
	let curGraph = dGraph.timesteps[0];
	let curTimeStep = 0;
	let width = 750;
	let height = 750;
	let centralNode = curGraph.nodes[4];
	let svg = d3.selectAll("body").append("svg")
		.attr("width", width)
		.attr("height", height);

	let ego: Egograph = new Egograph(centralNode, dGraph, svg);

});