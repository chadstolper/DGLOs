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
		//create circle nodes
		this._nodeG = this.loc.append("g")
			.classed("nodes", true);

		this._nodeCircleGlyphs = this._nodeG.selectAll("circle")
			.data(this._data.timesteps[this._timeStampIndex].nodes, function (d: Node): string { return "" + d.id });

		this._nodeCircleGlyphs.exit().remove();

		let nodeEnter = this._nodeCircleGlyphs.enter().append("circle")
			.attr("id", function (d: any): string | number { return d.name; });

		this._nodeCircleGlyphs = this._nodeCircleGlyphs.merge(nodeEnter);


		//create rect nodes
		this._nodeLabelGlyphs = this._nodeG.selectAll("label")
			.data(this._data.timesteps[this._timeStampIndex].nodes, function (d: Node): string { return "" + d.id });

		this._nodeLabelGlyphs.exit().remove();

		nodeEnter = this._nodeLabelGlyphs.enter().append("label")
			.attr("id", function (d: any): string | number { return d.name; });

		this._nodeLabelGlyphs = this._nodeLabelGlyphs.merge(nodeEnter);

		this._nodeLabelGlyphs
			.text(function (d: Node): string {
				return d.label;
			})
	}

	public transformNodeGlyphsTo(shape: NodeGlyphShape) {
		// switch ()
		// {
		// 	case "Circle": switch (){ };
		// 		break;

		// 	case ""
		// }
	}

	private transformNodesFromCircleToLabel() {
		console.log("be quiet Vegeta");
		this._nodeCircleGlyphs
			.style("display", "none");

		this._nodeLabelGlyphs
			.style("display", null);
	}

	private transformNodesFromLabelToCircle() {
		console.log("this isnt even my final form!");
		this._nodeCircleGlyphs
			.style("display", null);

		this._nodeLabelGlyphs
			.style("display", "hidden");
	}

	public setNodeGlyphAttrs(attr: SVGAttrOpts) {
		let color = this._colorScheme; //because scope issues
		this._nodeCircleGlyphs
			.attr("fill", function (d: Node): string {
				return color(d.id);
			})
			.attr("stroke", attr.stroke)
			.attr("r", attr.radius)
			.attr("stroke-width", attr.stroke_width)
			.attr("width", attr.width)
			.attr("height", attr.height)
			.attr("opacity", attr.opacity);
	}

	public setEdgeGlyphAttrs(attr: SVGAttrOpts) {
		this._edgeGlyphs
			.attr("fill", attr.fill)
			.attr("stroke", attr.stroke)
			.attr("r", attr.radius)
			.attr("stroke-width", attr.stroke_width)
			.attr("width", attr.width)
			.attr("height", attr.height)
			.attr("opacity", attr.opacity);
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
		if (this._nodeCircleGlyphs !== undefined) {
			this._nodeCircleGlyphs
				.attr("cx", function (d: Node) {
					return d.x;
				})
				.attr("cy", function (d: Node) { return d.y; });
		} else {
			console.log("No nodes!");
		}
	}
}