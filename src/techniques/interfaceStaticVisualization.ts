import * as d3 from "d3";
import { Selection } from "d3-selection";
import { Graph } from "./graph";

export interface Visualization {
	readonly graph: Graph;
	selection: Selection<any, {}, any, {}>;
	width?: number;
	height?: number;

	draw(graph: Graph): void;
}