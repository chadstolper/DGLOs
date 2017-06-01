import { DGLOsSVGBaseClass } from "./DGLOsSVGBaseClass";
import { Selection } from "d3-selection";
import { Node, Edge } from "../model/dynamicgraph";
import { DGLOsSVGCombined } from "./DGLOsSVGCombined";
import { DGLOsMatt } from "./DGLOsMatt";
import { NodeGlyphShape, EdgeGlyphShape } from "./DGLOs";
import { SVGAttrOpts } from "../lib/DGLOsSVG";
import * as shapes from "./ShapeClasses";
import * as d3 from "d3-selection";
import * as d3Scale from "d3-scale";
import * as d3Array from "d3-array";

export class DGLOsWill extends DGLOsMatt {
	public drawEdgeGlyphs() {
		this._edgeG = this.loc.append("g")
			.classed("edges", true);

		this._edgeGlyphs = this._edgeG.selectAll("line")
			.data(this.data.timesteps[this._timeStampIndex].edges, function (d: Edge): string { return d.source + ":" + d.target });

		this._edgeGlyphs.exit().remove();

		let edgeEnter = this._edgeGlyphs.enter().append("line")
			.attr("id", function (d: Edge): string { return d.source.id + ":" + d.target.id })
			.attr("x1", 0)
			.attr("x2", 1)
			.attr("y1", 0)
			.attr("y2", 1);

		this._edgeGlyphs = this._edgeGlyphs.merge(edgeEnter);
	}

	public transformEdgeGlyphsTo(shape: any) {
		this.transformEdgeGlyphsToRect();
	}

	private transformEdgeGlyphsToRect() {
		console.log("its a rect");
		let curGraph = this.data.timesteps[this._timeStampIndex];
		let arraySize = curGraph.nodes.length;

		this._edgeG = this.loc.append("g")
			.classed("rectEdges", true);

		this._edgeGlyphs = this._edgeG.selectAll("rect")
			.data(curGraph.edges, function (d: Edge): string { return d.source + ":" + d.target });

		this._edgeGlyphs.exit().remove();

		let cellsEnter = this._edgeGlyphs.enter()
			.append("rect")
			.attr("stroke", "black")
			.attr("width", 0)
			.attr("height", 0)
			.attr("id", function (d: Edge) { return d.id });

		this._edgeG = this._edgeG.merge(cellsEnter)
	}

	public setEdgeGlyphAttrs(attr: SVGAttrOpts) {
		//let color = this._colorScheme;
		console.log("you made it here");
		this._edgeGlyphs
			.attr("fill", attr.fill)
			.attr("height", attr.height)
			.attr("width", attr.width)
			.attr("stroke-width", attr.stroke_width)
			.attr("stroke", attr.stroke)
			.attr("radius", attr.radius)
			.attr("opacity", attr.opacity);

	}

}
