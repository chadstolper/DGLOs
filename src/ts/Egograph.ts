import { Node, Edge, Graph, DynamicGraph } from "./Graph"
import { ForceDirectedGraph } from "./ForceDirectedGraph"
import { Selection } from "d3-selection";
import * as d3 from "d3-selection";
//import { transition } from "d3-transition";

export class Egograph extends ForceDirectedGraph {

	private _centralNode: Node;
	private _curGraph: Graph;
	private _curTimestep: number;
	private _neighboringNodesMap: Map<number, Node>;
	private _neighboringNodes: Array<Node>;
	private _incidentEdges: Array<Edge>;

	constructor(centralNode: Node, dynamicGraph: DynamicGraph, location: Selection<any, {}, any, {}>,
		width: number, height: number) {
		super(dynamicGraph, location);
		this._centralNode = centralNode;
		this._curTimestep = 0;
		this._curGraph = super.graph.timesteps[this._curTimestep];
		this._incidentEdges = [];
		this._neighboringNodes = [];
		this._neighboringNodesMap = new Map();
		this.init();
	}

	private getIncidentEdges() {
		for (let n of this._curGraph.edges) {
			if (n.target.id === this._centralNode.id || n.source.id === this._centralNode.id) {
				this._incidentEdges.push(n);
			}
		}
	}
	private getNeighboringNodes() {
		//if a node ever is connected to the centralNode, add it to the neighboring nodes. However,
		//there should be no duplicates
		let steps = super.graph.timesteps;
		for (let k of steps) {
			for (let n of this._curGraph.nodes) {
				for (let m of this._incidentEdges) {
					if (n.id !== this._centralNode.id && (m.source.id === n.id || m.target.id === n.id)) {
						this._neighboringNodesMap.set(n.id as number, n);
					}
				}
			}
			this.timeStepForward();
		}
		this._neighboringNodesMap.set(this._centralNode.id as number, this._centralNode);
	}

	public init() {
		let steps = super.graph.timesteps;
		this.getIncidentEdges();
		this.getNeighboringNodes();
		for (let n of steps) {
			this.getIncidentEdges();
			this.timeStepForward();
		}

		console.log(this._neighboringNodesMap.keys(), this._neighboringNodesMap.get(9));

		for (let key in this._neighboringNodes.keys()) {
			// this._neighboringNodes.push(this._neighboringNodesMap.get(key));
			console.log(key)//, this._neighboringNodesMap.get(key));
		}
		// let g: Graph = new Graph(Array.from(this._neighboringNodes), this._incidentEdges);
		// console.log(g);
		//super.draw(g);
		// this.nodeGlyphs.on("click", this.clickTransition(this));
	}
	// public update() {
	// 	let steps = super.graph.timesteps;
	// 	for (let n of steps) {
	// 		this.getIncidentEdges();
	// 		this.timeStepForward();
	// 	}
	// 	let g: Graph = new Graph(Array.from(this._neighboringNodes), this._incidentEdges);
	// 	console.log(g);
	// 	super.draw(g);
	// }

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

	// private clickTransition(self: Egograph) {
	// 	return function (d: Node, i: number) {
	// 		this._centralNode = d;
	// 		this.update();
	// 	}
	// }
}