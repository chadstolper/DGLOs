import { DynamicDrinkGraph } from "../data/DummyGraph";
import { DynamicGraph } from "../model/DynamicGraph";
import { DynamicRadoslawGraph } from "../data/EmailGraph";
import { DynamicNewcombGraph, DynamicNewcombTopFiveGraph } from "../data/NewcombGraph";
import { DynamicLesMiserablesGraph } from "../data/MiserablesGraph";
import { DynamicFiveKingsGraph } from "../data/FiveKingsGraph";
import { Technique } from "../specs/Technique";
import { ForceDirectedAnimated } from "../specs/ForceDirectedAnimated";
import { GMap } from "../specs/GMap";
import { Egograph } from "../specs/Egograph";
import { ForceDirectedTimeline } from "../specs/ForceDirectedTimeline";
import { MatrixTimeline } from "../specs/MatrixTimeline";
import { MatrixAnimated } from "../specs/MatrixAnimated";
import { select, Selection } from "d3-selection";
import { json } from "d3-request";
import { DGLOs } from "../lib/DGLOs";
import { DGLOsSVG } from "../lib/DGLOsSVG";

// json("data/dummy/dummy.json", function (response: any) {
// json("data/miserables/miserables.json", function (response: any) {
// json("data/radoslaw/emails.json", function (response: any) {
json("data/newcomb/newcomb.json", function (response: any) {
	// json("data/fivekings/fivekings.json", function (response: any) {

	let width: number = 1000;
	let height: number = width;

	//------------------------------------------------------------//
	// let g: DynamicGraph = new DynamicRadoslawGraph(response);
	// let g: DynamicGraph = new DynamicDrinkGraph(response);
	// let g: DynamicGraph = new DynamicLesMiserablesGraph(response);
	// let g: DynamicGraph = new DynamicNewcombGraph(response);
	let g: DynamicGraph = new DynamicNewcombTopFiveGraph(response);
	// let g: DynamicGraph = new DynamicFiveKingsGraph(response);
	//------------------------------------------------------------//

	let svg: Selection<any, {}, any, {}> = select("body")
	// .append("svg")
	// 	.attr("width", width).attr("height", height);
	let lib: DGLOs = new DGLOsSVG(g, svg, width, height);

	//------------------------------------------------------------//
	// let vis: Technique = new ForceDirectedAnimated(lib, {});
	// let vis: Technique = new GMap(lib, {});
	// let vis: Technique = new ForceDirectedTimeline(lib, {});
	// let vis: Technique = new MatrixTimeline(lib, {});
	// let vis: Technique = new MatrixAnimated(lib, {});
	let vis: Technique = new Egograph(lib, {});
	//------------------------------------------------------------//


	vis.draw();
})


