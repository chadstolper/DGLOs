import { DGLOsSVGBaseClass } from "./DGLOsSVGBaseClass";
import { Selection } from "d3-selection";
import { Node } from "../model/dynamicgraph";



export class DGLOsSVG extends DGLOsSVGBaseClass {

	_nodeG: Selection<any, {}, any, {}>;
	_nodeGlyphs: Selection<any, {}, any, {}>;
	_timeStamp = this._data.timesteps[0].timestamp;

	public drawNodeGlyphs() {
		this._nodeG = this.loc.append("g")
			.classed("nodes", true);

		this._nodeGlyphs = this._nodeG.selectAll("circle")
			.data(this._data.timesteps[this._timeStamp].nodes, function (d: Node): string { return "" + d.id });

		this._nodeGlyphs.exit().remove();

		let nodeEnter = this._nodeGlyphs.enter().append("circle")
			.attr("id", function (d: any): string | number { return d.name; });

		this._nodeGlyphs = this._nodeGlyphs.merge(nodeEnter);

		//here for debugging
		this._nodeGlyphs
			.attr("fill", "purple")
			.attr("stroke", "grey")
			.attr("stroke-width", 3)
			.attr("r", 25);
	}

	public drawEdgeGlyphs() {
		//this.data.timestepshfeiowhf
	}

}