// main.ts
import * as d3 from "d3-selection";
import { Selection } from "d3-selection";
import { scaleOrdinal, scaleLinear, schemeCategory10 } from "d3-scale";
import { json as d3json } from "d3-request";
import { Graph, Node, Edge } from "./Graph";
import { Person, Drink, DrinkEdge, StaticDrinkGraph } from "./DummyGraph";


let width = 500;
let height = 500;

let colorscale = scaleOrdinal(schemeCategory10);
let widthscale = scaleLinear().rangeRound([0, width])

let chart: Selection<any, any, any, any> = d3.select("body").append("svg")
	.attr("width", width)
	.attr("height", height);

d3json("data/dummy/dummy.json", function (response: any) {

	let graph: Graph = new StaticDrinkGraph(response);

	widthscale.domain([0, graph.nodes.length - 1]);

	let nodes: Selection<any, any, any, any> = chart.selectAll(".node")
		.data(graph.nodes, function (d: Node): string { return "" + d.id; }) //calls the id getter

	nodes.enter().append("g")
		.classed("node", true)
		// let circles = nodes.selectAll("circle")
		// 		.datum(function(d:Node):Node { return d; })
		.append("circle")
			.attr("r", 5)
			.attr("cx", 0)
			.attr("cy", 0)
		
		console.log(nodes)

	let nodeUpdate: Selection<any,any,any,any> = nodes.enter().merge(nodes)
	console.log(nodeUpdate)
	nodeUpdate
		// .each(function (d: Node, i: number) {
		// 	console.log(d);
		// })
		.style("fill", function (d: Node): string {
			console.log(d)
			//we are letting TS check that d is the right type
			//and warn us if it is ever not
			console.log(d.type, d.id);
			console.log(colorscale(d.type));
			return colorscale(d.type);
		})
		.attr("y", 10)
		.attr("x", function (d: Node, i: number): number {
			return widthscale(i);
		});




})


