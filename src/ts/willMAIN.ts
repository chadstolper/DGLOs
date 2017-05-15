// main.ts
// https://blog.mariusschulz.com/2016/06/27/bundling-es2015-modules-with-typescript-and-rollup

//import { square, cube } from "./math";
import * as d3 from "d3-selection"
import { json as d3json } from "d3-request";
import { Graph, Node, Edge } from "./Graph";
import { Person, Drink, DrinkEdge, StaticDrinkGraph } from "./DummyGraph";
import "willCSS.css";

d3json("data/dummy/dummy.json", function (response: any) {
	let graph = new StaticDrinkGraph(response);
	var edgeListLength = graph.edges.length;
	var nodeListLength = graph.nodes.length;

	let width = 1000;
	let height = 1000;
	let xAxis = 50;
	let yAxis = 50;

	let data = [10, 20, 30, 40, 50]

	//create an SVG element of width and height
	let svg = d3.select("#dGraph").append("svg")
	svg.attr("width", width)
		.attr("height", height);

	let nodes = svg.selectAll("nodes")
		.data(data);
	nodes.enter().append("cicle")
		.attr("cx", function (d) {
			return d + "%";
		})
		.attr("cy", function (d) {
			return d + "%";
		})
		.attr("r", 10)
		.attr("fill", "red");

	let edges = svg.selectAll("edges")
		.data(data)
	edges.enter().append("line")
		.attr("x1", function (d) {
			return width - 10 * d;
		})
		.attr("y1", function (d) {
			return width - 10 * d;
		})
		.attr("x2,", function (d) {
			return width - 8 * d;
		})
		.attr("y2", function (d) {
			return width - 8 * d;
		});

})

