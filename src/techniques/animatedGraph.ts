import * as d3 from "d3-selection";
import { Heatmap } from "./Heatmap"
import { json as d3json } from "d3-request";
import { DynamicDrinkGraph } from "./DummyGraph";
import { Graph, DynamicGraph } from "./Graph"
import { AnimatedHeatmap } from "./AnimatedHeatmap";
import { HeatmapTimeline } from "./HeatmapTimeline"

d3json("data/dummy/dummy.json", function (response: any) {
	let graph: DynamicDrinkGraph = new DynamicDrinkGraph(response);
	let width = 750;
	let height = 750;
	let svg = d3.select("body").append("div").append("svg")
		.attr("width", width)
		.attr("height", height);
	let heatmap: HeatmapTimeline = new HeatmapTimeline(graph, svg, ["white", "blue"]);

	// //code for an animated heatmap
	// let prevButton = d3.select("body").append("div").append("button")
	// 	.text("<--")
	// 	.on("click", function () {
	// 		heatmap.animateBackward()
	// 	});

	// let nextButton = d3.select("body").append("div").append("button")
	// 	.text("-->")
	// 	.on("click", function () {
	// 		heatmap.animateForward()
	// 	});

});