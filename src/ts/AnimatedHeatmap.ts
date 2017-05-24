import { Heatmap } from "./Heatmap"
import { DynamicGraph, Graph } from "./Graph";
import { Selection } from "d3-selection";
import * as d3 from "d3-selection";

export class AnimatedHeatmap extends Heatmap {

	//TODO: BREAK ALL THE THINGS!!!
	//sorry Will

	private _dynamicGraph: DynamicGraph;
	private _curGraph: Graph;
	private _curTimeStep = 0;
	private _numTimeSteps: number;

	constructor(dynamicGraph: DynamicGraph, location: Selection<any, {}, any, {}>, colorDomain?: Array<string>) {
		super(dynamicGraph.timesteps[0], location, colorDomain);
		this._dynamicGraph = dynamicGraph;
		this._curGraph = this._dynamicGraph.timesteps[this._curTimeStep];
		this._numTimeSteps = this._dynamicGraph.timesteps.length;
		this.init();
	}

	//this function will move the _curGraph forward through the _dynamicGraph.timesteps array,
	//looping back to the start from the finish. 
	private timeStepForward() {
		this._curTimeStep = (this._curTimeStep + 1) % this._numTimeSteps;
		this._curGraph = this._dynamicGraph.timesteps[this._curTimeStep];
	}

	//this function is similar to timeStepForward(), except it moves _curGraph backwards
	//through the _dynamicGraph.timestamps array.
	private timeStepBackward() {
		this._curTimeStep = (this._curTimeStep + this._numTimeSteps - 1) % this._numTimeSteps;
		this._curGraph = this._dynamicGraph.timesteps[this._curTimeStep];
	}

	public animateForward() {
		this.timeStepForward();
		super.draw(this._curGraph);
	}
	public animateBackward() {
		this.timeStepBackward();
		super.draw(this._curGraph);
	}
	private init() {

		let self = this;

		let prevButton = d3.select("body").append("div").append("button")
			.text("<--")
			.on("click", function () {
				self.animateBackward()
			});

		let nextButton = d3.select("body").append("div").append("button")
			.text("-->")
			.on("click", function () {
				self.animateForward()
			});

		super.draw(this._curGraph);
	}

}

