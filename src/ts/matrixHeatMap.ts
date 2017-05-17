/* Assumptions:
	-A dynamic graph is an array of graphs
	-A graph contains an array of nodes and an array of edges
	-A node has an id
	-An edge has a source, a target, and a weight
*/

import * as d3 from "d3-selection";
import { json as d3json } from "d3-request";
import { Graph, Node, Edge } from "./Graph";
import { Person, Drink, DrinkEdge, StaticDrinkGraph , DynamicDrinkGraph } from "./DummyGraph";

d3json("data/dummy/dummy.json", function (response: any){
	let graph:DynamicDrinkGraph = new DynamicDrinkGraph(response);
	let curTimeStep = 0;
	let numTimeSteps = graph.timesteps.length;
	let curGraph = graph.timesteps[0];

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

	function graphUpdate(graph:StaticDrinkGraph)/*:return type*/{
		
	}


});