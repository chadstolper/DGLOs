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

	protected _rectGlyphShape = new RectGlyphShape();
	protected _gestaltGlyphShape = new GestaltGlyphShape();
	protected _stlineGlyphShape = new SourceTargetLineGlyphShape();

	public drawEdgeGlyphs() {

		this._currentEdgeShape = this._stlineGlyphShape;

		if (this._edgeG === undefined) {
			this._edgeG = this.loc.append("g").classed("edgeG", true);

			let edgeRectG: Selection<any, {}, any, {}> = this._rectGlyphShape.init(this._edgeG);
			let edgeGestaltG: Selection<any, {}, any, {}> = this._gestaltGlyphShape.init(this._edgeG);
			let edgeSTLineG: Selection<any, {}, any, {}> = this._stlineGlyphShape.init(this._edgeG);

			this._edgeGlyphs.set(this._rectGlyphShape, edgeRectG);
			this._edgeGlyphs.set(this._gestaltGlyphShape, edgeGestaltG);
			this._edgeGlyphs.set(this._stlineGlyphShape, edgeSTLineG);

			edgeRectG.style("display", "none");
			edgeGestaltG.style("display", "none");
			edgeSTLineG.style("display", "none");
		}

		this._currentEdgeShape.draw(this._location, this.data, 0, this._attrOpts);

	}

	public transformEdgeGlyphsTo(shape: EdgeGlyphShape) {
		switch (this._currentEdgeShape.shapeType) {
			case "Rect":
				this._currentEdgeShape.transformTo(this._edgeGlyphs.get(this._rectGlyphShape), shape, this._edgeGlyphs.get(shape));
				this._currentEdgeShape = shape;
				break;

			case "Gestalt":
				this._currentEdgeShape.transformTo(this._edgeGlyphs.get(this._gestaltGlyphShape), shape, this._edgeGlyphs.get(shape));
				this._currentEdgeShape = shape;
				break;

			case "STLine":
				this._currentEdgeShape.transformTo(this._edgeGlyphs.get(this._stlineGlyphShape), shape, this._edgeGlyphs.get(shape));
				this._currentEdgeShape = shape;
				break;

			default:
				console.log("Unreachable Code Reached. Dividing by 0 is now possible!");
				break;
		}
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
		if (this._currentEdgeShape.shapeType === "Rect") {
			this._edgeRectGlyphs.selectAll("rect")
				.attr("x", function (d: Edge) {
					return (+d.source.id / curGraph.nodes.length) * 100 + "%";
				})
				.attr("y", function (d: Edge) {
					return (+d.target.id / curGraph.nodes.length) * 100 + "%";
				})
		}

	}


}
