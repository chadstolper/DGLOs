import { DGLOsSVGBaseClass } from "./DGLOsSVGBaseClass";
import { Selection } from "d3-selection";
import { Node, Edge, Graph } from "../model/dynamicgraph";
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

	/**
	 * drawEdgeGlyphs is a DGLO responsible drawing edge glyphs. It creates the <g> tags
	 * that hold all of the glyphs (e.g. edgeRectG, edgeGestaltG, and edgeSTLineG). It then
	 * maps each of the shapeType objects to their respective <g> tag, thus linking the two.
	 * It hides all of the edge groups and then draws the currentEdgeShape.
	 */
	public drawEdgeGlyphs() {
		this._currentEdgeShape = this.rectShape;

		if (this._edgeG === undefined) {
			this._edgeG = this.loc.append("g").classed("edgeG", true);

			let edgeRectG: Selection<any, {}, any, {}> = this.rectShape.init(this._edgeG);
			let edgeGestaltG: Selection<any, {}, any, {}> = this.gestaltShape.init(this._edgeG);
			let edgeSTLineG: Selection<any, {}, any, {}> = this.sourceTargetLineShape.init(this._edgeG);

			this._edgeGlyphMap.set(this.rectShape, edgeRectG);
			this._edgeGlyphMap.set(this.gestaltShape, edgeGestaltG);
			this._edgeGlyphMap.set(this.sourceTargetLineShape, edgeSTLineG);

			edgeRectG.style("display", "none");
			edgeGestaltG.style("display", "none");
			edgeSTLineG.style("display", "none");
		}
		// this._currentEdgeShape.draw(this._edgeGlyphs.get(this.rectShape), this.data, 0, this._edgeAttrOpts);
	}
	/**
	 * setEdgeGlyphAtters is used to set the _edgeAttrOpts SVGAttrOpts object. This objecy
	 * determines the attributes that are used when drawing edges (e.g. color, thickness, etc..). 
	 * @param attr 
	 */
	public setEdgeGlyphAttrs(attr: SVGAttrOpts) {
		this._edgeAttrOpts = attr;
	}

	/**
	 * tansformEdgeGlyphsTo is a DGLO method that calls the ___ _currentEdgeShape ___ transformTo method.
	 * It takes an __ EdgeGlyphShape __ in order to know what shape to transfrom th edge glyphs to.
	 */
	public transformEdgeGlyphsTo(shape: EdgeGlyphShape) {
		this._currentEdgeShape.transformTo(this._edgeGlyphMap.get(this._currentEdgeShape), shape, this._edgeGlyphMap.get(shape));
	}
	//TODO
	public positionNodeGlyphsMatrix() {
		let curGraph = this.data.timesteps[this._timeStampIndex];
		console.log(this._currentNodeShape);
		console.log(this._nodeGlyphMap.get(this._currentNodeShape));
		let h = this._height;
		let w = this._width;
		this.data.timesteps.forEach(function (g: Graph) {
			g.nodes.forEach(function (d: Node) {
				d.x = w / 10;
				d.y = d.index / curGraph.nodes.length * h;
			})
		})
		this._currentNodeShape.draw(this._nodeGlyphMap.get(this._currentNodeShape), this.data, this._timeStampIndex, this._attrOpts);

		// this._nodeGlyphMap.get(this._currentNodeShape)
		// 	.attr("x", 10)
		// 	.attr("y", function (d: Node) {
		// 		return (d.index / curGraph.nodes.length) * 100 + "%";
		// 	})
		// function (d: Node) {
		// 	return (+d.index / curGraph.nodes.length) * 100 + "%";
		// })
	}


	/**
	 * positionEdgeGlyphsMatrix transforms edges to rectangles using the transfromEdgeGlyphsTo
	 * DGLO, and then positions the rectangles to form a matrix (heatmap).
	 */
	public positionEdgeGlyphsMatrix() {
		let h = this._height;
		let w = this._width;
		this.data.timesteps.forEach(function (g: Graph) {
			g.edges.forEach(function (e: Edge) {
				e.x = (+e.source.index / g.nodes.length) * w;
				e.y = (+e.target.index / g.nodes.length) * h;
			})
		})
		let _matrixAttrOpts = new SVGAttrOpts(this._edgeAttrOpts.fill, this._edgeAttrOpts.stroke, null, this._edgeAttrOpts.stroke_width,
			this._width / (this.data.timesteps[this._timeStampIndex].nodes.length - 1), this._height / (this.data.timesteps[this._timeStampIndex].nodes.length - 1),
			this._edgeAttrOpts.opacity)
		this._currentEdgeShape.draw(this._edgeGlyphMap.get(this._currentEdgeShape), this.data, this._timeStampIndex, _matrixAttrOpts);
	}


}
