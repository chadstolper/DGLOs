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

		this._edgeLineGlyphs = this._edgeG.selectAll("line")
			.data(this.data.timesteps[this._timeStampIndex].edges, function (d: Edge): string { return d.source + ":" + d.target });

		this._edgeLineGlyphs.exit().remove();

		let edgeLineEnter = this._edgeLineGlyphs.enter().append("line")
			.attr("id", function (d: Edge): string { return d.source.id + ":" + d.target.id })

		this._edgeLineGlyphs = this._edgeLineGlyphs.merge(edgeLineEnter);

		this._edgeRectGlyphs = this._edgeG.selectAll("rect")
			.data(this.data.timesteps[this._timeStampIndex].edges, function (d: Edge): string { return d.source + ":" + d.target });

		let edgeRectEnter = this._edgeRectGlyphs.enter().append("rect")
			.attr("id", function (d: Edge): string { return d.source.id + ":" + d.target.id })

		this._edgeRectGlyphs = this._edgeRectGlyphs.merge(edgeRectEnter);

		this._edgeGestaltGlyphs = this._edgeG.selectAll("gestalt")
			.data(this.data.timesteps[this._timeStampIndex].edges, function (d: Edge): string { return d.source + ":" + d.target });

		this._edgeLineGlyphs.exit().remove();

		let gestaltLineEnter = this._edgeLineGlyphs.enter().append("gestalt")
			.attr("id", function (d: Edge): string { return d.source.id + ":" + d.target.id })

		this._edgeGestaltGlyphs = this._edgeGestaltGlyphs.merge(gestaltLineEnter);

		this._currentEdgeShape = new shapes.SourceTargetLineGlyphShape(null, null, null, null, null, null, null, null)
	}

	public transformEdgeGlyphsTo(shape: any) {
		switch (this._currentEdgeShape.shapeType) {
			case "Rect":
				console.log("current shape is a rect!");
				console.log("changing to " + shape.shapeType);
				switch (shape.shapeType) {
					case "STLine":
						this.transformRectToLines();
						break;
					case "Gestalt":
						this.transformRectToGestalt();
						break;
					default:
						console.log("Your shape has not been implemented");
						break;
				}
				break;
			case "STLine":
				console.log("current shape is a STLine!");
				console.log("changing to " + shape.shapeType);
				switch (shape.shapeType) {
					case "Rect":
						this.transformLinesToRect();
						break;
					case "Gestalt":
						this.transformLinesToGestalt();
						break;
					default:
						console.log("Your shape has not been implemented");
						break;
				}
				break;
			case "Gestalt":
				console.log("current shape is a Gestalt!");
				console.log("changing to " + shape.shapeType);
				switch (shape.shapeType) {
					case "Rect":
						this.transformGestaltToRect();
						break;
					case "STLine":
						this.transformGestaltToLines();
						break;
					default:
						console.log("Your shape has not been implemented");
						break;

				}
			default:
				break;
		}
		//this.transformLinesToRect();
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
		this._currentEdgeShape = new shapes.SourceTargetLineGlyphShape(null, null, null, null, null, null, null, null);
	}
	private transformGestaltToLines() {
		this._edgeGestaltGlyphs   //.transition()
			.style("display", "none");
		this._edgeLineGlyphs   //.transition()
			.style("display", null);
		this._currentEdgeShape = new shapes.SourceTargetLineGlyphShape(null, null, null, null, null, null, null, null);
	}
	private transformGestaltToRect() {
		this._edgeGestaltGlyphs   //.transition()
			.style("display", "none");
		this._edgeRectGlyphs   //.transition()
			.style("display", null);
		this._currentEdgeShape = new shapes.RectGlyphShape(null, null, null);
	}
	private transformLinesToGestalt() {
		this._edgeLineGlyphs   //.transition()
			.style("display", "none");
		this._edgeGestaltGlyphs   //.transition()
			.style("display", null);
		this._currentEdgeShape = new shapes.GestaltGlyphShape(null, null, null, null, null, null, null, null, null, null);
	}
	private transformRectToGestalt() {
		this._edgeRectGlyphs   //.transition()
			.style("display", "none");
		this._edgeGestaltGlyphs   //.transition()
			.style("display", null);
		this._currentEdgeShape = new shapes.GestaltGlyphShape(null, null, null, null, null, null, null, null, null, null);
	}
	private transformLinesToRect() {
		this._edgeLineGlyphs   //.transition()
			.style("display", "none");
		this._edgeRectGlyphs   //.transition()
			.style("display", null);

		this._currentEdgeShape = new shapes.RectGlyphShape(null, null, null);
	}

}
