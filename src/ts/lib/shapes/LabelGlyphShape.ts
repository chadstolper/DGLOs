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
	private PADDING_CONSTANT: number = this.lib.matrixPadding;
	readonly INVERSE_PADDING_CONSTANT: number = this.lib.matrixLabelPadding;
	readonly MARGIN_RATIO: number = 0.095;
	private _xMargin: number;
	private _yMargin: number;
	private _colorScheme = scaleOrdinal<string | number, string>(schemeCategory20);
	private _enterColor: string = "#00D50F"; /* Value used for entering and non-exiting nodes. Default #00D50F. */
	private _exitColor: string = "#D90000"; /* Value used for non-entering and exiting nodes. Default #D90000. */
	private _enterExitColor: string = "#FFE241"; /* Value used for entering and exiting nodes. Default #FFE241. */
	private _stableColor: string = "#404ABC"; /* Values used for non-exiting, non-entering nodes. Default #404ABC. */
	private _enterExitEnabled: boolean;
	private _duplicate: boolean;
	private _xAxisScale: any;
	private _yAxisScale: any;
	private _transitionDuration: number = 1000; //Duration of transition / length of animation. Default 1000ms.
	private readonly LONGEST_TEXT_ESTIMATE: number = 5;
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
		let ret: Selection<any, Node, any, {}>;
		if (this.duplicate === undefined) {
			ret = location.append("text")
				.classed("label", true)
				.attr("id", function (d: Node): string | number { return d.label; })
				.attr("index", function (d: Node) {
					return d.index;
				})
				.style("dominant-baseline", this._dominantBaseline)
				.style("text-anchor", this._textAnchor)
				.style("user-select", "none")
				.style("opacity", 0)
				.on("click", function (d: Node) {
					if (self.lib.onClickRedraw) {
						self.lib.setCenterNode(d.origID);
					}
				});
			return ret;
		}
		else {
			if (this.duplicate) {
				ret = location.append("text")
					.classed("labely", true)
					.attr("id", function (d: Node): string | number { return d.label; })
					.attr("index", function (d: Node) { return d.index; })
					.attr("x", function (d: Node) {
						return self.xMargin
					})
					.attr("y", function (d: Node) {
						return self.yAxisScale(d.index);
					})
					.style("dominant-baseline", this._dominantBaseline)
					.style("text-anchor", "end")//this._textAnchor)
					.style("user-select", "none")
					.style("opacity", 0)
					.on("click", function (d: Node) {
						if (self.lib.onClickRedraw) {
							self.lib.setCenterNode(d.origID);
						}
					});
				return ret;
			}
			else {
				ret = location.append("text")
					.classed("labelx", true)
					.attr("id", function (d: Node): string | number { return d.label; })
					.attr("index", function (d: Node) { return d.index; })
					.attr("y", function (d: Node) {
						return self.yMargin;
					})
					.attr("x", function (d: Node) {
						return self.xAxisScale(d.index);
					})
					.style("dominant-baseline", this._dominantBaseline)
					.style("text-anchor", "start") //this._textAnchor)
					.style("user-select", "none")
					.style("opacity", 0)
					.on("click", function (d: Node) {
						if (self.lib.onClickRedraw) {
							self.lib.setCenterNode(d.origID);
						}
					});
				return ret;
			}

		}

	}

	/**
	 * Assign and/or update node label data and (x,y) positions
	 * @param glyphs 
	 */
	public updateDraw(glyphs: Selection<any, {}, any, {}>, attrOpts: SVGAttrOpts): Selection<any, {}, any, {}> {
		let self = this;
		if (this.duplicate === undefined) {
			try {
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
			if (this.duplicate) {
				try {
					glyphs
						.transition()
						.duration(this.transitionDuration)
						.attr("x", function (d: Node) {
							return self.xMargin;
						})
						.attr("y", function (d: Node) {
							return self.yAxisScale(d.index)
						})
						.style("opacity", attrOpts.opacity)
				} catch (err) {
					console.log("No label nodes!");
				}
			} else {
				try {
					glyphs
						.transition()
						.duration(this.transitionDuration)
						.attr("x", function (d: Node) {
							return self.xAxisScale(d.index);
						})
						.attr("y", function (d: Node) {
							return self.yMargin;
						})
						.style("opacity", attrOpts.opacity)
						.attr("transform", function (d: Node) {
							return "rotate(270 " + self.xAxisScale(d.index) + "," + self.yMargin + ")"
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
			.text(function (d: Node): string {
				return d.label;
			})
			.style("font-size", (this.INVERSE_PADDING_CONSTANT * attrOpts.width) / this.LONGEST_TEXT_ESTIMATE)
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

	public draw(labelG: Selection<any, {}, any, {}>, data: DynamicGraph, timeStepIndex: number, attrOpts: SVGAttrOpts, duplicateNodes: boolean = false, enterExit: boolean = false): void {
		this.enterExitEnabled = enterExit;
		this.duplicate = duplicateNodes;
		this.initScales(data, timeStepIndex, attrOpts);

		if (!duplicateNodes) {
			let labelGlyphs = labelG.selectAll("text.label")
				.data(data.timesteps[timeStepIndex].nodes, function (d: Node) { return d.id + "" });
			labelGlyphs.exit().remove();
			let labelEnter: Selection<any, Node, any, {}> = this.initDraw(labelGlyphs.enter());
			labelGlyphs = labelGlyphs.merge(labelEnter);
			this.duplicate = undefined;
			this.updateDraw(labelGlyphs, attrOpts);
		}
		if (duplicateNodes) {
			this.xMargin = attrOpts.width * this.MARGIN_RATIO; //TODO: it works, but i dont like it...
			this.yMargin = attrOpts.height * this.MARGIN_RATIO;

			attrOpts.font_size = this.PADDING_CONSTANT * (attrOpts.width / (data.timesteps[timeStepIndex].nodes.length)) + "px";

			let labelGlyphsX = labelG.selectAll("text.labelx")
				.data(data.timesteps[timeStepIndex].nodes, function (d: Node) { return d.id + "" });
			labelGlyphsX.exit().remove();
			let labelGlyphsY = labelG.selectAll("text.labely")
				.data(data.timesteps[timeStepIndex].nodes, function (d: Node) { return d.id + "" });
			labelGlyphsY.exit().remove();

			this.duplicate = false;
			let copyEnterX: Selection<any, Node, any, {}> = this.initDraw(labelGlyphsX.enter());
			this.duplicate = true;
			let copyEnterY: Selection<any, Node, any, {}> = this.initDraw(labelGlyphsY.enter());

			labelGlyphsY = labelGlyphsY.merge(copyEnterY);
			this.updateDraw(labelGlyphsY, attrOpts);
			labelGlyphsX = labelGlyphsX.merge(copyEnterX);
			this.duplicate = false;
			this.updateDraw(labelGlyphsX, attrOpts);
		}
	}

	private initScales(data: DynamicGraph, timeStampIndex: number, attrOpts: SVGAttrOpts) {
		this.xAxisScale = scalePoint<number>()
			.domain(data.timesteps[timeStampIndex].nodes.map(function (d) { return d.index }))
			.range([(attrOpts.width - (attrOpts.width * this.PADDING_CONSTANT)), attrOpts.width])
			.padding(0.5);
		this.yAxisScale = scalePoint<number>()
			.domain(data.timesteps[timeStampIndex].nodes.map(function (d) { return d.index }))
			.range([attrOpts.height - (attrOpts.height * this.PADDING_CONSTANT), attrOpts.height])
			.padding(0.5);
	}

	get textAnchor(): string {
		return this._textAnchor;
	}
	set xMargin(num: number) {
		this._xMargin = num;
	}
	get xMargin(): number {
		return this._xMargin;
	}
	set yMargin(num: number) {
		this._yMargin = num;
	}
	get yMargin(): number {
		return this._yMargin;
	}
	get dominantBaseline(): string {
		return this._dominantBaseline;
	}
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
	set duplicate(boo: boolean) {
		this._duplicate = boo;
	}
	get duplicate(): boolean {
		return this._duplicate;
	}
	set xAxisScale(scale: any) {
		this._xAxisScale = scale;
	}
	get xAxisScale(): any {
		return this._xAxisScale;
	}
	set yAxisScale(scale: any) {
		this._yAxisScale = scale;
	}
	get yAxisScale(): any {
		return this._yAxisScale;
	}
	set transitionDuration(num: number) {
		this._transitionDuration = num;
	}
	get transitionDuration(): number {
		return this._transitionDuration;
	}
}