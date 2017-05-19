import * as d3 from "d3-selection";
import { Heatmap } from "./Heatmap"
import { json as d3json } from "d3-request";
import { DynamicDrinkGraph } from "./DummyGraph";

d3json("data/dummy/dummy.json", function (response: any) {
	let graph: DynamicDrinkGraph = new DynamicDrinkGraph(response);
	let curTimeStep = 0;
	let curGraph = graph.timesteps[0];
	let numTimeSteps = graph.timesteps.length;

	let width = 750;
	let height = 750;

	let nextButton = d3.select("body").append("div").append("button")
		.text("-->")
		.on("click", timeStepForward);

	let svg = d3.select("body").append("div").append("svg")
		.attr("width", width)
		.attr("height", height);


	let heatmap: Heatmap = new Heatmap(width, height, ["white", "gold"], svg);

	/*using the mod operator, this function moves the current timestep 
	forward by one. If the current timeStep is at the end of the timeStep array,
	this function sets the current timeStep to timesteps[0].*/
	function timeStepForward() {
		curTimeStep = (curTimeStep + 1) % numTimeSteps;
		curGraph = graph.timesteps[curTimeStep];
		heatmap.draw(curGraph);
	}

	//A function similar to timeStep forward, except it moves the timeStep backward. 
	//It uses the mod operator to cycle through the loop in the same way as timeStepForward.
	function timeStepBackward() {
		curTimeStep = (curTimeStep - 1) % numTimeSteps;
		curGraph = graph.timesteps[curTimeStep];
		heatmap.draw(curGraph);
	}

	heatmap.draw(graph.timesteps[curTimeStep]);
});