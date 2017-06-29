import { DynamicDrinkGraph } from "../data/DummyGraph";
import { DynamicRadoslawGraph } from "../data/EmailGraph";
import { DynamicGraph } from "../model/DynamicGraph";
import { Technique } from "../specs/Technique";
import { MatrixAnimated } from "../specs/MatrixAnimated";
import { MatrixTimeline } from "../specs/MatrixTimeline";
import { Egograph } from "../specs/Egograph";
import { GMap } from "../specs/GMap";
import { ForceDirectedAnimated } from "../specs/ForceDirectedAnimated";
import { select, Selection } from "d3-selection";
import { json } from "d3-request";
import { DGLOs } from "../lib/DGLOs";
import { DGLOsSVG } from "../lib/DGLOsSVG";
import { GestaltGlyphs } from "../specs/GestaltGlyphs"
import { DynamicNewcombGraph, DynamicNewcombTopFiveGraph } from "../data/NewcombGraph"
import { ForceDirectedTimeline } from "../specs/ForceDirectedTimeline"
import { DynamicFiveKingsGraph } from "../data/FiveKingsGraph"

//TODOS: finish gestaltGlyphs, make labelGlyphShapes work with simulations


//json("data/dummy/dummy2.json", function (response: any) {
//json("data/dummy/dummy.json", function (response: any) {
//json("data/radoslaw/emails.json", function (response: any) {
json("data/newcomb/newcomb.json", function (response: any) {
	//json("data/fivekings/fivekings.json", function (response: any) {
	let width: number, height: number;
	//width = height = 1000;
	width = height = 2000;
	//height = 2000;
	//width = 1000;
	//let g: DynamicGraph = new DynamicDrinkGraph(response);
	//let g: DynamicGraph = new DynamicRadoslawGraph(response);
	//let g: DynamicGraph = new DynamicFiveKingsGraph(response);
	//let g: DynamicGraph = new DynamicNewcombGraph(response);
	let g: DynamicGraph = new DynamicNewcombTopFiveGraph(response);


	let svg: Selection<any, {}, any, {}> = select("body")
	let lib: DGLOs = new DGLOsSVG(g, svg, width, height);
	//let vis: Technique = new Egograph(lib, {}); // WORKS FOR DUMMY, RADOSLAW, AND NEWCOMB
	//let vis: Technique = new ForceDirectedAnimated(lib, {}); // WORKS FOR DUMMY, RADOSLAW
	//let vis: Technique = new ForceDirectedTimeline(lib, {}); // WORKS FOR DUMMY, RADOSLAW, AND NEWCOMB
	//let vis: Technique = new GestaltGlyphs(lib, {});
	let vis: Technique = new MatrixAnimated(lib, {}); // WORKS FOR DUMMY, RADOSLAW, AND NEWCOMB
	//let vis: Technique = new MatrixTimeline(lib, {}); // WORKS FOR DUMMY, RADOSLAW, AND NEWCOMB
	//let vis: Technique = new GMap(lib, {}); // TODO: VORONOI LOSES DATA SOMETIMES
	vis.draw();
})


