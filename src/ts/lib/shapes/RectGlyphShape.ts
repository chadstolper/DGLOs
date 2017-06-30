import { NodeGlyphShape } from "../NodeGlyphInterface"
import { EdgeGlyphShape } from "../EdgeGlyphInterface";
import { Selection } from "d3-selection";
import { extent } from "d3-array";
import { SVGAttrOpts } from "../DGLOsSVG";
import { DynamicGraph, Node, Edge } from "../../model/dynamicgraph";
import * as d3Scale from "d3-scale";
import { Shape } from "./Shape"
import { interpolate, toRect } from "flubber";
import { transition } from "d3-transition"
import { ScaleOrdinal, scaleOrdinal, schemeCategory20 } from "d3-scale";

/**
 * The __RectGlyphsShape__ class contains all of the methods required to draw and position a rectangle on screen.
 * The only attribute in the class is its __ _shapeType __ which is readonly. Shape types are used to coordinate 
 * transisitons between shapes.
 * 
 * The class implements __EdgeGlyphShape__ and as such must contain the following methods:
 * 	 *init()*, 
 * 	 *initDraw()*,
 * 	 *updateDraw()*, 
 * 	 *transformTo()*,
 *	 *draw()*, 
 */
export class RectGlyphShape extends Shape implements EdgeGlyphShape {
	private readonly _shapeType = "Rect";
	private readonly PADDING_CONSTANT: number = 0.875;
	private _colorMap: d3Scale.ScaleLinear<string, string>;
	/**
	 *  Value used for initial enterEdge color transition. Default #00D50F.
	 */
	private _enterColor: string = "#00D50F";
	/**
	 * Value used for exitEdge color transition. Default #D90000.
	 */
	private _exitColor: string = "#D90000";
	/**
	 * Value used for entering and exiting nodes. Default #FFE241.
	 */
	private _enterExitColor: string = "#FFE241";
	/**
	 * Values used for non-exiting, non-entering nodes. Default #404ABC.
	 */
	private _stableColor: string = "#404ABC";
	/**
	 * Value used for max gradient color showing edge weight. Default #000000.
	 */
	private _maxGradientColor: string = "#000000";
	/**
	 * Value used for min gradient color showing edge weight. Default #FFFFFF.
	 */
	private _minGradientColor: string = "#FFFFFF";
	/**
	 * Duration of transition / length of animation. Default 1000ms.
	 */
	private _transitionDuration: number = 1000;
	/**
	 * Time between animation from standard view to exitview. Default 7000ms.
	 */
	private _transitionDelay: number = 7000;
	private _enterExitEnabled: boolean;
	private _xPadding: number;
	private _yPadding: number;

