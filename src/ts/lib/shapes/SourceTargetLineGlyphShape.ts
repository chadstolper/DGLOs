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
	private _transitionDuration: number = 1000; /* Duration of transition / length of animation. Default 1000ms. */
	private _transitionDelay: number = 7000; /* Time between animation from standard view to exitview. Default 7000ms. */
	private _enterExitEnabled: boolean = false;

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
	 * 
	 * The DynamicGraph and number parameteres are required by the interface but are not
	 * explicitly used here.
	 * @param glyphs 
	 * @param data 
	 * @param TimeStampIndex 
	 */
	public initDraw(edges: Selection<any, Edge, any, {}>, data: DynamicGraph, TimeStampIndex: number): Selection<any, Edge, any, {}> {
		let ret: Selection<any, Edge, any, {}> = edges.append("line")
			.classed("STLine", true)
			.attr("id", function (d: Edge): string {
				return d.source.id + ":" + d.target.id;
			})
		return ret;
	}

	/**
	 * The updateDraw method is a requirement of the __EdgeGlyphShape__ interface.
	 * TODO: update description, include transitions
	 * updateDraw takes a selection of rectangle glyphs and an SVGAttrOpts object
	 * and assigns attributes to the lines (e.g. lenghth, thickness, etc..). The
	 * method also takes a DynamicGraph and a number as required by the interface.
	 * @param glyphs 
	 * @param attr 
	 * @param data 
	 * @param TimeStampIndex 
	 */
	public updateDraw(edges: Selection<any, {}, any, {}>, attrOpts: SVGAttrOpts, data: DynamicGraph, timeStampIndex: number): Selection<any, {}, any, {}> {
		let self = this;
		try {
			edges
				.attr("x1", function (d: Edge) { return d.source.x; })
				.attr("y1", function (d: Edge) { return d.source.y; })
				.attr("x2", function (d: Edge) { return d.target.x; })
				.attr("y2", function (d: Edge) { return d.target.y; });
		} catch (err) {
			console.log("No STLines links!");
		}

		if (this.enterExitEnabled) {
			edges
				.style("stroke", this.enterCheck(data, timeStampIndex, attrOpts)).transition().on("end", function () {
					edges.transition().style("stroke", attrOpts.stroke)
						.duration(self.transitionDuration).transition().on("end", function () {
							edges.transition().delay(self.transitionDelay).style("stroke", self.exitCheck(data, timeStampIndex, attrOpts)).duration(self.transitionDuration);
						});
				});
		}
		else {
			edges.style("stroke", attrOpts.stroke);
		}
		edges
			.attr("stroke-width", function (d: Edge): number {
				if (attrOpts.stroke_width === "weight") {
					return d.weight;
				}
				return +attrOpts.stroke_width;
			})
			.attr("opacity", attrOpts.opacity);
		return edges;
	}
	/**
	 * Check to see if the STLine element will be present in the next timestep data. If not present, the STLine
	 * will transition to the exit color. Timestep[n], returns to timestep[n], and
	 * cycles back to timestep[n] default to exitEdges. See _exitColor.
	 * @param data 
	 * @param timeStampIndex 
	 * @param attrOpts 
	 */
	private exitCheck(data: DynamicGraph, timeStampIndex: number, attrOpts: SVGAttrOpts) {
		let self = this;
		return function (d: Edge, i: number): string {
			if (timeStampIndex === data.timesteps.length - 1) {
				return self.exitColor;
			}
			for (let e of data.timesteps[timeStampIndex + 1].edges) {
				if (d.id === e.id) {
					return attrOpts.stroke;
				}
			}
			return self.exitColor;
		}
	}
	/**
	 * Check to see if the STLine element was present in the previos timestep data. If not present, the STLine
	 * will start as the enter color then transition to the set attribute color. Timestep[0], returns to timestep[0], and
	 * cycles back to timestep[0] defualt to enterEdges. See _enterColor.
	 * @param data 
	 * @param timeStampIndex 
	 * @param attrOpts 
	 */
	private enterCheck(data: DynamicGraph, timeStampIndex: number, attrOpts: SVGAttrOpts) {
		let self = this;
		return function (d: Edge, i: number): string {
			if (timeStampIndex === 0) {
				return self.enterColor;
			}
			for (let e of data.timesteps[timeStampIndex - 1].edges) {
				if (d.id === e.id) {
					return attrOpts.stroke;
				}
			}
			return self.enterColor;
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
	 * @param rectG 
	 * @param data 
	 * @param timeStampIndex 
	 * @param attr 
	 */
	public draw(sTLineG: Selection<any, {}, any, {}>, data: DynamicGraph, timeStampIndex: number, attrOpts: SVGAttrOpts, enterExit?: boolean): void {
		this.enterExitEnabled = enterExit;
		let sTLineEdges = sTLineG.selectAll("line.STLine")
			.data(data.timesteps[timeStampIndex].edges, function (d: Edge): string { return "" + d.id });

		sTLineEdges.exit().remove();

		let edgeEnter: Selection<any, Edge, any, {}> = this.initDraw(sTLineEdges.enter(), data, timeStampIndex);

		sTLineEdges = sTLineEdges.merge(edgeEnter);

		this.updateDraw(sTLineEdges, attrOpts, data, timeStampIndex);
	}

	get shapeType(): string {
		return this._shapeType;
	}
	set enterColor(c: string) {
		this._enterColor = c;
	}
	get enterColor(): string {
		return this._enterColor;
	}
	set exitColor(c: string) {
		this._exitColor = c;
	}
	get exitColor(): string {
		return this._exitColor;
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