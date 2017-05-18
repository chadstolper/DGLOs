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
	let curGraph = graph.timesteps[0];
	let width = 750;
	let height = 750;

	matrixTimeline();

	function timeStepForward() {
		// if (curTimeStep + 1 === numTimeSteps)/*replace with mod*/ {
		// 	//You have reached the last timeStep, so loop back to the first
		// 	curGraph = graph.timesteps[0];
		// 	console.log(curTimeStep);
		// } else {
		// 	//Move to the next timeStep
		// 	curGraph = graph.timesteps[curTimeStep + 1];
		// 	curTimeStep += 1;
		// 	console.log(curTimeStep);
		// }
		curTimeStep = (curTimeStep + 1 % numTimeSteps);
		curGraph = graph.timesteps[curTimeStep];
	}

	function timeStepBackward() {
		// if (curTimeStep - 1 === 0) {
		// 	//You are at the first timeStep, so loop to the last
		// 	curGraph = graph.timesteps[numTimeSteps - 1];
		// 	console.log(curTimeStep);
		// } else {
		// 	//move to the previous timeStep
		// 	curGraph = graph.timesteps[curTimeStep - 1];
		// 	console.log(curTimeStep);
		// }
		curTimeStep = (curTimeStep - 1 % numTimeSteps);
		curGraph = graph.timesteps[curTimeStep];
	}

	function graphUpdate(graph: StaticDrinkGraph, _width: number, _height: number, _color: string)/*:return type*/ {

		let arraySize = graph.nodes.length;
		let colorDomain = getColorDomain(graph.edges);
		let defaultColorRange = ["white", "red"];

		let colorMap = d3Scale.scaleLinear<string>()
			.domain(colorDomain)
			.range(defaultColorRange);

		var svg = d3.selectAll("body").append("svg")
			.attr("width", _width)
			.attr("height", _height)

		svg.append("rect")
			.attr("class", "backgorund")
			.attr("width", _width)
			.attr("height", _height)

		for (var i = 0; i < arraySize; i++) {
			//i represents the yAxis, j represents the xAxis
			for (var j = 0; j < arraySize; j++) {
				svg.append("g")
					// .attr("width", _width / arraySize)
					// .attr("height", _height / arraySize)
					.data(graph.edges)
					.append("rect").enter()
					.attr("fill", _color)
					.attr("width", arraySize / _width)
					.attr("height", arraySize / _height)
					.attr("x", function (d) {
						//plus is the convert string to int command, we know that node
						//ids can be converted to ints
						console.log(d.id);
						return ((+d.source.id) / arraySize) * 100 + "%";
					})
					.attr("y", function (d) {
						//plus is the convert string to int command, we know that node
						//ids can be converted to ints

						return ((+d.target.id) / arraySize) * 100 + "%";
					})
					.append("text").enter()
					.text(function (d) {
						return d.weight;
					})

			}
		}
	}

	//---------------------------------------------------------------------------------------------------
	//------------------------ Helper Functions----------------------------------------------------------
	//---------------------------------------------------------------------------------------------------

	function animatedHeatMap(graph: StaticDrinkGraph, _width: number, _height: number, _color: string) {
		console.log("you called this function");
		graphUpdate(curGraph, width, height, generateRandomColor());
		setTimeout(timeStepForward(), 4000);

	}

	function doNothing() {

	}

	function generateRandomColor(): string {
		return "hsl(" + ((Math.random() * 330) + 20) + ", " + ((Math.random() * 90) + 9) + "%, " + ((Math.random() * 90) + 9) + ")";
	}


	function matrixTimeline() {
		for (var i = 0; i < numTimeSteps; i++) {
			console.log("printing" + curTimeStep);
			graphUpdate(curGraph, width * numTimeSteps, height, generateRandomColor());
			console.log("callin timeStepForward");
			timeStepForward();

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

});






/*                     DEAD CODE



			// svg.enter().append("text")
			// 	.attr("x", (j / (arraySize)) * 100 + "%")
			// 	.attr("y", (i / (arraySize)) * 100 + "%")
			// 	.text("HI")
			// 	.attr("fill", "black");

				// 			.selectAll("g").enter().append("rect")
	// 			.data(graph.nodes)
	// 		.attr("x", function(d){
	// 			//plus is the convert string to int command, we know that node
	// 			//ids can be converted to ints
	// 			return ((+d.id)/arraySize)*100 + "%";
	// 		})
	// 		.attr("y", function(d){
	// 			//plus is the convert string to int command, we know that node
	// 			//ids can be converted to ints
	// 			return ((+d.id)/arraySize)*100 + "%";
	// 		})
	// 		.attr("width", _width/arraySize)
	// 		.attr("heigt", _height/arraySize);
	// }


	// 	for (var i = 0; i < arraySize; i++) {
	// 		//i represents the yAxis, j represents the xAxis
	// 		for (var j = 0; j < arraySize; j++) {
	// 			svg.append("rect")
	// 				.attr("width", _width / arraySize)
	// 				.attr("height", _height / arraySize)
	// 				.attr("fill", _color)
	// 				.attr("x", (j / (arraySize)) * 100 + "%")
	// 				.attr("y", (i / (arraySize)) * 100 + "%")
	// 				.attr("stroke", "black");
	// 		}
	// 		svg.enter().append("text")
	// 			.attr("x", (j / (arraySize)) * 100 + "%")
	// 			.attr("y", (i / (arraySize)) * 100 + "%")
	// 			.text(function (d) {
	// 				console.log(d);
	// 				return d.source.id + "";
	// 			})
	// 			.attr("fill", "black");
	// 	}
	// }
	*/