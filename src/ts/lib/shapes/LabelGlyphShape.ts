import { NodeGlyphShape } from "../NodeGlyphInterface"
import { EdgeGlyphShape } from "../EdgeGlyphInterface";
import { Selection, select } from "d3-selection";
import * as d3 from "d3"
import { DynamicGraph, Node, Edge } from "../../model/dynamicgraph";
import { SVGAttrOpts } from "../DGLOsSVG";
import { Shape } from "./Shape"
import { ScaleOrdinal, scaleOrdinal, scalePoint, schemeCategory20 } from "d3-scale";

export class LabelGlyphShape extends Shape implements NodeGlyphShape {
	readonly _shapeType = "Label";
	readonly _textAnchor: string = "middle";
	readonly _dominantBaseline: string = "middle";
	private _colorScheme = scaleOrdinal<string | number, string>(schemeCategory20);
	private _enterColor: string = "#00D50F"; /* Value used for entering and non-exiting nodes. Default #00D50F. */
	private _exitColor: string = "#D90000"; /* Value used for non-entering and exiting nodes. Default #D90000. */
	private _enterExitColor: string = "#FFE241"; /* Value used for entering and exiting nodes. Default #FFE241. */
	private _stableColor: string = "#404ABC"; /* Values used for non-exiting, non-entering nodes. Default #404ABC. */
	private _enterExitEnabled: boolean;
	// readonly _font = "ComicSans";

	/**
	 * Make new <g>
	 * @param location
	 */
	public init(location: Selection<any, {}, any, {}>): Selection<any, {}, any, {}> {
		return location.append("g").classed("LabelNodes", true);
	}

