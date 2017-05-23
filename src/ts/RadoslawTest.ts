import { select } from "d3-selection";
import { DynamicGraph } from "./Graph";
import { DynamicRadoslawGraph } from "./EmailGraph";
import { AnimatedForceDirectedGraph } from "./AnimatedForceDirectedGraph";
import { ForceDirectedGraph } from "./ForceDirectedGraph";
import { json } from "d3-request";

let g: DynamicGraph;
let fdg: ForceDirectedGraph;
// json("data/radoslaw/out2.json", function (response: any) {
json("data/radoslaw/out.json", function (response: any) {

	let width: number;
	let height: number = width = 2000;
	let svg = select("body").append("svg")
		.attr("width", width)
		.attr("height", height);
	g = new DynamicRadoslawGraph(response);
	fdg = new AnimatedForceDirectedGraph(g, svg, width, height);
	fdg.draw(g.timesteps[0]);
})


