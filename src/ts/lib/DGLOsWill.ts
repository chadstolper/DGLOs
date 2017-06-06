import { DGLOsSVGBaseClass } from "./DGLOsSVGBaseClass";
import { Selection } from "d3-selection";
import { Node, Edge } from "../model/dynamicgraph";
import { DGLOsSVGCombined } from "./DGLOsSVGCombined";
import { DGLOsMatt } from "./DGLOsMatt";
import { NodeGlyphShape } from "./NodeGlyphInterface"
import { EdgeGlyphShape } from "./EdgeGlyphInterface";
import { SVGAttrOpts } from "../lib/DGLOsSVG";

import { RectGlyphShape } from "./shapes/RectGlyphShape";
import { CircleGlyphShape } from "./shapes/CircleGlyphShape";
import { LabelGlyphShape } from "./shapes/LabelGlyphShape";
import { SourceTargetLineGlyphShape } from "./shapes/SourceTargetLineGlyphShape";
import { GestaltGlyphShape } from "./shapes/GestaltGlyphShape";

import * as d3 from "d3-selection";
import * as d3Scale from "d3-scale";
import * as d3Array from "d3-array";

export class DGLOsWill extends DGLOsMatt {

	protected _rectGlyphShape = new RectGlyphShape(null, null, null, null);
	public drawEdgeGlyphs() {

		this._currentEdgeShape = this._rectGlyphShape;

		if (this._edgeG === undefined) {
			this._edgeG = this.loc.append("g").classed("edgeG", true);

			let edgeRectG: Selection<any, {}, any, {}> = this._rectGlyphShape.init(this._edgeG);
			this._edgeGlyphs.set(this._rectGlyphShape, edgeRectG);

			edgeRectG.style("display", "none");

		}

		// this._currentEdgeShape = new shapes.SourceTargetLineGlyphShape(null, null, null, null, null, null);
		// this._currentEdgeShape.draw(this._location, this._data, 0);
	}

	public transformEdgeGlyphsTo(shape: EdgeGlyphShape) {

		this._currentEdgeShape.transformTo(this._edgeGlyphs.get(this._currentEdgeShape), shape, this._edgeGlyphs.get(shape));
	}
	//TODO
	public positionNodeGlyphsMatrix() {
		let curGraph = this.data.timesteps[this._timeStampIndex];
		this._nodeLabelGlyphs
			.attr("x", function (d: Node) {
				return (+d.id / curGraph.nodes.length) * 100 + "%";
			})
			.attr("y", function (d: Edge) {
				return (+d.id / curGraph.nodes.length) * 100 + "%";
			})
	}
	public positionEdgeGlyphsMatrix() {
		let curGraph = this._data.timesteps[this._timeStampIndex];
		if (this._currentEdgeShape.shapeType === "STLine") {
			this.transformLinesToRect();
			this._edgeRectGlyphs
				.attr("x", function (d: Edge) {
					return (+d.source.id / curGraph.nodes.length) * 100 + "%";
				})
				.attr("y", function (d: Edge) {
					return (+d.target.id / curGraph.nodes.length) * 100 + "%";
				})
		}
		if (this._currentEdgeShape.shapeType === "Rect") {
			this._edgeRectGlyphs
				.attr("x", function (d: Edge) {
					return (+d.source.id / curGraph.nodes.length) * 100 + "%";
				})
				.attr("y", function (d: Edge) {
					return (+d.target.id / curGraph.nodes.length) * 100 + "%";
				})
		}
		if (this._currentEdgeShape.shapeType === "Gestalt") {
			this.transformGestaltToRect();
			this._edgeRectGlyphs
				.attr("x", function (d: Edge) {
					return (+d.source.id / curGraph.nodes.length) * 100 + "%";
				})
				.attr("y", function (d: Edge) {
					return (+d.target.id / curGraph.nodes.length) * 100 + "%";
				})
		}
	}
	public transformRectToLines() {
		this._edgeRectGlyphs.transition()
			.style("display", "none");
		this._edgeLineGlyphs.transition()
			.style("display", null);
		this._currentEdgeShape = new SourceTargetLineGlyphShape(null, null, null, null, null, null, null, null);
	}
	private transformGestaltToLines() {
		this._edgeGestaltGlyphs   //.transition()
			.style("display", "none");
		this._edgeLineGlyphs   //.transition()
			.style("display", null);
		this._currentEdgeShape = new SourceTargetLineGlyphShape(null, null, null, null, null, null, null, null);
	}
	private transformGestaltToRect() {
		this._edgeGestaltGlyphs   //.transition()
			.style("display", "none");
		this._edgeRectGlyphs   //.transition()
			.style("display", null);
		this._currentEdgeShape = new RectGlyphShape(null, null, null, null);
	}
	private transformLinesToGestalt() {
		this._edgeLineGlyphs   //.transition()
			.style("display", "none");
		this._edgeGestaltGlyphs   //.transition()
			.style("display", null);
		this._currentEdgeShape = new GestaltGlyphShape(null, null, null, null, null, null, null, null, null, null);
	}
	private transformRectToGestalt() {
		this._edgeRectGlyphs   //.transition()
			.style("display", "none");
		this._edgeGestaltGlyphs   //.transition()
			.style("display", null);
		this._currentEdgeShape = new GestaltGlyphShape(null, null, null, null, null, null, null, null, null, null);
	}
	private transformLinesToRect() {
		this._edgeLineGlyphs   //.transition()
			.style("display", "none");
		this._edgeRectGlyphs   //.transition()
			.style("display", null);

		this._currentEdgeShape = new RectGlyphShape(null, null, null, null);
	}

}
