import * as d3 from "d3";
import { AnimatedForceDirectedGraph } from "./AnimatedForceDirectedGraph";
// import { ForceDirectedGraph } from "./ForceDirectedGraph";
import { json } from "d3-request";
import { DynamicDrinkGraph } from "./DummyGraph";
import { DynamicGraph } from "./Graph";

let height = 500;
let width = 500
let svg = d3.select("#chart").append("svg")
	.attr("width", width)
	.attr("height", height);

json("./data/dummy/dummy.json", function (response) {
	let dGraph: DynamicGraph = new DynamicDrinkGraph(response);
	let FDGraph: AnimatedForceDirectedGraph = new AnimatedForceDirectedGraph(dGraph, svg);//, width, height);
	// let FDGraph: ForceDirectedGraph = new ForceDirectedGraph(dGraph, svg, width, height);
	FDGraph.draw(dGraph.timesteps[0]);

});