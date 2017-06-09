import { DynamicDrinkGraph } from "../data/DummyGraph";
import { DynamicGraph } from "../model/DynamicGraph";
import { DynamicRadoslawGraph } from "../data/EmailGraph";
import { DynamicLesMiserablesGraph } from "../data/MiserablesGraph";
import { Technique } from "../specs/Technique";
import { ForceDirectedAnimated } from "../specs/ForceDirectedAnimated";
import { GMap } from "../specs/GMap";
import { ForceDirectedTimeline } from "../specs/ForceDirectedTimeline";
import { select, Selection } from "d3-selection";
import { json } from "d3-request";
import { DGLOs } from "../lib/DGLOs";
import { DGLOsSVG } from "../lib/DGLOsSVG";

// json("data/dummy/dummy.json", function (response: any) {
json("data/miserables/miserables.json", function (response: any) {
	// json("data/radoslaw/emails.json", function (response: any) {
	let width: number, height: number;
	width = height = 1000;
	// let g: DynamicGraph = new DynamicRadoslawGraph(response);
	// let g: DynamicGraph = new DynamicDrinkGraph(response);
	let g: DynamicGraph = new DynamicLesMiserablesGraph(response);
	let svg: Selection<any, {}, any, {}> = select("body").append("svg")
		.attr("width", width).attr("height", height);
	let lib: DGLOs = new DGLOsSVG(g, svg);

	//------------------------------------------------------------//
	let vis: Technique = new ForceDirectedAnimated(lib, {});
	// let vis: Technique = new GMap(lib, {});
	// let vis: Technique = new ForceDirectedTimeline(lib, {});
	//------------------------------------------------------------//


	vis.draw();
})


