import { DGLOsSVGBaseClass } from "./DGLOsSVGBaseClass";
import { Selection } from "d3-selection";
import { Node, Edge } from "../model/dynamicgraph";



export class DGLOsSVG extends DGLOsSVGBaseClass {

	_nodeG: Selection<any, {}, any, {}>;
	_nodeGlyphs: Selection<any, {}, any, {}>;
<<<<<<< HEAD
	_timeStamp = this._data.timesteps[0].timestamp;
=======
	_edgeG: Selection<any, {}, any, {}>
	_edgeGlyphs: Selection<any, {}, any, {}>;
	_timeStamp: number;
>>>>>>> 31cf744f1df286fac0f53d223198eb0e300de768

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
	}

}