	/**
	 * The init method is a requirement of the __EdgeGlyphShape__ interface.
	 * 
	 * It takes an SVG selection and appends a <g> tag with class name rectEdges.
	 * This class is used to store the rectangle objects.
	 * @param location
	 */
	public init(location: Selection<any, {}, any, {}>): Selection<any, {}, any, {}> {
		let rectG = location.append("g").classed("rectEdges", true)
			.style("fill", "green")
			.attr("d", "M 0,0 L 0,0 L 0,0 L 0,0 Z ");
		return rectG;
	}
	/**
	 * It takes an SVG selection with entered data and creates rectangle objects with
	 * an ID based on the source and target of the edge.
	 * @param glyphs 
	 */
	public initDraw(glyphs: Selection<any, Edge, any, {}>): Selection<any, Edge, any, {}> {
		let self = this;
		let ret: Selection<any, Edge, any, {}> = glyphs.append("path")
			.attr("id", function (d: Edge): string { return d.source.id + ":" + d.target.id; })
			.attr("d", function (d: Edge): string {
				// return "M " + (d.x + (w / 2)) + "," + (d.y + (h / 2)) + "L " + (d.x + (w / 2)) + "," + (d.y + (h / 2)) + "L "
				// 	+ (d.x + (w / 2)) + "," + (d.y + (h / 2)) + "L " + (d.x + (w / 2)) + "," + (d.y + (h / 2));
				return "M " + (d.x + (self.xPadding / 2)) + "," + (d.y + (self.yPadding / 2)) + "L " + (d.x + (self.xPadding / 2)) + "," + (d.y + (self.yPadding / 2)) + "L "
					+ (d.x + (self.xPadding / 2)) + "," + (d.y + (self.yPadding / 2)) + "L " + (d.x + (self.xPadding / 2)) + "," + (d.y + (self.yPadding / 2));
			});
		return ret;
	}
	/**
	 * The updateDraw method is a requirement of the __EdgeGlyphShape__ interface.
	 * 
	 * updateDraw takes a selection of rectangle glyphs and an SVGAttrOpts object
	 * and assigns attributes to the rectangles (e.g. Width, Height, etc..). The
	 * method also takes a DynamicGraph and a number. These are used to make 
	 * calculations required to color the rectanges on a linear color scale.
	 * @param glyphs 
	 * @param attr 
	 * @param data 
	 * @param TimeStampIndex 
	 */
	public updateDraw(glyphs: Selection<any, {}, any, {}>, attr: SVGAttrOpts): Selection<any, {}, any, {}> {
		let self = this;
		try {
			glyphs
				.transition().duration(this._transitionDuration)
				.attrTween("d", function (d: Edge) {
					let elem: HTMLElement = this;
					let oldD: string = elem.getAttribute("d");
					let newD = self.getPath(d, attr);
					try {
						return interpolate(oldD, newD);
					}
					catch (err) {
						// console.log("interpolate error, rects do not (yet) exist");
					}
				})
				.attr("stroke", attr.stroke_edge)
				.attr("stroke-width", attr.stroke_width_edge)
				.attr("fill", function (d: Edge) {
					return self.colorMap(d.weight);
				});
		} catch (err) {
			console.log("No Rect edges!");
		}
		return glyphs;
	}
	/**
	 * The transformTo is a requirement of the __EdgeGlyphShape__ interface.
	 * 
	 * transformTo takes the current <g> tag displaying glyphs, an EdgeGlyphsShape, and a target <g> tag.
	 * It hides all glyphs in the current tag, and unhides all glyphs in the target tag.
	 * @param sourceG 
	 * @param targetShape 
	 * @param targetG 
	 */
	public transformTo(sourceG: Selection<any, {}, any, {}>, targetShape: EdgeGlyphShape, targetG: Selection<any, {}, any, {}>): void {
		switch (targetShape.shapeType) {
			case "Rect":
				break;
			case "STLine":
				break;
			case "Gestalt":
				break;
			default:
				console.log("Transition from", this.shapeType, "to ", targetShape.shapeType, "is unknown.");
		}
		// console.log("rectTransformTo: " + targetShape.shapeType);
		super.transformTo(sourceG, targetShape, targetG);
	}
	/**
	 * The draw method is a requirement of the __EdgeGlyphShape__ interface.
	 * 
	 * The draw method takes a SVG selection to draw within, a DynamicGraph to be displayed, a timeStampIndex,
	 * and an SVGAttrOpts object to assign attributes to draw.
	 * @param rectG 
	 * @param data 
	 * @param timeStampIndex 
	 * @param attr 
	 */
	public draw(rectG: Selection<any, {}, any, {}>, data: DynamicGraph, timeStampIndex: number, attr: SVGAttrOpts): void {
		this.initColorMap(data, timeStampIndex, attr);
		this.xPadding = this.PADDING_CONSTANT * (attr.height / (data.timesteps[timeStampIndex].nodes.length));
		this.yPadding = this.PADDING_CONSTANT * (attr.width / (data.timesteps[timeStampIndex].nodes.length));
		for (let e of data.timesteps[timeStampIndex].edges) {
			e.x = (attr.width - (attr.width * this.PADDING_CONSTANT)) + (this.xPadding * +e.source.index);
			e.y = (attr.height - (attr.height * this.PADDING_CONSTANT)) + (this.yPadding * +e.target.index);
		}

		let rects = rectG.selectAll("path")
			.data(data.timesteps[timeStampIndex].edges);
		rects.exit().remove();
		let enter = this.initDraw(rects.enter());
		rects = rects.merge(enter as Selection<any, Edge, any, {}>);
		this.updateDraw(rects, attr);
	}
	/**
	 * Returns the shape path as a string of the current rect shape.
	 * @param attr 
	 * @param edge 
	 */
	public getPath(d: Edge, attr: SVGAttrOpts) {
		let h = this.xPadding;
		let w = this.yPadding;
		return "M " + d.x + " " + d.y + " L " + d.x + " " + (d.y + h) + " L " + (d.x + w) + " " + (d.y + h) + " L " + (d.x + w) + " " + d.y + " Z";
	}
	/**
	* Returns the correct color relating to the Enter/Exit of data in each timestep.
	* Green: Edge entering and present in next timestep; Red: Edge was present already and exiting;
	* Yellow: Edge entering and exiting in same timestep; Blue: Edge present in previous and next timestep.
	*/
	private enterExitCheck() {
		let self = this;
		return function (d: Edge): string {
			if (d.origSource.isEnter || d.origTarget.isEnter) {
				if (d.origSource.isExit || d.origTarget.isExit) {
					return self.enterExitColor;
				}
				return self.enterColor;
			}
			else { //isEnter=false
				if (d.origSource.isExit || d.origTarget.isExit) {
					return self.exitColor;
				}
				return self.stableColor;
			}
		}
	}

