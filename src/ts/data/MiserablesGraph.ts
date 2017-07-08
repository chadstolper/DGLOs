import { DynamicGraph, Graph, Node, Edge } from "../model/DynamicGraph";

export class Person extends Node {
	constructor(id: string, index: number, group: number, timestep: number) {
		super(id, index, "" + group, id, timestep);
	}
}

export class Cooccurence extends Edge {
	constructor(id: string | number, source: Node, target: Node, value: number, timestep: number) {
		super(id, source, target, value, timestep);
	}
}

export class LesMiserablesGraph extends Graph {
	public constructor(rawNodeData: Array<any>, rawEdgeData: Array<any>, timestamp: number) {
		const nodeData: Array<Node> = new Array<Node>();
		const edgeData: Array<Edge> = new Array<Edge>();
		let index: number = 0;
		for (const n of rawNodeData) {
			const node: Person = new Person(n.id, index, n.group, timestamp);
			nodeData.push(node);
			index++;
		}
		for (const e of rawEdgeData) {
			const source: Node = nodeData.find(function (n: Node): boolean {
				return n.id === e.source;
			});

			const target: Node = nodeData.find(function (n: Node): boolean {
				return n.id === e.target;
			});
			const id: string = "" + source.id + ":" + target.id;

			const edge: Cooccurence = new Cooccurence(id, source, target, e.value, timestamp);
			edgeData.push(edge);
		}
		nodeData.sort(function (a: Node, b: Node): number {
			return +a.type - +b.type;
		})
		super(nodeData, edgeData, timestamp);
	}
}

export class DynamicLesMiserablesGraph extends DynamicGraph {
	public constructor(response: any) {
		const graphs: Array<LesMiserablesGraph> = new Array<LesMiserablesGraph>();
		const rawNodeData: Array<any> = response.nodes;
		const rawEdgeData: Array<any> = response.links;
		const timestep: number = response.timestep;
		const g: LesMiserablesGraph = new LesMiserablesGraph(rawNodeData, rawEdgeData, timestep);
		graphs.push(g);

		super(graphs);
	}
}