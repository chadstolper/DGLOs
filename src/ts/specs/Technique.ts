import { DynamicGraph } from "../model/DynamicGraph";
import { DGLOs } from "../lib/DGLOs";
import { Selection } from "d3-selection";

export abstract class Technique {
	protected _dynamicGraph: DynamicGraph;
	protected _location: Selection<any, {}, any, {}>;
	protected _library: DGLOs;
	protected _options: any;

	abstract draw(): void;

	public constructor(data: DynamicGraph, loc: Selection<any, {}, any, {}>, opts: any) {
		this._dynamicGraph = data;
		this._location = loc;
		this._options = opts;
	}

	public get data(): DynamicGraph {
		return this._dynamicGraph;
	}

	public get location(): Selection<any, {}, any, {}> {
		return this._location;
	}

	protected get lib(): DGLOs {
		return this._library;
	}

	protected get opts(): any {
		return this._options;
	}

}