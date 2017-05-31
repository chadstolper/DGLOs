import { DynamicGraph } from "../model/DynamicGraph";
import { DGLOs } from "../lib/DGLOs";
import { Selection } from "d3-selection";

export abstract class Technique {
	protected _dynamicGraph: DynamicGraph;
	protected _location: Selection<any, {}, any, {}>;
	protected _library: DGLOs;
	protected _options: any;

	data(data: DynamicGraph): Technique { return this; }
	location(loc: Selection<any, {}, any, {}>): Technique { return this; };
	options(args: any): Technique { return this; };
	abstract draw(): Technique;

	get dynamicGraph(): DynamicGraph {
		return this._dynamicGraph;
	}

	set dynamicGraph(dgraph: DynamicGraph) {
		this.data(dgraph);
	}

	get loc(): Selection<any, {}, any, {}> {
		return this._location;
	}

	set loc(location: Selection<any, {}, any, {}>) {
		this.location(location);
	}

	protected get lib(): DGLOs {
		return this._library;
	}


}