	/**
	 * Initialize the colorscheme used for shading based on weights of edge data at that timestep.
	 * @param data 
	 * @param timeStampIndex 
	 * @param attr 
	 */
	private initColorMap(data: DynamicGraph, timeStampIndex: number, attr: SVGAttrOpts) {
		if (this.colorMap === undefined) {
			this.maxGradientColor = attr.stroke_edge;
			this.colorMap = d3Scale.scaleLinear<string>()
				.domain(this.createColorDomain(data.timesteps[timeStampIndex].edges))
				.range([this.minGradientColor, this.maxGradientColor]);
		}
	}

	/**
	 * Create color domain takes an array of edges and finds the extent of the edge weights.
	 * @param edges 
	 */
	public createColorDomain(edges: Array<Edge>) {
		return extent(edges, function (d: Edge): number {
			return d.weight;
		});
	}

	get shapeType(): string {
		return this._shapeType;
	}
	/**
	 * Assigns new colorScheme: ScaleOrdinal<string | number, string>(schemeCategory#).
	 * @param scheme
	 */
	set colorMap(scheme: d3Scale.ScaleLinear<string, string>) {
		this._colorMap = scheme;
	}
	get colorMap(): d3Scale.ScaleLinear<string, string> {
		return this._colorMap;
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
	set maxGradientColor(color: string) {
		this._maxGradientColor = color;
	}
	get maxGradientColor(): string {
		return this._maxGradientColor;
	}
	set minGradientColor(color: string) {
		this._minGradientColor = color;
	}
	get minGradientColor(): string {
		return this._minGradientColor;
	}
	set transitionDuration(duration: number) {
		this._transitionDuration = duration;
	}
	get transitionDuration(): number {
		return this._transitionDuration;
	}
	set transitionDelay(delay: number) {
		this._transitionDelay = delay;
	}
	get transitionDelay(): number {
		return this._transitionDelay;
	}
	set enterExitEnabled(boo: boolean) {
		this._enterExitEnabled = boo;
	}
	get enterExitEnabled(): boolean {
		return this._enterExitEnabled;
	}
	set xPadding(num: number) {
		this._xPadding = num;
	}
	get xPadding(): number {
		return this._xPadding;
	}
	set yPadding(num: number) {
		this._yPadding = num;
	}
	get yPadding(): number {
		return this._yPadding;
	}
}