	/**
	 * Create new Selection of label DOM elements and return the Selection.
	 * @param location
	 */
	public initDraw(location: Selection<any, Node, any, {}>): Selection<any, Node, any, {}> {
		let self = this;
		let ret: Selection<any, Node, any, {}> = location.append("text")
			.classed("label", true)
			.attr("id", function (d: Node): string | number { return d.label; })
			.attr("index", function (d: Node) {
				return d.index;
			})
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
	public updateDraw(glyphs: Selection<any, {}, any, {}>, attrOpts: SVGAttrOpts, data: DynamicGraph, timeStampIndex: number, labelYAxis?: boolean): Selection<any, {}, any, {}> {
		let colorScheme = scaleOrdinal<string | number, string>(schemeCategory20);

		let self = this;
		if (labelYAxis === undefined) {
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

		} else {
			if (labelYAxis) {
				let yAxisScale = scalePoint<number>()
					.domain(data.timesteps[timeStampIndex].nodes.map(function (d) { return d.index }))
					.range([attrOpts.height / 8, attrOpts.height])
					.padding(0.5);
				try {
					glyphs
						.text(function (d: Node): string {
							return d.label;
						});
					glyphs
						.attr("x", function (d: Node) {
							d.x = attrOpts.width / 8 - (3 * attrOpts.width / 100);
							return attrOpts.width / 8 - (3 * attrOpts.width / 100);
						})
						.attr("y", function (d: Node) {
							d.y = yAxisScale(d.index);
							return yAxisScale(d.index);
						});
				} catch (err) {
					console.log("No label nodes!");
				}
			} else {
				let xAxisScale = scalePoint<number>()
					.domain(data.timesteps[timeStampIndex].nodes.map(function (d) { return d.index }))
					.range([attrOpts.width / 8, attrOpts.width])
					.padding(0.5);
				try {
					glyphs
						.text(function (d: Node): string {
							return d.label;
						});
					glyphs
						.attr("x", function (d: Node) {
							//d.x = xAxisScale(d.index);
							return xAxisScale(d.index);
						})
						.attr("y", function (d: Node) {
							d.y = attrOpts.height / 8 - (3 * attrOpts.height / 100);
							// return attrOpts.height / 8 - (3 * attrOpts.height / 100);
							return d.y;
						});
				} catch (err) {
					console.log("No label nodes!");
				}
			}
		}
		if (this.enterExitEnabled) {
			glyphs.style("fill", this.enterExitCheck());
		}
		else {
			glyphs.style("fill", attrOpts.stroke);
		}
		glyphs
			.style("stroke", "black")
			.style("stroke-width", 0.25)
			.attr("opacity", attrOpts.opacity);

		return glyphs;
	}
	/**
	 * Returns the correct color relating to the Enter/Exit of data in each timestep.
	 * Green: Node entering and present in next timestep; Red: Node was present already and exiting;
	 * Yellow: Node entering and exiting in same timestep; Blue: Node present in previous and next timestep.
	 */
	private enterExitCheck() {
		let self = this;
		return function (d: Node): string {
			if (d.isEnter) {
				if (d.isExit) {
					return self.enterExitColor;
				}
				return self.enterColor;
			}
			else {
				if (d.isExit) {
					return self.exitColor;
				}
				return self.stableColor;
			}
		}
	}
	/**
	 * Fill the LabelGlyph selection color. Returns hexCode as string.
	 * @param d 
	 * @param key 
	 */
	private fill(d: Node, key: string) {
		switch (key) {
			case "id": return this.colorScheme(d.origID);
			case "label": return this.colorScheme(d.label);
			case "type": return this.colorScheme(d.type);
			default: return key;
		}
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
	 * @param location
	 * @param data 
	 * @param timeStepIndex 
	 * @param attrOpts
	 * @param enterExit
	 */

	public draw(labelG: Selection<any, {}, any, {}>, data: DynamicGraph, timeStepIndex: number, attrOpts: SVGAttrOpts, duplicateNodes: boolean = undefined, enterExit: boolean = false): void {
		this.enterExitEnabled = enterExit;
		let labelGlyphs = labelG.selectAll("text.label")
			.data(data.timesteps[timeStepIndex].nodes, function (d: Node) { return d.id + "" });
		labelGlyphs.exit().remove();
		if (duplicateNodes === undefined) {
			let labelEnter: Selection<any, Node, any, {}> = this.initDraw(labelGlyphs.enter(), data, timeStepIndex);
			labelGlyphs = labelGlyphs.merge(labelEnter);
			this.updateDraw(labelGlyphs, attrOpts, data, timeStepIndex);
		} else {
			if (duplicateNodes) {
				let copySet = labelG.selectAll("text.label.top")
					.data(data.timesteps[timeStepIndex].nodes, function (d: Node): string { return "" + d.id });
				copySet.exit().remove();
				let copyEnter: Selection<any, Node, any, {}> = this.initDraw(copySet.enter(), data, timeStepIndex);
				copySet = copySet.merge(copyEnter);
				this.updateDraw(copySet, attrOpts, data, timeStepIndex, false);
			}
			let labelEnter: Selection<any, Node, any, {}> = this.initDraw(labelGlyphs.enter(), data, timeStepIndex);
			labelGlyphs = labelGlyphs.merge(labelEnter);
			this.updateDraw(labelGlyphs, attrOpts, data, timeStepIndex, true);
		}
  }

	get textAnchor(): string {
		return this._textAnchor;
	}

	get dominantBaseline(): string {
		return this._dominantBaseline;
	}
	/**
	 * Assigns new colorScheme: ScaleOrdinal<string | number, string>(schemeCategory#).
	 * @param scheme
	 */
	set colorScheme(scheme: ScaleOrdinal<string | number, string>) {
		this._colorScheme = scheme;
	}
	get colorScheme(): ScaleOrdinal<string | number, string> {
		return this._colorScheme;
	}
	set enterColor(color: string) {
		this._enterColor = color;
	}
	get enterColor(): string {
		return this._enterColor;
	}
	set exitColor(color: string) {
		this._exitColor = color;
	}
	get exitColor(): string {
		return this._exitColor;
	}
	set enterExitColor(color: string) {
		this._enterExitColor = color;
	}
	get enterExitColor(): string {
		return this._enterExitColor;
	}
	set stableColor(color: string) {
		this._stableColor = color;
	}
	get stableColor(): string {
		return this._stableColor;
	}
	get shapeType(): string {
		return this._shapeType;
	}
	set enterExitEnabled(boo: boolean) {
		this._enterExitEnabled = boo;
	}
	get enterExitEnabled(): boolean {
		return this._enterExitEnabled;
	}
}