import { Heatmap } from "./Heatmap"
import { DynamicGraph, Graph } from "./Graph";
import { Selection } from "d3-selection";

export class AnimatedHeatmap extends Heatmap {

	private _dynamicGraph: DynamicGraph;
	private _curGraph: Graph;
	private _curTimeStep: number;
	private _numTimeSteps: number;

	constructor(width: number, height: number, colorDomain: Array<string>, location: Selection<any, {}, any, {}>,
		dynamicGraph: DynamicGraph) {
		super(width, height, colorDomain, location);
		this._dynamicGraph = dynamicGraph;
		this._curTimeStep = 0;
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
		super.draw(this._curGraph);
	}

}

