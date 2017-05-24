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
	private _incidentEdgesMap: Map<number, Edge>;
	private _neighboringNodes: Array<Node>;
	private _centralNodeArray: Array<Node>;
	private _incidentEdges: Array<Edge>;

	constructor(centralNode: Node, dynamicGraph: DynamicGraph, location: Selection<any, {}, any, {}>,
		width: number, height: number) {
		super(dynamicGraph, location);
		this._centralNode = centralNode;
		this._curTimestep = 0;
		this._curGraph = super.graph.timesteps[this._curTimestep];
		this._incidentEdges = [];
		this._neighboringNodes = [];
		this._centralNodeArray = [];
		this._incidentEdgesMap = new Map();
		this._neighboringNodesMap = new Map();
		this.init();
	}


	//this function fills the _incidentEdge array with all of the edges that touch the central node
	//through every timestep. It must be called before calling getNeighboringNodes.
	private getIncidentEdges() {
		let steps = super.graph.timesteps;
		for (let k of steps) {
			for (let n of k.edges) {
				if (n.target.id === this._centralNode.id || n.source.id === this._centralNode.id) {
					this._incidentEdgesMap.set(n.id as number, n);
				}
			}
		}
		this.edgeMapToEdgeArray();
	}

	//this function creates a mapping of every node that ever shares an edge with the central
	//node. The function must be called after calling getIncidentEdges(), as this function
	//relies on having a list of edges to determine which nodes touch the central node.
	private getNeighboringNodes() {
		//if a node ever is connected to the centralNode, add it to the neighboring nodes. However,
		//there should be no duplicates
		let steps = super.graph.timesteps;
		for (let k of steps) {
			for (let n of k.nodes) {
				for (let m of this._incidentEdges) {
					if (n.id !== this._centralNode.id && (m.source.id === n.id || m.target.id === n.id)) {
						this._neighboringNodesMap.set(n.id as number, n);
					}
				}
			}
			this._neighboringNodesMap.set(this._centralNode.id as number, this._centralNode);

		}
		this.putMapInArray();
		this.getCentralNodes();
		this.positionCentralNodes();
		this.mergeNodeLists();

	}

	private positionCentralNodes() {
		for (let n of this._centralNodeArray) {
			n.vx = 0;
			n.vy = 0;
			n.x = 100;
			n.y = 100;
		}
	}

	private getCentralNodes() {
		let graph = super.graph;
		for (let n of graph.timesteps) {
			for (let m of n.nodes) {
				if (m.id === this._centralNode.id) {
					this._centralNodeArray.push(m);
				}
			}
		}
	}

	private clickTransition(self: Egograph) {
		let graph = this;
		return function (d: Node, i: number) {
			graph.emptyArray();
			graph.clearMap();
			console.log(graph._centralNode);
			graph._centralNode = d;
			console.log(d, graph._centralNode);
			graph.init();
		}
	}

	protected clickListen() {
		this.nodeGlyphs.on("click", this.clickTransition(this));
	}

	public init() {
		this.getIncidentEdges();
		this.getNeighboringNodes();
		let g: Graph = new Graph(this._neighboringNodes, this._incidentEdges);
		super.draw(g);
		console.log(this._incidentEdges);
		console.log(this._neighboringNodes);
		this.clickListen();
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

	// // this function will move the _curGraph forward through the _dynamicGraph.timesteps array,
	// //looping back to the start from the finish. 
	// private timeStepForward() {
	// 	this._curTimestep = (this._curTimestep + 1) % super.graph.timesteps.length;
	// 	this._curGraph = super.graph.timesteps[this._curTimestep];
	// }

	// //this function is similar to timeStepForward(), except it moves _curGraph backwards
	// //through the _dynamicGraph.timestamps array.
	// private timeStepBackward() {
	// 	this._curTimestep = (this._curTimestep + super.graph.timesteps.length - 1) % super.graph.timesteps.length;
	// 	this._curGraph = super.graph.timesteps[this._curTimestep];
	// }

	private clearMap() {
		this._neighboringNodesMap.clear();
	}
	private edgeMapToEdgeArray() {
		for (let key of this._incidentEdgesMap.keys()) {
			this._incidentEdges.push(this._incidentEdgesMap.get(key));
		}
	}

	private putMapInArray() {
		for (let key of this._neighboringNodesMap.keys()) {
			this._neighboringNodes.push(this._neighboringNodesMap.get(key));
		}
	}
	private emptyArray() {
		this._incidentEdges = [];
		this._neighboringNodes = [];
		this._centralNodeArray = [];
	}
	private mergeNodeLists() {
		for (let n of this._centralNodeArray) {
			this._neighboringNodes.push(n);
		}
	}
	protected drawLinks(edges: Edge[]) { //does what it says on the tin
		// this.linkGlyphs = this.linksG.selectAll("line")
		// 	.data(edges, function (d: Edge): string { return "" + d.id; }); //animate existing, dont create new line
		// this.linkGlyphs.exit().remove();
		// let linkEnter = this.linkGlyphs.enter().append("line") //create a new line for each edge in edgelist (subdivs defined)
		// 	.attr("stroke", "black");
		// this.linkGlyphs = this.linkGlyphs.merge(linkEnter)
		// this.linkGlyphs//.transition()
		// 	.attr("stroke-width", function (d: Edge): number { return d.weight; });
		super.drawLinks(edges);
		this.linkGlyphs.attr("source", function (d: Edge) {
			return d.source.id;
		})
		this.linkGlyphs.attr("target", function (d: Edge) {
			return d.target.id;
		})
	}
	protected drawNodes(nodes: Node[]) { //does what it says on the tin
		// this._nodeGlyphs = this.nodesG.selectAll("circle")
		// 	.data(nodes, function (d: Node): string { return "" + d.id });
		// this.nodeGlyphs.exit().remove();
		// let nodeEnter = this.nodeGlyphs.enter().append("circle")
		// 	.attr("id", function (d: any): string | number { return d.name; });
		// this._nodeGlyphs = this.nodeGlyphs.merge(nodeEnter);
		// this.nodeGlyphs
		// 	.attr("r", 10)
		// 	.attr("fill", (d: Node) => {
		// 		return this.color(d.id);
		// 	});
		super.drawNodes(nodes);
		this.nodeGlyphs.attr("id", function (d: Node) {
			return d.id;
		});
	}
}