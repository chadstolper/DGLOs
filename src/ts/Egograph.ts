import { Node, Edge, Graph, DynamicGraph } from "./Graph"
import { ForceDirectedGraph } from "./forceDirectedGraph"

export class Egograph {

	private _centralNode: Node;
	private _dynamicGraph: DynamicGraph;
	private _curGraph: Graph;
	private _incidentEdges: Array<Edge>;
	private _neighboringNodes: Array<Node>;
	private _curTimeStep: number;

	constructor(centralNode: Node, timestep: number, dynamicGraph: DynamicGraph) {
		this._centralNode = centralNode;
		this._dynamicGraph = dynamicGraph;
		this._curTimeStep = timestep;
		this._curGraph = this._dynamicGraph.timesteps[this._curTimeStep];
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
	}
	public init() {
		this.getIncidentEdges();
		this.getNeighboringNodes();
		this.draw();
	}
	public draw() {
		// let svg = d3.selectAll("body").append("div").append("svg")
		// 		.data(this._neighboringNodes).enter()
		// 		.append("circle")
		// 		.attr("r", 10)

	}
	public click() {

	}

}