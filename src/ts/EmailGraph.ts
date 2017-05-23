import { DynamicGraph, Graph, Node, Edge } from "./Graph";

export class RadoslawEmployee extends Node {
	constructor(id: number | string) {
		super(id, "RadoslawEmployee", "" + id);
	}
}

export class RadoslawEmail extends Edge {
	constructor(id: number | string, source: Node, target: Node, weight: number) {
		super(id, source, target, weight);
	}
}

export class StaticRadoslawGraph extends Graph {
	public constructor(rawNodeData: Array<any>, rawEdgeData: Array<any>) {
		let nodeData = new Array<Node>();
		let edgeData = new Array<Edge>();
		for (let n of rawNodeData) {
			let node = new RadoslawEmployee(n);
			nodeData.push(node);
		}
		for (let e of rawEdgeData) {
			let source: Node = nodeData.find(function (n: Node): boolean {
				return n.id === e.from;
			});

			let target: Node = nodeData.find(function (n: Node): boolean {
				return n.id === e.to;
			});
			let id: string = "" + source.id + ":" + target.id;

			let edge = new RadoslawEmail(e.id, source, target, e.weight);
			edgeData.push(edge);
		}
		super(nodeData, edgeData);
	}
}

export class DynamicRadoslawGraph extends DynamicGraph {
	public constructor(response: Array<any>) {
		let graphs: Array<StaticRadoslawGraph> = new Array<StaticRadoslawGraph>();
		for (let timestep of response) {
			let rawNodeData: Array<any> = timestep.nodes;
			let rawEdgeData: Array<any> = timestep.edges;
			let g: StaticRadoslawGraph = new StaticRadoslawGraph(rawNodeData, rawEdgeData);
			graphs.push(g);
		}
		super(graphs);
	}
}