import { Node, Edge, Graph, DynamicGraph } from "./Graph"
import { ForceDirectedGraph } from "./ForceDirectedGraph"
import { Selection } from "d3-selection";
import * as d3 from "d3-selection";
//import { transition } from "d3-transition";

export class Egograph extends ForceDirectedGraph {

	private _centralNode: Node;
	private _curGraph: Graph;
	private _incidentEdges: Array<Edge>;
	private _neighboringNodes: Array<Node>;

	constructor(centralNode: Node, dynamicGraph: DynamicGraph, location: Selection<any, {}, any, {}>,
		width: number, height: number) {
		super(dynamicGraph, location, width, height);
		this._centralNode = centralNode;
		this._curGraph = this.graph.timesteps[0];
		this._incidentEdges = [] //this.getIncidentEdges();
		this._neighboringNodes = []//this.getNeighboringNodes();
		this.init();
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
	public init() {
		this.getIncidentEdges();
		this.getNeighboringNodes();
		//just pass the super class the graph that I want it to draw: i.e., a list of incident edges
		//and neighboring nodes
		let g: Graph = new Graph(this._neighboringNodes, this._incidentEdges);
		console.log(g);
		super.draw(g);
	}
	// private createDynamicGraph() {
	// 	let dGraph = new DynamicGraph()
	// }

}