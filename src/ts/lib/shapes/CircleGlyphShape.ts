import { NodeGlyphShape } from "../NodeGlyphInterface"
import { EdgeGlyphShape } from "../EdgeGlyphInterface";
import { Selection } from "d3-selection";
import { DynamicGraph, Node, Edge } from "../../model/dynamicgraph";
import { SVGAttrOpts, DGLOsSVG } from "../DGLOsSVG";
import { Shape } from "./Shape"

import { ScaleOrdinal, scaleOrdinal, schemeCategory20 } from "d3-scale";
import "d3-transition";

export class CircleGlyphShape extends Shape implements NodeGlyphShape {
	readonly _shapeType = "Circle";
	/**
	 * Make new <g>
	 * @param location
	 */
	public init(location: Selection<any, {}, any, {}>): Selection<any, {}, any, {}> {
		return location.append("g").classed("CircleNodes", true)
	}

	/**
	 * Create selection of nodes. Returns new selection
	 * @param glyphs
	 */
	public initDraw(glyphs: Selection<any, Node, any, {}>, data: DynamicGraph, TimeStampIndex: number, ): Selection<any, Node, any, {}> {
		let self = this;
		let ret: Selection<any, Node, any, {}> = glyphs.append("circle")
			.classed("node", true)
			.attr("id", function (d: Node): string | number { return d.id; })
			.on("click", function (d: Node) {
				self.lib.setCenterNode(d.origID);
				if (self.lib.onClickRedraw) {
					self.lib.redraw();
				}
			});
		return ret;
	}

	/**
	 * Assign and/or update node circle attributes and (cx,cy) positions
	 * @param glyphs 
	 */
	public updateDraw(glyphs: Selection<any, {}, any, {}>, attrOpts: SVGAttrOpts, data: DynamicGraph, TimeStampIndex: number): Selection<any, {}, any, {}> {
		let colorScheme = scaleOrdinal<string | number, string>(schemeCategory20);
		try {
			glyphs
				.attr("cx", function (d: Node) {
					return d.x;
				})
				.attr("cy", function (d: Node) {
					return d.y;
				});
		} catch (err) {
			console.log("No circle nodes!");
		}
		try {
			switch (attrOpts.fill) {
				case "id":
					glyphs
						.attr("fill", function (d: Node): string {
							return colorScheme(d.origID);
						});
					break;

				case "label":
					glyphs
						.attr("fill", function (d: Node): string {
							return colorScheme(d.label);
						});
					break;

				case "type":
					glyphs
						.attr("fill", function (d: Node): string {
							return colorScheme(d.type);
						});
					break;
				default:
					glyphs
						.attr("fill", attrOpts.fill);
			}

			glyphs
				.attr("stroke", attrOpts.stroke)
				.attr("r", attrOpts.radius)
				.attr("stroke-width", attrOpts.stroke_width)
				.attr("opacity", attrOpts.opacity);
		}
		catch (err) {
			console.log("attropts Circle undefined");
		}

		return glyphs;
	}

	/**
	 * Transform the current NodeGlyphShapes to given NodeGlyphShape
	 * @param sourceSelection 
	 * @param shape 
	 * @param targetSelection 
	 */
	public transformTo(sourceSelection: Selection<any, {}, any, {}>, shape: NodeGlyphShape, targetSelection: Selection<any, {}, any, {}>) {
		switch (shape.shapeType) {
			case "Label":
<<<<<<< HEAD
				console.log("Circle-->Label")
=======
				//TODO: add a transition
>>>>>>> refs/remotes/origin/dglos
				break;
			case "Circle":
				//TODO: add a transition
				break;
			case "Gestalt":
				//TODO: add a transition
				break;
			default: console.log("new NodeShape is undefined");
				break;
		};
		super.transformTo(sourceSelection, null, targetSelection);
	}

	/**
	 * Draw and create new visualizations of nodes, initial update included
	 * @param circleG Should be the circleG
	 * @param data 
	 * @param timeStepIndex 
	 */
	public draw(circleG: Selection<any, {}, any, {}>, data: DynamicGraph, timeStepIndex: number, attrOpts: SVGAttrOpts): void {
		let circleGlyphs = circleG.selectAll("circle.node")
			.data(data.timesteps[timeStepIndex].nodes, function (d: Node): string { return "" + d.id });

		circleGlyphs.exit().remove();

		let circleEnter: Selection<any, Node, any, {}> = this.initDraw(circleGlyphs.enter(), data, timeStepIndex);

		circleGlyphs = circleGlyphs.merge(circleEnter);

		this.updateDraw(circleGlyphs, attrOpts, data, timeStepIndex);
	}

	get shapeType(): string {
		return this._shapeType;
	}
}