import { DGLOsSVGBaseClass } from "./DGLOsSVGBaseClass";
import { Selection } from "d3-selection";
import { Node, Edge } from "../model/dynamicgraph";



export class DGLOsSVG extends DGLOsSVGBaseClass {

	_nodeG: Selection<any, {}, any, {}>;
	_nodeGlyphs: Selection<any, {}, any, {}>;
	_edgeG: Selection<any, {}, any, {}>
	_edgeGlyphs: Selection<any, {}, any, {}>;
	_timeStamp: number = 0;



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
		this._edgeG = this.loc.append("g")
			.classed("edges", true);

		this._nodeGlyphs = this._edgeG.selectAll("line")
			.data(this.data.timesteps[this._timeStamp].edges, function (d: Edge): string { return d.source + ":" + d.target });

		//this._edgeGlyphs.exit().remove();

		let edgeEnter = this._edgeGlyphs.enter().append("line")
			.attr("id", function (d: Edge): string { return d.source + ":" + d.target })
			.attr("x1", 0)
			.attr("x2", 1)
			.attr("y1", 0)
			.attr("y2", 1)
			.attr("Stroke", "white");

		this._edgeGlyphs = this._edgeGlyphs.merge(edgeEnter);
	}


}