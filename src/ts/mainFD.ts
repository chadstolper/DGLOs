import * as d3 from "d3";
import { ForceDirectedGraph } from "./ForceDirectedGraph";
import { json } from "d3-request";
import { DynamicDrinkGraph } from "./DummyGraph";

let height = 500;
let width = 500
let svg = d3.select("#chart").append("svg")
	.attr("width", width)
	.attr("height", height);

json("./data/dummy/dummy.json", function (response) {
	let dGraph: DynamicDrinkGraph = new DynamicDrinkGraph(response);
	let FDGraph: ForceDirectedGraph = new ForceDirectedGraph(dGraph, svg, width, height);
});