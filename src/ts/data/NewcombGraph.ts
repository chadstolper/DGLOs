
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
		this._rank = rank;
	}

	get rank(): number {
		return this._rank;
	}
}

export class StaticNewcombGraph extends Graph {
	public constructor(rawNodeData: Array<any>, rawEdgeData: Array<any>, timestamp: number) {
		let nodeData = new Array<NewcombStudent>();
		let edgeData = new Array<Ranking>();

		for (let n of rawNodeData) {
			let student = new NewcombStudent(n, timestamp);
			nodeData.push(student);
		}

		for (let e of rawEdgeData) {
			let source = nodeData[+e.ranker]
			let target = nodeData[+e.rankee]
			if (e.ranker !== e.rankee) {
				let ranking = new Ranking(nodeData.length, source, target, e.rank, timestamp);
				edgeData.push(ranking);
			}
		}

		super(nodeData, edgeData, timestamp);
	}
}

export class DynamicNewcombGraph extends DynamicGraph {
	public constructor(response: Array<any>) {
		let graphs: Array<StaticNewcombGraph> = new Array<StaticNewcombGraph>();
		for (let timestep of response) {
			let rawNodeData: Array<any> = timestep.nodes;
			let rawEdgeData: Array<any> = timestep.edges;
			let timestamp: number = timestep.timestamp;
			let g: StaticNewcombGraph = new StaticNewcombGraph(rawNodeData, rawEdgeData, timestamp);
			graphs.push(g);
		}
		super(graphs);
	}
}