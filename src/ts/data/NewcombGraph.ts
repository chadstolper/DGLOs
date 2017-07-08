
import { Graph, DynamicGraph, Node, Edge } from "../model/DynamicGraph";

export class NewcombStudent extends Node {
	public constructor(n: number, timestamp: number) {
		super(n, n, "NewcombStudent", "" + n, timestamp);
	}
}

export class Ranking extends Edge {
	private _rank: number;

	public constructor(numStudents: number, source: Node, target: Node, rank: number, timestamp: number) {
		super(source.id + ":" + target.id, source, target, numStudents - rank, timestamp);
		this._rank = +rank;
	}

	get rank(): number {
		return this._rank;
	}
}

export class StaticNewcombGraph extends Graph {
	public constructor(rawNodeData: Array<any>, rawEdgeData: Array<any>, timestamp: number) {
		const nodeData: Array<NewcombStudent> = new Array<NewcombStudent>();
		const edgeData: Array<Ranking> = new Array<Ranking>();

		for (const n of rawNodeData) {
			const student: NewcombStudent = new NewcombStudent(n, timestamp);
			nodeData.push(student);
		}

		for (const e of rawEdgeData) {
			const source: NewcombStudent = nodeData[+e.ranker]
			const target: NewcombStudent = nodeData[+e.rankee]
			if (e.ranker !== e.rankee) {
				const ranking: Ranking = new Ranking(nodeData.length, source, target, e.rank, timestamp);
				edgeData.push(ranking);
			}
		}

		super(nodeData, edgeData, timestamp);
	}
}

export class StaticNewcombTopFiveGraph extends Graph {

	public constructor(rawNodeData: Array<any>, rawEdgeData: Array<any>, timestamp: number) {
		const rankLimiter: number = 5;
		const nodeData: Array<NewcombStudent> = new Array<NewcombStudent>();
		const edgeData: Array<Ranking> = new Array<Ranking>();

		for (const n of rawNodeData) {
			const student: NewcombStudent = new NewcombStudent(n, timestamp);
			nodeData.push(student);
		}

		for (const e of rawEdgeData) {
			e.rank = +e.rank;
			const source: NewcombStudent = nodeData[+e.ranker]
			const target: NewcombStudent = nodeData[+e.rankee]
			if (e.ranker !== e.rankee && e.rank <= rankLimiter) {
				const ranking: Ranking = new Ranking(nodeData.length, source, target, e.rank, timestamp);
				edgeData.push(ranking);
			}
		}

		super(nodeData, edgeData, timestamp);
	}
}

export class DynamicNewcombGraph extends DynamicGraph {
	public constructor(response: Array<any>) {
		const graphs: Array<StaticNewcombGraph> = new Array<StaticNewcombGraph>();
		for (const timestep of response) {
			const rawNodeData: Array<any> = timestep.nodes;
			const rawEdgeData: Array<any> = timestep.edges;
			const timestamp: number = timestep.timestamp;
			const g: StaticNewcombGraph = new StaticNewcombGraph(rawNodeData, rawEdgeData, timestamp);
			graphs.push(g);
		}
		super(graphs);
	}
}

export class DynamicNewcombTopFiveGraph extends DynamicGraph {
	public constructor(response: Array<any>) {
		const graphs: Array<StaticNewcombGraph> = new Array<StaticNewcombGraph>();
		for (const timestep of response) {
			const rawNodeData: Array<any> = timestep.nodes;
			const rawEdgeData: Array<any> = timestep.edges;
			const timestamp: number = timestep.timestamp;
			const g: StaticNewcombGraph = new StaticNewcombTopFiveGraph(rawNodeData, rawEdgeData, timestamp);
			graphs.push(g);
		}
		super(graphs);
	}
}