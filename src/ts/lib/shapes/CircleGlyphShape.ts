import { NodeGlyphShape } from "../NodeGlyphInterface"
import { EdgeGlyphShape } from "../EdgeGlyphInterface";
import { Selection } from "d3-selection";
import { DynamicGraph, Node, Edge } from "../../model/dynamicgraph";

import { ScaleOrdinal, scaleOrdinal, schemeCategory20 } from "d3-scale";


export class CircleGlyphShape implements NodeGlyphShape {
	readonly _shapeType = "Circle";
	private _radius: number = 10;
	private _fill: string;
	private _stroke: string = "grey";
	private _stroke_width: number = 2;

	constructor(radius: number, fill: string, stroke: string, strokeWidth: number) {
		this._radius = radius;
		this._fill = fill;
		this._stroke = stroke;
		this._stroke_width = strokeWidth;
	}

	/**
	 * Make new <g>
	 * @param location
	 */
	public init(location: Selection<any, {}, any, {}>): Selection<any, {}, any, {}> {
		//console.log("init start")
		return location.append("g").classed("CircleNodes", true);
		//console.log("init finished")
	}

	/**
	 * Create selection of nodes. Returns new selection
	 * @param glyphs
	 */
	public initDraw(glyphs: Selection<any, Node, any, {}>): Selection<any, Node, any, {}> {
		let ret: Selection<any, Node, any, {}> = glyphs.append("circle")
			.classed("node", true)
			.attr("id", function (d: Node): string | number { return d.id; }) //TODO: Test return id or label?
			.attr("r", 10) //TODO: Remove
			.attr("fill", "purple"); //TODO: remove
		return ret;
	}

	/**
	 * Assign and/or update node circle data and (cx,cy) positions
	 * @param glyphs 
	 */
	public updateDraw(glyphs: Selection<any, {}, any, {}>): Selection<any, {}, any, {}> {
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
				console.log("Circle-->Label")
				sourceSelection.transition().style("display", "none");
				targetSelection.transition().style("display", null);
				break;

			case "Circle":
				console.log("Circle-->Circle Catch");
				sourceSelection.style("display", null)
				break;

			default: console.log("new NodeShape is undefined");
				break;
		};
	}

	/**
	 * Draw and create new visualizations of nodes, initial update included
	 * @param circleG Should be the circleG
	 * @param data 
	 * @param timeStepIndex 
	 */
	public draw(circleG: Selection<any, {}, any, {}>, data: DynamicGraph, timeStepIndex: number): void {
		let circleGlyphs = circleG.selectAll("circle.node")
			.data(data.timesteps[timeStepIndex].nodes, function (d: Node): string { return "" + d.id });

		circleGlyphs.exit().remove();

		let circleEnter: Selection<any, Node, any, {}> = this.initDraw(circleGlyphs.enter());
		circleGlyphs = circleGlyphs.merge(circleEnter);
		circleGlyphs.call(this.updateDraw);
	}



	get radius(): number {
		return this._radius;
	}

	set radius(radius: number) {
		this._radius = radius;
	}

	get fill(): string {
		return this._fill;
	}

	set fill(fill: string) {
		this._fill = fill;
	}

	get stroke(): string {
		return this._stroke;
	}

	set stroke(stroke: string) {
		this._stroke = stroke;
	}

	get stroke_width(): number {
		return this._stroke_width;
	}

	set stroke_width(stroke_width: number) {
		this._stroke_width = stroke_width;
	}

	get shapeType(): string {
		return this._shapeType;
	}
}