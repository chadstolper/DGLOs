/* Assumptions:
	-A dynamic graph is an array of graphs
	-A graph contains an array of nodes and an array of edges
	-A node has an id
	-An edge has a source, a target, and a weight
*/

import * as d3 from "d3-selection";
//this line breaks vscode
//import * as d3Scale from "d3-scale";
import * as d3Array from "d3-array";
import { json as d3json } from "d3-request";
import { Graph, Node, Edge } from "./Graph";
import { Person, Drink, DrinkEdge, StaticDrinkGraph , DynamicDrinkGraph } from "./DummyGraph";
 
d3json("data/dummy/dummy.json", function (response:any){
	let graph:DynamicDrinkGraph = new DynamicDrinkGraph(response);
	let curTimeStep = 0; 
	let numTimeSteps = graph.timesteps.length;
	let curGraph = graph.timesteps[0];
	let width = 700;
	let height = 700;
	
	//TSLINT IS NOT WORKING CORRECTLY

	var svg = d3.selectAll("body").append("svg")
					.attr("width", width)
					.attr("height", height)
				.append("g");
	 

	svg.append("rect")
		.attr("class", "backgorund")
		.attr("width", width)
		.attr("height", height)
		.attr("fill","red");

	function timeStepForward(){
		if(curTimeStep + 1 == numTimeSteps){
			//You have reached the last timeStep, so loop back to the first
			curGraph = graph.timesteps[0];
			console.log(curTimeStep);
			//update the visualization of the new graph
			graphUpdate(curGraph);
		} else {
			//Move to the next timeStep
			curGraph = graph.timesteps[curTimeStep + 1];
			console.log(curTimeStep);
			//update the visualization of the new graph
			graphUpdate(curGraph);
		}
	}

	function timeStepBackward(){
		if(curTimeStep - 1 == 0){
			//You are at the first timeStep, so loop to the last
			curGraph = graph.timesteps[numTimeSteps - 1];
			console.log(curTimeStep);
			//update the visualization of the new graph
			graphUpdate(curGraph);
		} else {
			//move to the previous timeStep
			curGraph = graph.timesteps[curTimeStep - 1];
			console.log(curTimeStep);
			//update the visualization of the new graph
			graphUpdate(curGraph);
		}
	}


	/*
	takes a list of edges
	returns a 2-element array with the minimum edge weight as the first element
	and the maximum edge weight as the second element.
	*/
	function getColorDomain(edges:Array<Edge>){
		return d3Array.extent(edges, function(d:Edge):number{
			return d.weight;
		});
	}

	function setColorRange(colorArray:Array<string>){
		for(var i = 0; i < colorArray.length; i++){
			
		}
	}

	function graphUpdate(graph:StaticDrinkGraph)/*:return type*/{
		//make an SVG matrix that is graph.nodes.length by graph.nodes.length
		let defaultColorRange = ["white","gold"];
		let arraySize = graph.nodes.length;
		let colorDomain = getColorDomain(graph.edges);
		
		//ERROR THAT SHOULDN'T BE HAPPENING
		//Argument of type 'string[]' is not assignable to parameter of type 'number[]'.
		// let colorMap = d3Scale.scaleLinear()
		// 	.domain(colorDomain)
		// 	.range(defaultColorRange);

		var matrix = new Array(arraySize);
		for(var i = 0; i < arraySize; i++){
			matrix[i] = new Array(arraySize);
			for(var j = 0; j < arraySize; j++){
				matrix[i][j] = Math.random()*2 - 1;
				console.log(matrix[i][j]);
			}
		}
	}


});