import { select } from "d3-selection";
import { DynamicGraph } from "./Graph";
import { DynamicRadoslawGraph } from "./EmailGraph";
import { AnimatedForceDirectedGraph } from "./AnimatedForceDirectedGraph";
import { ForceDirectedGraph } from "./ForceDirectedGraph";
import { AnimatedHeatmap } from "./AnimatedHeatmap";
import { json } from "d3-request";

var g: DynamicGraph;
// let fdg: ForceDirectedGraph;
var ahm: AnimatedHeatmap;
// json("data/radoslaw/out2.json", function (response: any) {
json("data/radoslaw/out.json", function (response: any) {

	let width: number;
	let height: number = width = 2000;
	let svg = select("body").append("svg")
		.attr("width", width)
		.attr("height", height);
	g = new DynamicRadoslawGraph(response);
<<<<<<< HEAD

	// fdg = new AnimatedForceDirectedGraph(g, svg, width, height);
	// fdg.draw(g.timesteps[0]);
	ahm = new AnimatedHeatmap(width, height, ["white", "purple"], svg, g);

=======
	// fdg = new AnimatedForceDirectedGraph(g, svg, width, height);
	// fdg.draw(g.timesteps[0]);
	ahm = new AnimatedHeatmap(width, height, ["white", "purple"], svg, g);
>>>>>>> ecdc735d783bce27e174b5d0eac7156e6f0eff9c
})


