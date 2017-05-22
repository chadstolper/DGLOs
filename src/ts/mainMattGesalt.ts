import * as d3 from "d3";
import { GesaltStaticGraph } from "./gestaltGlyphs";
import { json } from "d3-request";
import { DynamicDrinkGraph } from "./DummyGraph";

let chartDiv = d3.select("#chart");

json("./data/dummy/dummy.json", function (response) {
	let dGraph: DynamicDrinkGraph = new DynamicDrinkGraph(response);
	let GGraph: GesaltStaticGraph = new GesaltStaticGraph(dGraph, chartDiv);
});