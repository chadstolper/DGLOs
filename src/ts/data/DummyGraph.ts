import { Graph, DynamicGraph, Node, Edge } from "../model/DynamicGraph";

export class Person extends Node {
	private _role: string;
	public constructor(id: number | string, index: number, name: string, role: string, timestamp: number) {
		super(+id, index, "Person", name, timestamp);
		this._role = role;
	}

	get role(): string {
		return this._role;
	}

	set role(role: string) {
		this._role = role;
	}
}

export class Drink extends Node {
	private _price: number;
	public constructor(id: number | string, index: number, name: string, price: number, timestamp: number) {
		super(+id, index, "Drink", name, timestamp);
		this._price = price;
	}

	get price(): number {
		return this._price;
	}

	set price(price: number) {
		this._price = price;
	}
}

export class DrinkEdge extends Edge {
	private _consumption: number;
	private _preference: number;
	public constructor(id: number | string, source: Node, target: Node,
		consumption: number, preference: number, timestamp: number) {
		super(id, source, target, preference, timestamp);
		this._consumption = consumption;
		this._preference = preference;
	}
	get consumption(): number {
		return this._consumption;
	}

	get preference(): number {
		return this._preference;
	}

	set consumption(consumption: number) {
		this._consumption = consumption;
	}

	set preference(preference: number) {
		this._preference = preference;
	}
}

export class StaticDrinkGraph extends Graph {
	public constructor(rawNodeData: Array<any>, rawEdgeData: Array<any>, timestep: number) {
		const nodeData: Array<Node> = new Array<Node>();
		const edgeData: Array<Edge> = new Array<Edge>();

		let index: number = 0;
		for (const n of rawNodeData) {
			if (n.type === "person") {
				const p: Person = new Person(n.id, index, n.name, n.role, timestep);
				nodeData.push(p);
			} else if (n.type === "drink") {
				const d: Drink = new Drink(n.id, index, n.name, n.price, timestep);
				nodeData.push(d);
			}
			index++;
		}

		for (const e of rawEdgeData) {

			const source: Node = nodeData.find(function (n: Node): boolean {
				return n.id === +e.source;
			});

			const target: Node = nodeData.find(function (n: Node): boolean {
				return n.id === +e.target;
			});

			const id: string = "" + source.id + ":" + target.id;

			const de: DrinkEdge = new DrinkEdge(id, source, target, +e.consumption, +e.preference, timestep);
			edgeData.push(de);
		}

		super(nodeData, edgeData, timestep);
	}
}


export class DynamicDrinkGraph extends DynamicGraph {
	public constructor(response: Array<any>) {
		const graphs: Array<StaticDrinkGraph> = new Array<StaticDrinkGraph>();

		for (const timestep of response) {
			const rawNodeData: Array<any> = timestep.nodes;
			const rawEdgeData: Array<any> = timestep.edges;
			const timestamp: number = timestep.timestamp;
			const g: StaticDrinkGraph = new StaticDrinkGraph(rawNodeData, rawEdgeData, timestamp);
			graphs.push(g);
		}

		super(graphs);
	}
}