import { Node, Edge, Graph, DynamicGraph } from "../model/DynamicGraph";

export class Combatant extends Node {
	constructor(name: string, index: number, timestamp: number) {
		super(name, index, "Combatant", name, timestamp);
	}
}

export class Fight extends Edge {
	constructor(attacker: Combatant, defender: Combatant, count: number, timestamp: number) {
		let id: string = timestamp + ":" + attacker.label + " -->" + defender.label;
		super(id, attacker, defender, count, timestamp);
	}
}

export class StaticFiveKingsGraph extends Graph {
	public constructor(rawNodeData: any[], rawEdgeData: any[], timestamp: number) {
		let nodeData = new Array<Node>();
		let edgeData = new Array<Edge>();
		let index = 0;
		for (let name of rawNodeData) {
			let node = new Combatant(name, index, timestamp);
			nodeData.push(node);
			index++;
		}
		for (let e of rawEdgeData) {
			let source: Node = nodeData.find(function (n: Node): boolean {
				return n.label === e.attacker;
			});

			let target: Node = nodeData.find(function (n: Node): boolean {
				return n.label === e.defender;
			});

			let edge = new Fight(source, target, e.count, timestamp);
			edgeData.push(edge);
		}
		super(nodeData, edgeData, timestamp);
	}
}

export class DynamicFiveKingsGraph extends DynamicGraph {
	public constructor(response: any[]) {
		let graphs: Array<StaticFiveKingsGraph> = new Array<StaticFiveKingsGraph>();
		for (let timestep of response) {
			let rawNodeData: Array<any> = timestep.nodes;
			let rawEdgeData: Array<any> = timestep.edges;
			let timestamp: number = timestep.year;
			let g: StaticFiveKingsGraph = new StaticFiveKingsGraph(rawNodeData, rawEdgeData, timestamp);
			graphs.push(g);
		}
		super(graphs);
		console.log(this)
	}
}