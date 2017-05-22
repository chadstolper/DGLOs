import * as d3 from "d3-selection";
import { scaleOrdinal, schemeCategory20 } from "d3-scale";
import { Selection } from "d3-selection";
import { DynamicGraph, Graph, Node, Edge } from "./Graph";
import { Person, Drink, DrinkEdge, StaticDrinkGraph, DynamicDrinkGraph } from "./DummyGraph";

export class GesaltStaticGraph {
	private timeStamps: number;
	private width = 500;
	private height = 500;
	private graph: DynamicGraph;
	private divChart: Selection<any, {}, any, {}>;
	private color = scaleOrdinal<string | number, string>(schemeCategory20);

	public constructor(graph: DynamicGraph, divChart: Selection<any, {}, any, {}>) {
		this.timeStamps = graph.timesteps.length; //-1 for elements
		this.graph = graph;
		this.divChart = divChart;
		for (let i = 0; i < this.timeStamps; i++) {
			this.initGraph(i);
		}
	}

	private initGraph(newStamp: number) {
		let svg = this.divChart.append("svg")
			.attr("width", this.width)
			.attr("height", this.height);

		let nodes = this.graph.timesteps[newStamp].nodes;
		let glyphs = svg.append("g")
			.classed("glyphs" + newStamp, true)
			.data(nodes);
		glyphs.enter().append("circle")
			.classed("node", true)
			.attr("cx", 25)
			.attr("cy", 25)
			.attr("r", 5)
			.attr("fill", "blue");
		//	this.drawNodes(newStamp);
	}

	private drawNodes(curGroup: number) {
		let nodes = this.graph.timesteps[curGroup].nodes;
		let glyphy = this.divChart.select("glyphs" + curGroup);
		glyphy.append("circle")
			.attr("cx", 25)
			.attr("cy", 25)
			.attr("r", 5)
			.attr("fill", "blue");
	}
}