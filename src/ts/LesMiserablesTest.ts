import { select } from "d3-selection";
import { DynamicGraph } from "./Graph";
import { DynamicLesMiserablesGraph } from "./MiserablesGraph";
import { AnimatedForceDirectedGraph } from "./AnimatedForceDirectedGraph";
import { ForceDirectedGraph } from "./ForceDirectedGraph";
import { AnimatedHeatmap } from "./AnimatedHeatmap";
import { json } from "d3-request";

var g: DynamicGraph;
let fdg: ForceDirectedGraph;
// var ahm: AnimatedHeatmap;
// json("data/radoslaw/out2.json", function (response: any) {
json("data/miserables/miserables.json", function (response: any) {

	let width: number;
	let height: number = width = 2000;
	let svg = select("body").append("svg")
		.attr("width", width)
		.attr("height", height);
	g = new DynamicLesMiserablesGraph(response);
	fdg = new AnimatedForceDirectedGraph(g, svg);
	fdg.draw(g.timesteps[0]);
	// ahm = new AnimatedHeatmap(width, height, ["white", "purple"], svg, g);
})


