/* Assumptions:
	-A dynamic graph is an array of graphs
	-A graph contains an array of nodes and an array of edges
	-A node has an id
	-An edge has a source, a target, and a weight
*/

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
	//the current graph i.e. a static graph at a given timeStep
	let curGraph = graph.timesteps[0];
	//width and height of the SVG element that will become the matrix heatmap
	let width = 750;
	let height = 750;
	let defaultColorDomain = ["white", "gold"];

	let arraySize = curGraph.nodes.length;
	var svg = d3.selectAll("body").append("svg")
		.attr("width", width)
		.attr("height", height)

	let colorMap = d3Scale.scaleLinear<string>()
		.domain(getColorDomain(curGraph.edges))
		.range(defaultColorDomain);

	let slots = svg.selectAll("g")
		.data(curGraph.edges).enter()
		.append("rect")
		.attr("x", function (d) {
			return (+d.source.id / curGraph.nodes.length) * 100 + "%";
		})
		.attr("y", function (d) {
			return (+d.target.id / curGraph.nodes.length) * 100 + "%";
		})
		.attr("width", width / arraySize)
		.attr("height", height / arraySize)
		.attr("fill", function (d) {
			return colorMap(d.weight);
		})
		.attr("stroke", "black")
		.attr("id", function (d) {
			return d.id;
		})
		.on("click", function (d, i) {
			animateGraph(curGraph, width, height);
		});

	/*using the mod operator, this function moves the current timestep 
	forward by one. If the current timeStep is at the end of the timeStep array,
	this function sets the current timeStep to timesteps[0].*/
	function timeStepForward() {
		curTimeStep = (curTimeStep + 1) % numTimeSteps;
		curGraph = graph.timesteps[curTimeStep];
	}

	//A function similar to timeStep forward, except it moves the timeStep backward. 
	//It uses the mod operator to cycle through the loop in the same way as timeStepForward.
	function timeStepBackward() {
		curTimeStep = (curTimeStep - 1) % numTimeSteps;
		curGraph = graph.timesteps[curTimeStep];
	}

	//this function moves the program forward timeStep and calls
	//animatedHeatMap with curGraph, width, and height
	function animateGraph(graph: StaticDrinkGraph, _width: number, _height: number) {
		timeStepForward();
		console.log(curTimeStep);

		let colorMap = d3Scale.scaleLinear<string>()
			.domain(getColorDomain(graph.edges))
			.range(defaultColorDomain);

		let rects = svg.selectAll("rect")
			.data(graph.edges).enter()
			.attr("fill", function (d) {
				return colorMap(d.weight);
			});
	}

	/* takes a list of edges.
	returns a 2-element array with the lightest edge weight as the first element
	and the heaviest edge weight as the second element.*/
	function getColorDomain(edges: Array<Edge>) {
		return d3Array.extent(edges, function (d: Edge): number {
			return d.weight;
		});
	}

	function getHeight(): number {
		return height;
	}
	function setHeight(_height: number) {
		this.height = _height;
	}
	function getWidth(): number {
		return width;
	}
	function setWidth(_width: number) {
		this.width = _width;
	}
	function getDefaultColorDomain(): Array<string> {
		return defaultColorDomain;
	}
	function setDefaultColorDomain(_defaultColorDomain: Array<string>) {
		this.defaultColorDomain = _defaultColorDomain;
	}

});

