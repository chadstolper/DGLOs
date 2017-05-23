import { Node, Edge, Graph, DynamicGraph } from "./Graph"
import { ForceDirectedGraph } from "./ForceDirectedGraph"
import { Selection } from "d3-selection";
import * as d3 from "d3-selection";
//import { transition } from "d3-transition";

export class Egograph extends ForceDirectedGraph {

	private _centralNode: Node;
	private _curGraph: Graph;
	private _curTimestep: number;
	private _neighboringNodes: Array<Node>;
	private _incidentEdges: Array<Edge>;


	constructor(centralNode: Node, dynamicGraph: DynamicGraph, location: Selection<any, {}, any, {}>,
		width: number, height: number) {
		super(dynamicGraph, location, width, height);
		this._centralNode = centralNode;
		this._curTimestep = 0;
		this._curGraph = super.graph.timesteps[this._curTimestep];
		this._incidentEdges = [];
		this._neighboringNodes = [];
	}


	private getIncidentEdges() {
		for (let n of this._curGraph.edges) {
			if (n.target.id === this._centralNode.id || n.source.id === this._centralNode.id) {
				this._incidentEdges.push(n);
			}
		}
	}
	private getNeighboringNodes() {
		for (let n of this._incidentEdges) {
			for (let m of this._curGraph.nodes) {
				if (m !== this._centralNode && (n.source.id === m.id || n.target.id === m.id)) {
					this._neighboringNodes.push(m);
				}
			}
		}
		this._neighboringNodes.push(this._centralNode);
	}





























	get incidentEdges() {
		return this._incidentEdges;
	}
	get neighboringNodes() {
		return this._neighboringNodes;
	}

	private setCentralNode(node: Node) {
		this._centralNode = node;
	}

	// this function will move the _curGraph forward through the _dynamicGraph.timesteps array,
	//looping back to the start from the finish. 
	private timeStepForward() {
		this._curTimestep = (this._curTimestep + 1) % super.graph.timesteps.length;
		this._curGraph = super.graph.timesteps[this._curTimestep];
	}

	//this function is similar to timeStepForward(), except it moves _curGraph backwards
	//through the _dynamicGraph.timestamps array.
	private timeStepBackward() {
		this._curTimestep = (this._curTimestep + super.graph.timesteps.length - 1) % super.graph.timesteps.length;
		this._curGraph = super.graph.timesteps[this._curTimestep];
	}
}