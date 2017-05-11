

export class Node {
	private _id: number;
	private _type: string;
	constructor(id:number, type:string){
		this._id = id;
	}

	get type(): string{
		return this._type;
	}
}

export class Edge {
	private _source: Node;
	private _target: Node;
	constructor(id:number, source:Node, target:Node){
		
	}
}


export class Graph {
	private _nodes: Array<Node>;
	private _edges: Array<Edge>;

	constructor(nodes:Array<Node>, edges:Array<Edge>){
		this._nodes = nodes;
		this._edges = edges;
	}

	get nodes(): Array<Node>{
		return this._nodes;
	}

	get edges(): Array<Edge>{
		return this._edges;
	}
}


