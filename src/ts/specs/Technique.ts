import { DGLOs } from "../lib/DGLOs";

export abstract class Technique {
	//	protected _dynamicGraph: DynamicGraph;
	//protected _location: Selection<any, {}, any, {}>;
	protected _library: DGLOs;
	protected _options: any;

	abstract draw(): void;

	// public constructor(lib: DGLOs, data: DynamicGraph, loc: Selection<any, {}, any, {}>, opts: any) {
	public constructor(lib: DGLOs, opts: any) {
		this._library = lib;
		//this._dynamicGraph = data;
		//this._location = loc;
		this._options = opts;
	}

	// public get data(): DynamicGraph {
	// 	return this._dynamicGraph;
	// }

	// public get location(): Selection<any, {}, any, {}> {
	// 	return this._location;
	// }

	protected get lib(): DGLOs {
		return this._library;
	}

	protected get opts(): any {
		return this._options;
	}

}