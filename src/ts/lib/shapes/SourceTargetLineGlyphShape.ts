import { NodeGlyphShape } from "../NodeGlyphInterface"
import { EdgeGlyphShape } from "../EdgeGlyphInterface";
import { Selection } from "d3-selection";
import { SVGAttrOpts } from "../DGLOsSVG";
import { DynamicGraph, Node, Edge } from "../../model/dynamicgraph";

import { LineGlyphShape } from "./LineGlyphShape";

import { ScaleOrdinal, scaleOrdinal, schemeCategory20 } from "d3-scale";

/**
 * The __SourceTargetLineGlyphShape__ class contains all of the methods required to draw and position a source-target line
 * (i.e. a straight line) on screen. The only attribute in the class is its __ _shapeType __ which is readonly. Shape types 
 * are used to coordinate transisitons between shapes.
 * 
 * The class implements __EdgeGlyphShape__ and as such must contain the following methods:
 * 	 *init()*, 
 * 	 *initDraw()*,
 * 	 *updateDraw()*, 
 * 	 *transformTo()*,
 *	 *draw()*, 
 */
export class SourceTargetLineGlyphShape extends LineGlyphShape implements EdgeGlyphShape {
	readonly _shapeType = "STLine";
	private _enterColor: string = "#00D50F"; /* Value used for initial enterNode color transition. Default #00D50F. */
	private _exitColor: string = "#D90000"; /* Value used for exitNode color transition. Default #D90000. */
	private _enterExitColor: string = "#FFE241"; /* Value used for entering and exiting nodes. Default #FFE241. */
	private _stableColor: string = "#404ABC"; /* Values used for non-exiting, non-entering nodes. Default #404ABC. */
	private _transitionDuration: number = 1000; /* Duration of transition / length of animation. Default 1000ms. */ //TODO: still need transitision timing?
	private _transitionDelay: number = 7000; /* Time between animation from standard view to exitview. Default 7000ms. */
	private _enterExitEnabled: boolean;

	/**
	 * The init method is a requirement of the __EdgeGlyphShape__ interface.
	 * 
	 * It takes an SVG selection and appends a <g> tag with class name STLineEdges.
	 * This class is used to store the line objects.
	 * @param location
	 */
	public init(location: Selection<any, {}, any, {}>): Selection<any, {}, any, {}> {
		return location.append("g").classed("STLineEdges", true);
	}

	/**
	 * The initDraw method is a requirement of the __EdgeGlyphShape__ interface.
	 * 
	 * It takes an SVG selection with entered data and creates line objects with
	 * an ID based on the source and target of the edge.
	 * @param location 
	 */
	public initDraw(location: Selection<any, Edge, any, {}>): Selection<any, Edge, any, {}> {
		let ret: Selection<any, Edge, any, {}> = location.append("line")
			.classed("STLine", true)
			.attr("id", function (d: Edge): string {
				return d.source.id + ":" + d.target.id;
			})
		return ret;
	}

	/**
	 * updateDraw takes a selection of rectangle glyphs and an SVGAttrOpts object
	 * and assigns attributes to the lines (e.g. lenghth, thickness, etc..). The
	 * method also takes a DynamicGraph and a number as required by the interface.
	 * @param glyphs 
	 * @param attr 
	 */
	public updateDraw(glyphs: Selection<any, {}, any, {}>, attrOpts: SVGAttrOpts, data: DynamicGraph, timeStampIndex: number, svgWidth: number, svgHeight: number): Selection<any, {}, any, {}> {
		let self = this;
		try {
			glyphs
				.attr("x1", function (d: Edge) { return d.source.x; })
				.attr("y1", function (d: Edge) { return d.source.y; })
				.attr("x2", function (d: Edge) { return d.target.x; })
				.attr("y2", function (d: Edge) { return d.target.y; });
		} catch (err) {
			console.log("No STLines links!");
		}

		if (this.enterExitEnabled) {
			glyphs.style("stroke", this.enterExitCheck());
		}
		else {
			glyphs.style("stroke", attrOpts.stroke_edge);
		}
		glyphs
			.attr("stroke-width", function (d: Edge): number {
				if (attrOpts.stroke_width_edge === "weight") {
					return d.weight;
				}
				return +attrOpts.stroke_width_edge;
			})
			.attr("opacity", attrOpts.opacity);
		return glyphs;
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
				console.log("STLine-->Rect");
				break;

			case "STLine":
				console.log("STLine-->STLine Catch");
				break;

			case "Gestalt":
				console.log("STLline-->Gestalt");
				break;

			default:
				console.log(targetShape.shapeType + " is undefined");
		};
		sourceG.style("display", "none");
		targetG.style("display", null);
	}
	/**
	 * The draw method is a requirement of the __EdgeGlyphShape__ interface.
	 * 
	 * The draw method takes a SVG selection to draw within, a DynamicGraph to be displayed, a timeStampIndex,
	 * and an SVGAttrOpts object to assign attributes to draw.
	 * @param location 
	 * @param data 
	 * @param timeStampIndex 
	 * @param attr 
	 */

	public draw(location: Selection<any, {}, any, {}>, data: DynamicGraph, timeStampIndex: number, attrOpts: SVGAttrOpts, svgWidth: number, svgHeight: number, enterExit: boolean = false): void {
		this.enterExitEnabled = enterExit;
		let sTLineEdges = location.selectAll("line.STLine")
			.data(data.timesteps[timeStampIndex].edges, function (d: Edge): string { return "" + d.id });
		sTLineEdges.exit().remove();
		let edgeEnter: Selection<any, Edge, any, {}> = this.initDraw(sTLineEdges.enter());
		sTLineEdges = sTLineEdges.merge(edgeEnter);
		this.updateDraw(sTLineEdges, attrOpts, data, timeStampIndex, svgWidth, svgHeight);
	}

	get shapeType(): string {
		return this._shapeType;
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
}