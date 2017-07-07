import { DynamicGraph, Graph, Node, Edge } from "../model/DynamicGraph";

export class RadoslawEmployee extends Node {
	constructor(id: number | string, index: number, timestep: number) {
		super(+id, index, "RadoslawEmployee", "" + id, timestep);
	}
}

export class RadoslawEmail extends Edge {
	constructor(id: number | string, source: Node, target: Node, weight: number, timestep: number) {
		super(+id, source, target, weight, timestep);
	}
}

export class StaticRadoslawGraph extends Graph {
	public constructor(rawNodeData: Array<any>, rawEdgeData: Array<any>, timestep: number) {
		const nodeData: Array<Node> = new Array<Node>();
		const edgeData: Array<Edge> = new Array<Edge>();
		let index: number = 0;
		for (const n of rawNodeData) {
			const node: RadoslawEmployee = new RadoslawEmployee(n, index, timestep);
			nodeData.push(node);
			index++;
		}
		for (const e of rawEdgeData) {
			const source: Node = nodeData.find(function (n: Node): boolean {
				return n.id === +e.from;
			});

			const target: Node = nodeData.find(function (n: Node): boolean {
				return n.id === +e.to;
			});
			const id: string = "" + source.id + ":" + target.id;

			const edge: RadoslawEmail = new RadoslawEmail(id, source, target, e.weight, timestep);
			edgeData.push(edge);
		}
		nodeData.sort(function (a: Node, b: Node): number {
			return +a.id - +b.id;
		})
		super(nodeData, edgeData, timestep);
	}
}

export class DynamicRadoslawGraph extends DynamicGraph {
	public constructor(response: Array<any>) {
		const graphs: Array<StaticRadoslawGraph> = new Array<StaticRadoslawGraph>();
		for (const timestep of response) {
			const rawNodeData: Array<any> = timestep.nodes;
			const rawEdgeData: Array<any> = timestep.edges;
			const timestamp: number = timestep.timestamp;
			const g: StaticRadoslawGraph = new StaticRadoslawGraph(rawNodeData, rawEdgeData, timestamp);
			graphs.push(g);
		}
		super(graphs);
	}
}