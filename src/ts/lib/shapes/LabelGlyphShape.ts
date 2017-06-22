import { NodeGlyphShape } from "../NodeGlyphInterface"
import { EdgeGlyphShape } from "../EdgeGlyphInterface";
import { Selection, select } from "d3-selection";
import * as d3 from "d3"
import { DynamicGraph, Node, Edge } from "../../model/dynamicgraph";
import { SVGAttrOpts } from "../DGLOsSVG";
import { Shape } from "./Shape"

import { ScaleOrdinal, scaleOrdinal, schemeCategory20 } from "d3-scale";

export class LabelGlyphShape extends Shape implements NodeGlyphShape {
	readonly _shapeType = "Label";
	readonly _textAnchor: string = "middle";
	readonly _dominantBaseline: string = "middle";
	// readonly _font = "ComicSans";

	/**
	 * Make new <g>
	 * @param location
	 */
	public init(location: Selection<any, {}, any, {}>): Selection<any, {}, any, {}> {
		return location.append("g").classed("LabelNodes", true);
	}

	/**
	 * Create selection of nodes. Returns new selection
	 * @param glyphs
	 */
	public initDraw(glyphs: Selection<any, Node, any, {}>, data: DynamicGraph, TimeStampIndex: number): Selection<any, Node, any, {}> {
		let self = this;
		let ret: Selection<any, Node, any, {}> = glyphs.append("text")
			.classed("label", true)
			.attr("id", function (d: Node): string | number { return d.label; })
			.style("dominant-baseline", this._dominantBaseline)
			.style("text-anchor", this._textAnchor)
			.style("user-select", "none")
			.on("click", function (d: Node) {
				if (self.lib.onClickRedraw) {
					self.lib.setCenterNode(d.origID);
				}
			});
		return ret;
	}

	/**
	 * Assign and/or update node label data and (x,y) positions
	 * @param glyphs 
	 */
	public updateDraw(glyphs: Selection<any, {}, any, {}>, attrOpts: SVGAttrOpts, data: DynamicGraph, TimeStampIndex: number): Selection<any, {}, any, {}> {
		let colorScheme = scaleOrdinal<string | number, string>(schemeCategory20);
		try {
			glyphs
				.text(function (d: Node): string {
					return d.label;
				});
			glyphs
				.attr("x", function (d: Node) {
					return d.x;
				})
				.attr("y", function (d: Node) {
					return d.y;
				});
		} catch (err) {
			console.log("No label nodes!");
		}
		try {
			switch (attrOpts.fill) {
				case "id":
					glyphs
						.attr("fill", function (d: Node): string {
							return colorScheme(d.id);
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
			}

			glyphs
				.attr("stroke", attrOpts.stroke)
				.attr("r", attrOpts.radius)
				.attr("stroke-width", attrOpts.stroke_width_label)
				.attr("opacity", attrOpts.opacity);
		}
		catch (err) {
			console.log("attropts label undefined")
		}

		return glyphs;
	}

	/**
	* Transform the current NodeGlyphShapes to given NodeGlyphShape
	* @param sourceSelection 
	* @param shape 
	* @param targetSelection 
 	*/
	public transformTo(sourceSelection: Selection<any, {}, any, {}>, targetShape: NodeGlyphShape, targetSelection: Selection<any, {}, any, {}>) {
		switch (targetShape.shapeType) {
			case "Circle":
				// console.log("Label-->Circle")
				break;

			case "Label":
				// console.log("Label-->Label Catch");
				break;

			default: console.log("new NodeShape is undefined");
				break;
		};
		console.log("Label --> " + targetShape.shapeType);
		super.transformTo(sourceSelection, targetShape, targetSelection);
	}
	/**
	 * Draw and create new visualizations of nodes, initial update included
	 * @param labelG Should be the labelG
	 * @param data 
	 * @param timeStepIndex 
	 */
	public draw(labelG: Selection<any, {}, any, {}>, data: DynamicGraph, timeStepIndex: number, attrOpts: SVGAttrOpts): void {
		let labelGlyphs = labelG.selectAll("text.label")
			.data(data.timesteps[timeStepIndex].nodes, function (d: Node): string { return "" + d.id });

		labelGlyphs.exit().remove();

		let labelEnter: Selection<any, Node, any, {}> = this.initDraw(labelGlyphs.enter(), data, timeStepIndex);
		labelGlyphs = labelGlyphs.merge(labelEnter);
		this.updateDraw(labelGlyphs, attrOpts, data, timeStepIndex);
	}

	get textAnchor(): string {
		return this._textAnchor;
	}

	get dominantBaseline(): string {
		return this._dominantBaseline;
	}


	get shapeType(): string {
		return this._shapeType;
	}
}