import * as d3 from "d3";
import { Selection } from "d3-selection";
import { DynamicGraph, Graph } from "./graph";

export interface Visualization {
	readonly _dynamicGraph: DynamicGraph;
	_selection: Selection<any, {}, any, {}>;
	_width?: number;
	_height?: number;

	draw(graph: Graph): void;

	constructor(dgraph: DynamicGraph, div: Selection<any, {}, any, {}>): Visualization;
	//common varibles
	//a dgraph
	//a ? sgraph
	//common functions
	//constructors, drawers()
}