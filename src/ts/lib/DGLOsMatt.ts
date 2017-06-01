import { DGLOsSVGBaseClass } from "./DGLOsSVGBaseClass";
import { Selection } from "d3-selection";
import { Node, Edge } from "../model/dynamicgraph";
import { ScaleOrdinal, scaleOrdinal, schemeCategory20 } from "d3-scale";
import * as d3force from "d3-force";
import { Simulation } from "d3-force";
import { NodeGlyphShape, EdgeGlyphShape } from "./DGLOs";
import { CircleGlyphShape, SourceTargetLineGlyphShape } from "./shapeClasses";
import { DGLOsSVGCombined } from "./DGLOsSVGCombined";
import { SVGAttrOpts } from "./DGLOsSVG";
import { DGLOsWill } from "./DGLOsWill";

export class DGLOsMatt extends DGLOsSVGCombined {
	public drawNodeGlyphs() {
		this._nodeG = this.loc.append("g")
			.classed("nodes", true);

		this._nodeGlyphs = this._nodeG.selectAll("circle")
			.data(this._data.timesteps[this._timeStampIndex].nodes, function (d: Node): string { return "" + d.id });

		this._nodeGlyphs.exit().remove();

		let nodeEnter = this._nodeGlyphs.enter().append("circle")
			.attr("id", function (d: any): string | number { return d.name; });

		this._nodeGlyphs = this._nodeGlyphs.merge(nodeEnter);

		// //here for debugging
		// this._nodeGlyphs
		// 	.attr("fill", this._fill)
		// 	.attr("stroke", this._stroke)
		// 	.attr("stroke-width", this._stroke_width)
		// 	.attr("r", this._radius);
	}

	public transformNodeGlyphsTo(shape: CircleGlyphShape) {
		console.log("circle")
	}

	public transformEdgeGlyphsTo(shape: SourceTargetLineGlyphShape) {
		console.log("line")
	}

	public setNodeGlyphAttrs(attr: SVGAttrOpts) {
		let color = this._colorScheme;
		this._nodeGlyphs
			.attr("fill", function (d: Node): string {
				return color(d.id);
			})
			.attr("stroke", attr.stroke)
			.attr("stroke-width", attr.stroke_width)
			.attr("r", attr.radius);
	}

	public setEdgeGlyphAttrs(attr: SVGAttrOpts) {
		console.log(attr)
		console.log(this._edgeGlyphs)
		this._edgeGlyphs
			.attr("stroke", attr.stroke)
			.attr("stroke-width", attr.stroke_width);
	}

	public runSimulation() {

		//Check simulation exists
		if (this._simulation === undefined) {
			this._simulation = d3force.forceSimulation()
				.force("link", d3force.forceLink().id(function (d: Node): string { return "" + d.id })) //Pull applied to EdgeGlyphs
				.force("charge", d3force.forceManyBody().strength(-50)) //Push applied to all things from center
				.force("center", d3force.forceCenter(this._width / 2, this._height / 2))
				.on("tick", this.ticked(this));
		}
		if (this._simulation !== undefined) {
			this._simulation.nodes(this._data.timesteps[this._timeStampIndex].nodes);
			(this._simulation.force("link") as d3force.ForceLink<Node, Edge>).links(this._data.timesteps[this._timeStampIndex].edges);

			this._simulation.alpha(.5).restart();
		}
	}

	private ticked(self: DGLOsMatt) {
		return () => self.tick();
	}

	private tick() {
		if (this._edgeGlyphs !== undefined) {
			this._edgeGlyphs
				.attr("x1", function (d: Edge) { return d.source.x; })
				.attr("y1", function (d: Edge) { return d.source.y; })
				.attr("x2", function (d: Edge) { return d.target.x; })
				.attr("y2", function (d: Edge) { return d.target.y; });
		} else {
			console.log("No links!");
		}
		if (this._nodeGlyphs !== undefined) {
			this._nodeGlyphs
				.attr("cx", function (d: Node) {
					return d.x;
				})
				.attr("cy", function (d: Node) { return d.y; });
		} else {
			console.log("No nodes!");
		}
	}
}