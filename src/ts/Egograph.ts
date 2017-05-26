import { Node, Edge, Graph, DynamicGraph } from "./Graph"
import { ForceDirectedGraph } from "./ForceDirectedGraph"
import { Selection } from "d3-selection";
import { DrawableEdge } from "./DrawableEdge";
import * as d3Scale from "d3-scale";
import * as d3 from "d3-selection";
import * as d3force from "d3-force";
//import { transition } from "d3-transition";

export class Egograph extends ForceDirectedGraph {

	private _nbrNodes: Array<Node>;
	private _nbrNodesMap: Map<number, Node>
	private _nbrEdges: Array<Edge>;
	private _centralNodeArray: Array<Node>;
	private _centerNode: Node;

	constructor(centralNode: Node, dGraph: DynamicGraph, location: Selection<any, {}, any, {}>) {
		super(dGraph, location);
		this._centerNode = centralNode;
		this._nbrEdges = [];
		this._nbrNodes = [];
		this._centralNodeArray = [];
		this._nbrNodesMap = new Map();
		this.paint();
	}

	private paint() {
		this.readyNodesAndEdges();
		// let g: Graph = new Graph(this._nbrNodes, this._nbrEdges, 0);
		// super.draw(g);
	}

	private readyNodesAndEdges() {
		this.getCentralNodes();
		this.getEdges();
		this.getNodes();
		this.mergeNodeLists();
		console.log(this._nbrNodes);
	}


	private getCentralNodes() {
		let dGraph = super.graph;
		for (let step of dGraph.timesteps) {
			for (let node of step.nodes) {
				if (node.id === this._centerNode.id) {
					this._centralNodeArray.push(node);
				}
			}
		}
	}

	private getEdges() {
		let dGraph = super.graph;
		for (let step of dGraph.timesteps) {
			for (let edge of step.edges) {
				if (this._centralNodeArray.includes(edge.source)
					|| this._centralNodeArray.includes(edge.target)) {
					this._nbrEdges.push(edge);
				}

			}
		}
	}

	private getNodes() {
		let dGraph = super.graph;
		for (let step of dGraph.timesteps) {
			for (let edge of this._nbrEdges) {
				this._nbrNodesMap.set(edge.source.id as number, edge.source);
				this._nbrNodesMap.set(edge.target.id as number, edge.target);
			}
		}

		//convert the map to an array
		for (let key of this._nbrNodesMap.keys()) {
			console.log(this._nbrNodesMap.get(key));
			this._nbrNodes.push(this._nbrNodesMap.get(key));
		}

	}
	private mergeNodeLists() {
		for (let node of this._centralNodeArray) {
			this._nbrNodes.push(node);
		}
	}


}



