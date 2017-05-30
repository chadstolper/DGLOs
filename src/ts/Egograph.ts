import { Node, Edge, Graph, DynamicGraph } from "./Graph"
import { ForceDirectedGraph } from "./ForceDirectedGraph"
import { Selection } from "d3-selection";
import { DrawableEdge, DrawableNode } from "./DrawableEdge";
import * as d3Scale from "d3-scale";
import * as d3 from "d3-selection";
import * as d3force from "d3-force";
//import { transition } from "d3-transition";

export class Egograph extends ForceDirectedGraph {

	private _nbrNodes: Array<DrawableNode>;
	private _nbrNodesMap: Map<number | string, DrawableNode>
	private _nbrEdges: Array<DrawableEdge>;
	private _centralNodeArray: Array<DrawableNode>;
	private _centerNode: DrawableNode;
	private _graphToDraw: Graph;

	constructor(centralNode: Node, dGraph: DynamicGraph, location: Selection<any, {}, any, {}>) {
		super(dGraph, location);
		this._centerNode = centralNode as DrawableNode;
		this._nbrEdges = [];
		this._nbrNodes = [];
		this._centralNodeArray = [];
		this._nbrNodesMap = new Map();
		this._graphToDraw = new Graph([], [], 0);
		this.init();
		this.paint();
	}

	private init() {
		this.graph.timesteps.forEach(function (step: Graph) {
			step.edges.forEach(function (e: DrawableEdge) {
				e.origSource = e.source;
				e.origTarget = e.target;
			})
			step.nodes.forEach(function (n: DrawableNode) {
				n.origID = n.id;
				n.id = n.id + "-" + step.timestamp;
				n.timestamp = step.timestamp;
			})
		})

	}

	private paint() {
		this.readyNodesAndEdges();
		this.initSimulation();
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
		for (let step of this.graph.timesteps) {
			for (let node of step.nodes as DrawableNode[]) {
				if (node.origID === this._centerNode.origID) {
					this._centralNodeArray.push(node);
				}
			}
		}
	}

	private getEdges() {
		for (let step of this.graph.timesteps) {
			for (let edge of step.edges as DrawableEdge[]) {
				if (this._centralNodeArray.includes(edge.origSource)
					|| this._centralNodeArray.includes(edge.origTarget)) {
					this._nbrEdges.push(edge);
				}
			}
		}
	}

	private getNodes() {
		for (let edge of this._nbrEdges) {
			if (this._centralNodeArray.includes(edge.origTarget)) {
				this._nbrNodesMap.set(edge.origSource.origID, edge.origSource);
			}
			if (this._centralNodeArray.includes(edge.origSource)) {
				this._nbrNodesMap.set(edge.origTarget.origID, edge.origTarget);
			}
		}

		for (let edge of this._nbrEdges) {
			if (this._nbrNodesMap.has(edge.origSource.origID)) {
				edge.source = this._nbrNodesMap.get(edge.origSource.origID);
				edge.target = edge.origTarget;
			}
			if (this._nbrNodesMap.has(edge.origTarget.origID)) {
				edge.target = this._nbrNodesMap.get(edge.origTarget.origID);
				edge.source = edge.origSource;
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
		return function (d: DrawableNode, i: number) {
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

	protected drawNodes(nodes: Node[]) { //does what it says on the tin
		super.drawNodes(nodes);
		this.nodeGlyphs
			.attr("fill", (d: DrawableNode) => {
				return this.color(d.origID);
			});
	}

	protected initSimulation() {
		let yScale = d3Scale.scaleLinear()
			.domain([0, this.graph.timesteps.length])
			.range([0 + (super.height * .25), super.height - (super.height * 0.25)]);
		let centralNodes = this._centralNodeArray;
		let superWidth = super.width;

		super.initSimulation();
		this.simulation
			.force("alignCentralNodesX", d3force.forceX(function (d: DrawableNode) {
				if (centralNodes.includes(d)) {
					return superWidth / 2;
				}
				return 0;
			}).strength(function (d: DrawableNode) {
				if (centralNodes.includes(d)) {
					return 1;
				}
				return 0;
			}))
			.force("alignCentralNodesY", d3force.forceY(function (d: DrawableNode) {
				if (centralNodes.includes(d)) {
					return yScale(d.timestamp);
				}
				return 0;
			}).strength(function (d) {
				if (centralNodes.includes(d)) {
					return 1;
				}
				return 0;
			}));

	}
}



