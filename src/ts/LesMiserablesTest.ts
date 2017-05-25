import { select } from "d3-selection";
import { DynamicGraph } from "./Graph";
import { DynamicLesMiserablesGraph } from "./MiserablesGraph";
import { ForceDirectedMapGraph } from "./ForceDirectedHullGraph";
import { ForceDirectedGraph } from "./ForceDirectedGraph";
import { VoronoiDiagram } from "./VoronoiDiagram";
import { AnimatedHeatmap } from "./AnimatedHeatmap";
import { json } from "d3-request";

var g: DynamicGraph;
let fdmg: ForceDirectedGraph;
// var ahm: AnimatedHeatmap;
// json("data/radoslaw/out2.json", function (response: any) {
json("data/miserables/miserables.json", function (response: any) {

	let width: number;
	let height: number = width = 2000;
	let svg = select("body").append("svg")
		.attr("width", width)
		.attr("height", height);
	g = new DynamicLesMiserablesGraph(response);
	fdmg = new VoronoiDiagram(g, svg);
	fdmg.draw(g.timesteps[0]);
	// ahm = new AnimatedHeatmap(width, height, ["white", "purple"], svg, g);
})


