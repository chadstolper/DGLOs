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
			.attr("stroke", "red")
			.attr("text", function (d: Node) {
				return d.id;
			})
			.attr("font", "Verdana")
			.attr("Font-Size", 20);
	}
	private transformGestaltToLines() {
		console.log("transfromGestaltToLines not yet implemented :)");
	}
	private transformGestaltToRect() {
		console.log("transfromGestaltToRect not yet implemented :)");
	}
	private transformLinesToGestalt() {
		console.log("transfromLinesToGestalt not yet implemented :)");
	}
	private transformRectToGestalt() {
		console.log("transfromRectToGestalt not yet implemented :)");
	}
	private transformLinesToRect() {
		let curGraph = this.data.timesteps[this._timeStampIndex];
		let arraySize = curGraph.nodes.length;

		// this._edgeLineGlyphs.style("display","hidden");
		// this._edgeRectGlyphs.style("display",null);

		this._edgeGlyphs = this._edgeG.selectAll("rect")
			.data(curGraph.edges, function (d: Edge): string { return d.source + ":" + d.target });

		this._edgeGlyphs.exit().remove();

		let cellsEnter = this._edgeGlyphs.enter()
			.append("rect")
		this._edgeGlyphs = this._edgeGlyphs.merge(cellsEnter)
	}
	public positionEdgeGlyphsMatrix() {
		let curGraph = this._data.timesteps[this._timeStampIndex];
		this._edgeGlyphs
			.attr("x", function (d: Edge) {
				return (+d.source.id / curGraph.nodes.length) * 100 + "%";
			})
			.attr("y", function (d: Edge) {
				return (+d.target.id / curGraph.nodes.length) * 100 + "%";
			})
	}
	public transformRectToLines() {
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

}