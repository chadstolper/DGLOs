import { SimulationNodeDatum } from "d3-force";

export class Node implements SimulationNodeDatum {
	private _id: string | number;
	private _index: number;
	private _type: string;
	private _label: string;
	public x?: number;
	public y?: number;
	public vx?: number;
	public vy?: number;
	public _fx?: number;
	public _fy?: number;
	private readonly _origID: string | number;
	private readonly _timestamp: number;

	public constructor(id: number | string, index: number, type: string, label: string, timestamp: number) {
		this._id = id;
		this._index = index;
		this._type = type;
		this._label = label;
		this._origID = id;
		this._timestamp = timestamp;
	}

	get origID(): string | number {
		return this._origID;
	}


	get timestamp(): number {
		return this._timestamp;
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
	set id(id: string | number) {
		this._id = id;
	}

	get index(): number {
		return this._index;
	}

	set index(index: number) {
		this._index = index;
	}

	set fx(num: number) {
		this._fx = num;
	}
	get fx(): number {
		return this._fx;
	}
	set fy(num: number) {
		this._fy = num;
	}
	get fy(): number {
		return this._fy;
	}
}

export class Edge {
	private _id: string | number;
	private _source: Node;
	private _target: Node;
	private _weight: number;
	private _x?: number;
	private _y?: number;
	private readonly _origSource: Node;
	private readonly _origTarget: Node;
	public constructor(id: number | string, source: Node, target: Node, weight: number, timestamp: number) {
		this._id = id;
		this._source = source;
		this._target = target;
		this._weight = weight;
		this._origSource = source;
		this._origTarget = target;
	}

	get origSource(): Node {
		return this._origSource;
	}

	get origTarget(): Node {
		return this._origTarget;
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

	get x(): number {
		return this._x;
	}
	set x(newX: number) {
		this._x = newX;
	}

	get y(): number {
		return this._y;
	}
	set y(newY: number) {
		this._y = newY;
	}


}

/**
 * Static Graph, not Dynamic (yet)
 */
export class Graph {
	private _nodes: Array<Node>;
	private _edges: Array<Edge>;
	private _timestamp: number;

	public constructor(nodes: Array<Node>, edges: Array<Edge>, timestamp: number) {
		this._nodes = nodes;
		this._edges = edges;
		this._timestamp = timestamp;
	}

	get nodes(): Array<Node> {
		return this._nodes;
	}

	get edges(): Array<Edge> {
		return this._edges;
	}
	get timestamp(): number {
		return this._timestamp;
	}
}

export class MetaNode {
	readonly _origID: number | string;
	private _nodes: Set<Node> = new Set<Node>();
	public x?: number;
	public y?: number;
	public vx?: number;
	public vy?: number;
	public _fx?: number;
	public _fy?: number;

	constructor(id: number | string) {
		this._origID = id;
	}

	get origID(): number | string {
		return this._origID;
	}

	public add(data: Node) {
		this._nodes.add(data);
	}
}

export class MetaEdge {
	readonly _origID: [Node, Node];
	private _metaEdges: Set<Edge> = new Set<Edge>();
	public x?: number;
	public y?: number;

	constructor(id: [Node, Node]) {
		this._origID = id;
	}

	get origID(): [Node, Node] {
		return this._origID;
	}

	public add(data: Edge) {
		this._metaEdges.add(data);
	}

}

export class DynamicGraph {
	private _timesteps: Array<Graph>;
	private _metaNodes: Map<string | number, MetaNode> = new Map<string | number, MetaNode>();
	private _metaEdges: Map<[Node, Node], MetaEdge> = new Map<[Node, Node], MetaEdge>();

	public constructor(timesteps: Array<Graph>) {
		this._timesteps = timesteps;
		for (let g of timesteps) {
			for (let n of g.nodes) {
				if (!this._metaNodes.has(n.origID)) {
					this._metaNodes.set(n.origID, new MetaNode(n.origID));
				}
				this._metaNodes.get(n._origID).add(n);
			}
			for (let e of g.edges) {
				if (!this._metaEdges.has([e.origSource, e.origTarget])) {
					console.log(e.origSource, e.origTarget)
					this._metaEdges.set([e.origSource, e.origTarget], new MetaEdge([e.origSource, e.origTarget]));
					console.log(this.metaEdges.get([e.origSource, e.origTarget]))
				}
				console.log(e.origSource, e.origTarget)
				console.log(this.metaEdges.get([e.origSource, e.origTarget]))
				this._metaEdges.get([e.origSource, e.origTarget]).add(e)
			}
		}
	}

	get timesteps(): Array<Graph> {
		return this._timesteps;
	}

	get metaNodes(): Map<string | number, MetaNode> {
		return this._metaNodes;
	}

	get metaEdges(): Map<[Node, Node], MetaEdge> {
		return this._metaEdges;
	}
}

