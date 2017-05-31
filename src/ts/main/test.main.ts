import { DynamicDrinkGraph } from "../data/DummyGraph";
import { DynamicGraph } from "../model/DynamicGraph";
import { Technique } from "../specs/Technique";
import { ForceDirectedAnimated } from "../specs/ForceDirectedAnimated";
import { select, Selection } from "d3-selection";
import { json } from "d3-request";

json("data/dummy/dummy.json", function (response: any) {
	let width: number, height: number;
	width = height = 500;
	let g: DynamicGraph = new DynamicDrinkGraph(response);
	let svg: Selection<any, {}, any, {}> = select("body").append("svg")
		.attr("width", width).attr("height", height);
	let vis: Technique = new ForceDirectedAnimated(g, svg, {});
	vis.draw();
})


