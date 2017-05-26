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
	private _graphToDraw: Graph;

	constructor(centralNode: Node, dGraph: DynamicGraph, location: Selection<any, {}, any, {}>) {
		super(dGraph, location);
		this._centerNode = centralNode;
		this._nbrEdges = [];
		this._nbrNodes = [];
		this._centralNodeArray = [];
		this._nbrNodesMap = new Map();
		this._graphToDraw = new Graph([], [], 0);
		this.init();
		this.paint();
	}

	protected get centerNode() {
		return this._centerNode;
	}
	protected set centerNode(node: Node) {
		this._centerNode = node;
	}

	private init() {
		this.graph.timesteps.forEach(function (step: Graph) {
			step.edges.forEach(function (e: DrawableEdge) {
				e.origSource = e.source;
				e.origTarget = e.target;
			})
		})
	}

	private paint() {
		this.readyNodesAndEdges();
		this._graphToDraw = new Graph(this._nbrNodes, this._nbrEdges as Array<DrawableEdge>, 0);
		super.draw(this._graphToDraw);
		this.clickListen();
	}

	private readyNodesAndEdges() {
		this.getCentralNodes();
		this.getEdges();
		this.getNodes();
		this.mergeNodeLists();
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
				if (this._centralNodeArray.includes(edge.target)) {
					this._nbrNodesMap.set(edge.source.id as number, edge.source);
				}
				if (this._centralNodeArray.includes(edge.source)) {
					this._nbrNodesMap.set(edge.target.id as number, edge.target);
				}
			}
		}

		for (let edge of this._nbrEdges as Array<DrawableEdge>) {
			if (this._nbrNodesMap.has(edge.origSource.id as number)) {
				edge.source = this._nbrNodesMap.get(edge.origSource.id as number);
			}
			if (this._nbrNodesMap.has(edge.origTarget.id as number)) {
				edge.target = this._nbrNodesMap.get(edge.origTarget.id as number);
			}
		}
		//convert the map to an array
		for (let key of this._nbrNodesMap.keys()) {
			this._nbrNodes.push(this._nbrNodesMap.get(key));
		}
	}
	private mergeNodeLists() {
		for (let node of this._centralNodeArray) {
			this._nbrNodes.push(node);
		}
	}

	private clickTransition(self: Egograph) {
		let ego = this;
		return function (d: Node, i: number) {
			ego.emptyArrays();
			ego._centerNode = d;
			ego.paint();
		}
	}

	protected clickListen() {
		this.nodeGlyphs.on("click", this.clickTransition(this));
	}

	private emptyArrays() {
		this._nbrNodesMap.clear();
		this._centralNodeArray = [];
		this._nbrEdges = [];
		this._nbrNodes = [];
	}
}



