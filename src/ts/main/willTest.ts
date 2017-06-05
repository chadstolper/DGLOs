import { DynamicDrinkGraph } from "../data/DummyGraph";
import { DynamicGraph } from "../model/DynamicGraph";
import { Technique } from "../specs/Technique";
import { MatrixAnimated } from "../specs/MatrixAnimated";
import { select, Selection } from "d3-selection";
import { json } from "d3-request";
import { DGLOs } from "../lib/DGLOs";
import { DGLOsSVG } from "../lib/DGLOsSVG";


json("data/dummy/dummy.json", function (response: any) {
	let width: number, height: number;
	width = height = 1500;
	let g: DynamicGraph = new DynamicDrinkGraph(response);
	let svg: Selection<any, {}, any, {}> = select("body").append("svg")
		.attr("width", width).attr("height", height);
	let lib: DGLOs = new DGLOsSVG(g, svg);
	let vis: Technique = new MatrixAnimated(lib, {});
	vis.draw();
})


