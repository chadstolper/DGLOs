import { SimulationNodeDatum } from "d3-force";

export class Node implements SimulationNodeDatum {
	private _id: string | number;
	private _index: number;
	private _type: string;
	private _label: string;
	private _wordHeight: number;
	private _wordLength: number;
	public x?: number;
	public y?: number;
	public vx?: number;
	public vy?: number;
	public _fx?: number;
	public _fy?: number;
	private readonly _origID: string | number;
	private readonly _timestamp: number;
	private _isEnter: boolean;
	private _isExit: boolean;

	public constructor(id: number | string, index: number, type: string, label: string, timestamp: number) {
		this._id = id;
		this._index = index;
		this._type = type;
		this._label = label;
		this._origID = id;
		this._timestamp = timestamp;
	}

	get wordLength(): number {
		return this._wordLength
	}
	set wordLength(length: number) {
		this._wordLength = length;
	}
	get wordHeight(): number {
		return this._wordHeight;
	}
	set wordHeight(height: number) {
		this._wordHeight = height;
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
	set isEnter(v: boolean) {
		this._isEnter = v;
	}
	get isEnter(): boolean {
		return this._isEnter;
	}
	set isExit(v: boolean) {
		this._isExit = v;
	}
	get isExit(): boolean {
		return this._isExit;
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
	private readonly _timestep: number;
	private _isEnter: boolean;
	private _isExit: boolean;
	public constructor(id: number | string, source: Node, target: Node, weight: number, timestamp: number) {
		this._id = id;
		this._source = source;
		this._target = target;
		this._weight = weight;
		this._origSource = source;
		this._origTarget = target;
		this._timestep = timestamp;
	}
	get timestep(): number {
		return this._timestep;
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
	set isEnter(v: boolean) {
		this._isEnter = v;
	}
	get isEnter(): boolean {
		return this._isEnter;
	}
	set isExit(v: boolean) {
		this._isExit = v;
	}
	get isExit(): boolean {
		return this._isExit;
	}
}

/**
 * Static Graph, not Dynamic.
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

/**
 * Object containing the whole of Node data for simulation.
 * Nodes held in Set<Node>.
 */
export class MetaNode implements SimulationNodeDatum {
	private readonly _origID: number | string;
	private _id: string | number;
	private _nodes: Set<Node> = new Set<Node>();
	private _x?: number;
	private _y?: number;
	private _vx?: number;
	private _vy?: number;
	private _fx?: number;
	private _fy?: number;

	constructor(id: number | string) {
		this._origID = this._id = id;
	}

	get id(): string | number {
		return this._id;
	}

	get origID(): number | string {
		return this._origID;
	}

	get nodes(): Set<Node> {
		return this._nodes;
	}

	public add(data: Node) {
		this._nodes.add(data);
	}

	set x(num: number) {
		this._nodes.forEach(function (n: Node) {
			n.x = num;
		});
		this._x = num;
	}
	get x(): number {
		return this._x;
	}
	set y(num: number) {
		this._nodes.forEach(function (n: Node) {
			n.y = num;
		});
		this._y = num;
	}
	get y(): number {
		return this._y;
	}
	set vx(num: number) {
		this._vx = num;
	}
	get vx(): number {
		return this._vx;
	}
	set vy(num: number) {
		this._vy = num;
	}
	get vy(): number {
		return this._vy;
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
/**
 * the key for an edge is e.origSource.origID + ":::" + e.origTarget.origID
 */
export class DynamicGraphMetaEdgeMap extends Map<string, MetaEdge>{
	private _metaNodes: Map<string | number, MetaNode>;

	constructor(metaNodes: Map<string | number, MetaNode>) {
		super();
		this._metaNodes = metaNodes;
	}

	public add(e: Edge) {
		let key = e.origSource.origID + ":::" + e.origTarget.origID;
		if (!this.has(key)) {
			this.set(key, new MetaEdge(key, this._metaNodes.get(e.source.origID), this._metaNodes.get(e.target.origID)));
		}
		this.get(key).add(e);
	}
}

/**
 * Object containing the whole of Edge data for simulation.
 * Edge data held in Set<Edge>.
 */
export class MetaEdge {
	private _id: string;
	private _edges: Set<Edge> = new Set<Edge>();
	private _totalWeight: number = 0;
	private _source: MetaNode;
	private _target: MetaNode;
	public x?: number;
	public y?: number;

	constructor(id: string, source: MetaNode, target: MetaNode) {
		this._source = source;
		this._target = target; this._id = id;
	}

	get id(): string {
		return this._id;
	}

	public add(data: Edge) {
		this._edges.add(data);
		this._totalWeight += data.weight;
	}

	/**
	 * Average weight of this edge across all timesteps
	 */
	get weight(): number {
		return this._totalWeight / this._edges.size;
	}

	get edges(): Set<Edge> {
		return this._edges;
	}

	get source(): MetaNode {
		return this._source;
	}

	get target(): MetaNode {
		return this._target;
	}

	set source(source: MetaNode) {
		this._source = source;
	}
	set target(target: MetaNode) {
		this._target = target;
	}

}
/**
 * Graph with timesteps of data. MetaNodes and Edges is instance of data at all timesteps.
 * Meta Map Key: origID, v: MetaNode/MetaEdge
 */
export class DynamicGraph {
	private _timesteps: Array<Graph>;
	private _metaNodes: Map<string | number, MetaNode> = new Map<string | number, MetaNode>();
	private _metaEdges: DynamicGraphMetaEdgeMap;

	public constructor(timesteps: Array<Graph>, onClickRedraw?: boolean) {
		this._metaEdges = new DynamicGraphMetaEdgeMap(this._metaNodes);
		this._timesteps = timesteps;
		for (let g of timesteps) {
			for (let n of g.nodes) {
				if (!this._metaNodes.has(n.origID)) {
					this._metaNodes.set(n.origID, new MetaNode(n.origID));
				}
				this._metaNodes.get(n.origID).add(n);
			}
			for (let e of g.edges) {
				this._metaEdges.add(e);
			}
		}
		//Assign enter and exit attributes to Nodes
		if (this.timesteps.length > 1) {
			for (let timeStep = 0; timeStep < this.timesteps.length; timeStep++) {
				if (timeStep === 0) {
					for (let n1 of this.timesteps[0].nodes) {
						for (let n2 of this.timesteps[timeStep + 1].nodes) {
							if (n1.origID === n2.origID) //present in next step
							{
								n1.isExit = false;
								n2.isEnter = false;
								break;
							}
							else {
								n1.isExit = true;
								n2.isEnter = true;
							}
						}
						n1.isEnter = true;
					}
				}
				if (timeStep === this.timesteps.length - 1) {
					for (let n1 of this.timesteps[timeStep].nodes) {
						for (let n3 of this.timesteps[timeStep - 1].nodes) {
							if (n1.origID === n3.origID) { //present in previous step
								n1.isEnter = false;
								break;
							}
							else {
								n1.isEnter = true;
							}
						}
						n1.isExit = true;
					}
				}
				if (timeStep !== 0 && timeStep !== this.timesteps.length - 1) {
					for (let n1 of this.timesteps[timeStep].nodes) {
						for (let n2 of this.timesteps[timeStep + 1].nodes) {
							if (n1.origID === n2.origID) { //present in next step
								n1.isExit = false;
								break;
							}
							else {
								n1.isExit = true;
							}
						}
						for (let n3 of this.timesteps[timeStep - 1].nodes) {
							if (n1.origID === n3.origID) { //present in previous step
								n1.isEnter = false;
								break;
							}
							else {
								n1.isEnter = true;
							}
						}
					}
				}
			}
		}
		else {
			for (let n of this.timesteps[0].nodes) {
				n.isEnter = true;
				n.isExit = true;
			}
		}
	}
	get timesteps(): Array<Graph> {
		return this._timesteps;
	}

	get metaNodes(): Map<string | number, MetaNode> {
		return this._metaNodes;
	}
	/**
	 * Converts MetaNode Set<Node> to Array<MetaNode>.
	 * Returns MetaNode[].
	 */
	get metaNodesAsArray(): Array<MetaNode> {
		return Array.from(this.metaNodes.values());
	}
	/**
	 * Converts MetaEdge Set<Edge> to Array<MetaEdge>.
	 * Returns MetaEdge[].
	 */
	get metaEdgesAsArray(): Array<MetaEdge> {
		return Array.from(this.metaEdges.values());
	}

	get metaEdges(): DynamicGraphMetaEdgeMap {
		return this._metaEdges;
	}
}

