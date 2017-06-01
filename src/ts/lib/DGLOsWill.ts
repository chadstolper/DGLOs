import { DGLOsSVGBaseClass } from "./DGLOsSVGBaseClass";
import { Selection } from "d3-selection";
import { Node, Edge } from "../model/dynamicgraph";
import { DGLOsSVGCombined } from "./DGLOsSVGCombined";
import { DGLOsMatt } from "./DGLOsMatt";
import { NodeGlyphShape, EdgeGlyphShape } from "./DGLOs";
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
		//if (shape instanceof shapes.RectGlyphShape) {
		this.transformEdgeGlyphsToRect();
		//}
		//console.log("you dummy");
	}
	private transformEdgeGlyphsToRect() {
		console.log("its a rect");
		let curGraph = this.data.timesteps[super._timeStampIndex];


		let arraySize = curGraph.nodes.length;

		// let colorMap = d3Scale.scaleLinear<string>()
		// 	.domain(this.createColorDomain(curGraph.edges))
		// 	.range(this._colorDomain);

		this._edgeG = this.loc.append("g")
			.classed("edges", true);

		this._edgeGlyphs = this._edgeG.selectAll("line")
			.data(this.data.timesteps[this._timeStampIndex].edges, function (d: Edge): string { return d.source + ":" + d.target });

		this._edgeGlyphs.exit().remove();

		let cells = super.loc.selectAll("rect")
			.data(curGraph.edges, function (d: Edge): string { return "" + d.id; })

		cells.exit().remove();

		let cellsEnter = cells.enter()
			.append("rect")
			.attr("stroke", "black")
			.attr("id", function (d: Edge) { return d.id });

		cells = cells.merge(cellsEnter)
		cells.transition()
			.attr("x", function (d: Edge) {
				return (+d.source.id / curGraph.nodes.length) * 100 + "%";
			})
			.attr("y", function (d: Edge) {
				return (+d.target.id / curGraph.nodes.length) * 100 + "%";
			})
			.attr("width", this._width / arraySize)
			.attr("height", this._height / arraySize)
			.attr("fill", "red");

		// .attr("fill", function (d) {
		// 	return colorMap(d.weight);
		// })
	}

	private createColorDomain(edges: Array<Edge>) {
		return d3Array.extent(edges, function (d: Edge): number {
			return d.weight;
		});
	}



}


//import { ScaleOrdinal, scaleOrdinal, schemeCategory20b } from "d3-scale";
//import * as d3force from "d3-force";
//import { Simulation } from "d3-force";