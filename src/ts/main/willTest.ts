import { DynamicDrinkGraph } from "../data/DummyGraph";
import { DynamicRadoslawGraph } from "../data/EmailGraph";
import { DynamicGraph } from "../model/DynamicGraph";
import { Technique } from "../specs/Technique";
import { MatrixAnimated } from "../specs/MatrixAnimated";
import { MatrixTimeline } from "../specs/MatrixTimeline";
import { Egograph } from "../specs/Egograph";
import { ForceDirectedAnimated } from "../specs/ForceDirectedAnimated";
import { select, Selection } from "d3-selection";
import { json } from "d3-request";
import { DGLOs } from "../lib/DGLOs";
import { DGLOsSVG } from "../lib/DGLOsSVG";
import { GestaltGlyphs } from "../specs/GestaltGlyphs"
import { DynamicNewcombGraph, DynamicNewcombTopFiveGraph } from "../data/NewcombGraph"
import { DynamicFiveKingsGraph } from "../data/FiveKingsGraph"

json("data/fivekings/fivekings.json", function (response: any) {
	let width: number, height: number;
	//width = height = 1000;
	width = height = 2000;
	//height = 2000;
	//width = 1000;
	let g: DynamicGraph = new DynamicFiveKingsGraph(response);
	let svg: Selection<any, {}, any, {}> = select("body").append("svg")
		.attr("width", width).attr("height", height);
	let lib: DGLOs = new DGLOsSVG(g, svg);
	let vis: Technique = new MatrixAnimated(lib, {});
	vis.draw();
})


