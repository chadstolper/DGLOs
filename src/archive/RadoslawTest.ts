import { select } from "d3-selection";
import { DynamicGraph, Node } from "./Graph";
import { DynamicRadoslawGraph } from "./EmailGraph";
import { AnimatedForceDirectedGraph } from "./AnimatedForceDirectedGraph";
import { ForceDirectedGraph } from "./ForceDirectedGraph";
import { AnimatedHeatmap } from "./AnimatedHeatmap";
import { json } from "d3-request";
import { Visualization } from "./interfaceDynamicVisualization";
import { Egograph } from "./Egograph"

var g: DynamicGraph;
// let fdg: ForceDirectedGraph;
// var ahm: AnimatedHeatmap;
// let vis: Visualization;
// json("data/radoslaw/emails_sample.json", function (response: any) {
json("data/radoslaw/emails.json", function (response: any) {

	let width: number;
	let height: number = width = 1000;
	let svg = select("body").append("svg")
		.attr("width", width)
		.attr("height", height);
	g = new DynamicRadoslawGraph(response);
	// fdg = new AnimatedForceDirectedGraph(g, svg, width, height);
	// fdg.draw(g.timesteps[0]);
	// let vis = new AnimatedHeatmap(g, svg);
	let n: Node = g.timesteps[0].nodes[0];
	let vis = new Egograph(n, g, svg);

	//vis.draw(g.timesteps[0]);




})


