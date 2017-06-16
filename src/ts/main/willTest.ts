import { DynamicDrinkGraph } from "../data/DummyGraph";
import { DynamicRadoslawGraph } from "../data/EmailGraph";
import { DynamicGraph } from "../model/DynamicGraph";
import { Technique } from "../specs/Technique";
import { MatrixAnimated } from "../specs/MatrixAnimated";
import { Egograph } from "../specs/Egograph";
import { ForceDirectedAnimated } from "../specs/ForceDirectedAnimated";
import { select, Selection } from "d3-selection";
import { json } from "d3-request";
import { DGLOs } from "../lib/DGLOs";
import { DGLOsSVG } from "../lib/DGLOsSVG";
import { GestaltGlyphs } from "../specs/GestaltGlyphs"
import { DynamicNewcombGraph } from "../data/NewcombGraph"

json("data/newcomb/newcomb.json", function (response: any) {
	let width: number, height: number;
	width = height = 1000;
	let g: DynamicGraph = new DynamicNewcombGraph(response);
	let svg: Selection<any, {}, any, {}> = select("body").append("svg")
		.attr("width", width).attr("height", height);
	let lib: DGLOs = new DGLOsSVG(g, svg);
	let vis: Technique = new Egograph(lib, {});
	vis.draw();
})


