/* Assumptions:
	-A dynamic graph is an array of graphs
	-A graph contains an array of nodes and an array of edges
	-A node has an id
	-An edge has a source, a target, and a weight
*/

import * as d3 from "d3-selection";
import {scaleOrdinal, schemeCategory20} /* as d3Scale*/ from "d3-scale";
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

	matrixTimeline();

	function timeStepForward() {
		if (curTimeStep + 1 == numTimeSteps)/*replace with mod*/ {
			//You have reached the last timeStep, so loop back to the first
			curGraph = graph.timesteps[0];
			console.log(curTimeStep);
		} else {
			//Move to the next timeStep
			curGraph = graph.timesteps[curTimeStep + 1];
			console.log(curTimeStep);
		}
	}

	function timeStepBackward() {
		if (curTimeStep - 1 == 0) {
			//You are at the first timeStep, so loop to the last
			curGraph = graph.timesteps[numTimeSteps - 1];
			console.log(curTimeStep);
		} else {
			//move to the previous timeStep
			curGraph = graph.timesteps[curTimeStep - 1];
			console.log(curTimeStep);
		}
	}


	/*
	takes a list of edges
	returns a 2-element array with the minimum edge weight as the first element
	and the maximum edge weight as the second element.
	*/
	function getColorDomain(edges: Array<Edge>) {
		return d3Array.extent(edges, function (d: Edge): number {
			return d.weight;
		});
	}

	function setColorRange(colorArray: Array<string>) {
		for (var i = 0; i < colorArray.length; i++) {

		}
	}

	function matrixTimeline() {
		for (var i = 0; i < numTimeSteps; i++) {
			graphUpdate(curGraph, width * numTimeSteps, height, generateRandomColor());
			timeStepForward();
		}
	}

	function animatedHeatMap(graph: StaticDrinkGraph, _width: number, _height: number, _color: string) {
		console.log("you called this function");
		graphUpdate(curGraph, width, height, generateRandomColor());
		setTimeout(timeStepForward(), 4000);

	}

	function doNothing() {

	}

	function generateRandomColor(): string {
		return "hsl(" + Math.random() + ", " + Math.random() * 100 + "% , " + Math.random() * 100 + "% )";
	}

	function graphUpdate(graph: StaticDrinkGraph, _width: number, _height: number, _color: string)/*:return type*/ {

		let arraySize = graph.nodes.length;
		let colorDomain = getColorDomain(graph.edges);
		console.log(colorDomain);

		let colorMap = scaleOrdinal(schemeCategory20);


		var svg = d3.selectAll("body").append("svg")
			.attr("width", _width)
			.attr("height", _height)
			.data(graph.edges);

		svg.append("rect")
			.attr("class", "backgorund")
			.attr("width", _width)
			.attr("height", _height);


		for (var i = 0; i < arraySize; i++) {
			//i represents the yAxis, j represents the xAxis
			for (var j = 0; j < arraySize; j++) {
				svg.append("rect")
					.attr("width", _width / arraySize)
					.attr("height", _height / arraySize)
					.attr("fill", _color)
					.attr("x", (j / (arraySize)) * 100 + "%")
					.attr("y", (i / (arraySize)) * 100 + "%")
					.attr("stroke", "black");
			}
			svg.enter().append("text")
			.attr("x", (j / (arraySize)) * 100 + "%")
			.attr("y", (i / (arraySize)) * 100 + "%")
			.text(function (d) {
				console.log(d);
				return d.source.id + "";
			})
			.attr("fill", "black");	
		}

		
	}


});