import { SimulationNodeDatum } from "d3-force";

export class Node implements SimulationNodeDatum {
	private _id: string | number;
	private _type: string;
	private _label: string;
	public x?: number;
	public y?: number;
	public vx?: number;
	public vy?: number;

	public constructor(id: number | string, type: string, label: string) {
		this._id = id;
		this._type = type;
		this._label = label;
	}

	get label(): string {
		return this._label;
	}

	get type(): string {
		return this._type;
	}

	get id(): number | string {
		return this._id;
	}
}

export class Edge {
	private _id: string | number;
	private _source: Node;
	private _target: Node;
	private _weight: number;

	public constructor(id: number | string, source: Node, target: Node, weight: number) {
		this._id = id;
		this._source = source;
		this._target = target;
		this._weight = weight;
	}

	get id(): number | string {
		return this._id;
	}

	get source(): Node {
		return this._source;
	}

	get target(): Node {
		return this._target;
	}

	get weight(): number {
		return this._weight;
	}

	set source(source: Node) {
		this._source = source;
	}
	set target(target: Node) {
		this._target = target;
	}
}

/**
 * Static Graph, not Dynamic (yet)
 */
export class Graph {
	private _nodes: Array<Node>;
	private _edges: Array<Edge>;
	private _timestep: number;

	public constructor(nodes: Array<Node>, edges: Array<Edge>, timestep: number) {
		this._nodes = nodes;
		this._edges = edges;
		this._timestep = timestep;
	}

	get nodes(): Array<Node> {
		return this._nodes;
	}

	get edges(): Array<Edge> {
		return this._edges;
	}
	get timestep(): number {
		return this._timestep;
	}
}


export class DynamicGraph {
	private _timesteps: Array<Graph>;

	public constructor(timesteps: Array<Graph>) {
		this._timesteps = timesteps;
	}

	get timesteps(): Array<Graph> {
		return this._timesteps;
	}
}

