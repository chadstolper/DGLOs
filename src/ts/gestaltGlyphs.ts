import * as d3 from "d3-selection";
import * as d3Scale from "d3-scale";
import * as d3Array from "d3-array";
import { json as d3json } from "d3-request";
import { Graph, Node, Edge } from "./Graph";
import { Person, Drink, DrinkEdge, StaticDrinkGraph, DynamicDrinkGraph } from "./DummyGraph";

d3json("data/dummy/dummy.json", function (response: any) {
	let graph: DynamicDrinkGraph = new DynamicDrinkGraph(response);
	let curTimeStep = 0;
	let numTimeSteps = graph.timesteps.length;
	let curGraph = graph.timesteps[0];
	let width = 750;
	let height = 750;

	function graphUpdate(graph: StaticDrinkGraph, _width: number, _height: number) {

		let arraySize = graph.nodes.length;
		let defaultColorDomain = ["white", "gold"];
		var svg = d3.selectAll("body").append("svg")
			.attr("width", _width)
			.attr("height", _height)

		let slots = svg.selectAll("g")
			.data(graph.edges).enter()
			.append("rect")
			.attr("x", function (d) {
				return (+d.source.id / graph.nodes.length) * 100 + "%";
			})
			.attr("y", function (d) {
				return (+d.target.id / graph.nodes.length) * 100 + "%";
			})
			.attr("width", _width / arraySize)
			.attr("height", _height / arraySize)
			.attr("fill", function (d) {
				return "red";
				/*
				Here, you must create a function that returns the Gestalt Glyph for 
				the given edge.

				its should return some sort of image that can fit into the rect.

				???
				*/
			})
			.attr("stroke", "black")
			.attr("id", function (d) {
				return d.id;
			});
	}

});