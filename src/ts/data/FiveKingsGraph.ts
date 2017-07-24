import { Node, Edge, Graph, DynamicGraph } from "../model/DynamicGraph";

export class Combatant extends Node {
	constructor(name: string, index: number, timestamp: number) {
		super(name, index, "Combatant", name, timestamp);
	}
}

export class Fight extends Edge {
	constructor(attacker: Combatant, defender: Combatant, count: number, timestamp: number) {
		const id: string = timestamp + ":" + attacker.label + " -->" + defender.label;
		super(id, attacker, defender, count, timestamp);
	}
}

export class StaticFiveKingsGraph extends Graph {
	public constructor(rawNodeData: any[], rawEdgeData: any[], timestamp: number) {
		const nodeData: Array<Node> = new Array<Node>();
		const edgeData: Array<Edge> = new Array<Edge>();
		let index: number = 0;
		for (const name of rawNodeData) {
			const node: Combatant = new Combatant(name, index, timestamp);
			nodeData.push(node);
			index++;
		}
		for (const e of rawEdgeData) {
			const source: Node = nodeData.find(function (n: Node): boolean {
				return n.label === e.attacker;
			});

			const target: Node = nodeData.find(function (n: Node): boolean {
				return n.label === e.defender;
			});

			const edge: Fight = new Fight(source, target, e.count, timestamp);
			edgeData.push(edge);
		}
		super(nodeData, edgeData, timestamp);
	}
}

export class DynamicFiveKingsGraph extends DynamicGraph {
	public constructor(response: any[]) {
		const graphs: Array<StaticFiveKingsGraph> = new Array<StaticFiveKingsGraph>();
		for (const timestep of response) {
			const rawNodeData: Array<any> = timestep.nodes;
			const rawEdgeData: Array<any> = timestep.edges;
			const timestamp: number = timestep.year;
			const g: StaticFiveKingsGraph = new StaticFiveKingsGraph(rawNodeData, rawEdgeData, timestamp);
			graphs.push(g);
		}
		super(graphs);
	}
}