import { Node, Edge, Graph, DynamicGraph } from "./Graph"


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
		this._incidentEdges = this.getIncidentEdges();
		this._neighboringNodes = this.getNeighboringNodes();
	}

	private getIncidentEdges(): Array<Edge> {
		return null;
	}
	private getNeighboringNodes(): Array<Node> {
		return null;
	}

}