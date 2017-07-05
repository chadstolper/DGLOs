import { Selection } from "d3-selection";
import { extent } from "d3-array";
import { DynamicGraph, Edge, MetaEdge, Node } from '../../model/dynamicgraph';
import { EdgeGlyphShape } from '../EdgeGlyphInterface';
import { NodeGlyphShape } from '../NodeGlyphInterface';
import { SVGAttrOpts } from '../SVGAttrOpts';
import { Shape } from './Shape';
import { ScaleOrdinal, scaleOrdinal, schemeCategory20, scaleLinear, ScaleLinear, scaleBand, ScaleBand } from "d3-scale";


/**
 * The __GestaltGlyphsShape__ class contains all of the methods required to draw and position a Gestalt Glyph on screen.
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
export class GestaltGlyphShape extends Shape implements EdgeGlyphShape {
	readonly _shapeType = "Gestalt";
	private _thicknessScale: ScaleLinear<number, number>;
	private _weightScale: ScaleLinear<number, number>;
	private readonly CELL_PADDING: number = 0.3;
	private readonly MATRIX_PADDING: number = 0.125;

	/**
 	* The init method is a requirement of the __EdgeGlyphShape__ interface.
 	* 
 	* It takes an SVG selection and appends a <g> tag with class name GestaltGlyphs.
 	* This class is used to store the Gestalt Glyph objects.
 	* @param location
 	*/
	public init(location: Selection<any, {}, any, {}>): Selection<any, {}, any, {}> {
		return location.append("g").classed("GestaltGlyphs", true);
	}
	/**
	 * The initDraw method is a requirement of the __EdgeGlyphShape__ interface.
	 * 
	 * It takes an SVG selection with entered data and creates Gestalt Glyph objects with
	 * an ID based on the source and target of the edge.
	 * 
	 * The DynamicGraph and number parameteres are required by the interface but are not
	 * explicitly used here.
	 * @param glyphs 
	 */
	public initDraw(edges: Selection<any, Edge, any, {}>): Selection<any, {}, any, {}> {
		let ret: Selection<any, Edge, any, {}> = edges.append("line")
			.classed("edgeGestalt", true)
			.attr("id", function (d: Edge): string { return d.source.label + ":" + d.target.label })
			.attr("weight", function (d: Edge): string {
				return d.weight + "";
			})
			.attr("timestep", function (e: Edge): string {
				return e.timestep + "";
			});
		return ret;
	}

	/**
	 * Assign and/or update edge attributes
	 * @param edges 
	 */
	public updateDraw(glyphs: Selection<any, {}, any, {}>, attrOpts: SVGAttrOpts, data?: DynamicGraph, timeStampIndex?: number): Selection<any, {}, any, {}> {
		let self = this;
		try {
			glyphs
				.attr("x1", function (d: Edge) {
					return d.x;
				})
				.attr("y1", function (d: Edge) {
					let yPos = 0;
					for (let edge of data.timesteps[timeStampIndex].edges) {
						if (edge.target === d.source && edge.source === d.target && edge.timestep === d.timestep) {
							let yPos = self.weightScale(d.weight);
							d.y = yPos + d.y;
							break;
						}
					}
					return yPos + d.y;
				})
				.attr("x2", function (d: Edge) {
					return d.x + (7 / 8) * (attrOpts.width / data.timesteps[timeStampIndex].nodes.length);
				})
				.attr("y2", function (d: Edge) {
					let yPos = 0
					for (let edge of data.timesteps[timeStampIndex].edges) {
						if (edge.source === d.target && edge.target === d.source && edge.timestep === d.timestep) {
							let yPos = self.weightScale(edge.weight);
							if (yPos === NaN) {
								yPos = 0;
							}
							d.y = yPos + d.y;
							break;
						}
					}
					return yPos + d.y;
				})
				.attr("stroke", attrOpts.stroke_edge)
				.attr("stroke-width", function (d: Edge) {
					return self.thicknessScale(d.weight);
				});
			return glyphs;
		}
		catch (err) {
			console.log("gestalt update error");
		}
	}

	private initScales(data: DynamicGraph, timeStampIndex: number, attrOpts: SVGAttrOpts) {
		let self = this;
		this.weightScale = scaleLinear<number>()
			.domain(this.createDomain(data.timesteps[timeStampIndex].edges))
			.range([-10, 10]);
		this.thicknessScale = scaleLinear<number>()
			.domain(this.createDomain(data.timesteps[timeStampIndex].edges))
			.range([.25, 1.5]);
		data.metaEdges.forEach(function (meta: MetaEdge) {
			//innerGlyphSpacing is a scale that spaces glyphs within their respective cells.
			let innerGlyphSpacing = scaleLinear()
				.domain(extent(Array.from(meta.edges), function (d: Edge): number { //TODO: remove magic numbers, possibly move calculations to gestaltGlyphShape class.
					return d.timestep;
				}))
				.range([self.CELL_PADDING * (attrOpts.height / data.timesteps[timeStampIndex].nodes.length),
				(1 - self.CELL_PADDING) * (attrOpts.height / data.timesteps[timeStampIndex].nodes.length)]);
			//gridScaleY calculates the yPos of the metaEdge's cell
			let gridScaleY = scaleBand<number>()
				.domain(data.timesteps[timeStampIndex].nodes.map(function (d: any) {
					return d.index;
				}))
				.range([self.MATRIX_PADDING * attrOpts.height, attrOpts.height]);
			//gridScaleX calculsates the xPos of the metaEdge's cell
			let gridScaleX = scaleBand<number>()
				.domain(data.timesteps[timeStampIndex].nodes.map(function (d: any) {
					return d.index;
				}))
				.range([self.MATRIX_PADDING * attrOpts.width, attrOpts.width]);

			meta.edges.forEach(function (e: Edge) {
				console.log(gridScaleX(e.target.index))
				console.log(gridScaleY(e.source.index))
				console.log(innerGlyphSpacing(e.timestep))
				e.x = gridScaleX(e.target.index);
				e.y = gridScaleY(e.source.index) + innerGlyphSpacing(e.timestep);
			});
		});
	}

	/**
	 * Transform the current EdgeGlyphShape to given EdgeGlyphShape
	 * @param sourceG 
	 * @param targetShape 
	 * @param targetG 
	 */
	public transformTo(sourceG: Selection<any, {}, any, {}>, targetShape: EdgeGlyphShape, targetG: Selection<any, {}, any, {}>): void {
		switch (targetShape.shapeType) {
			case "Rect":
				console.log("Gestalt-->Rect");
				break;

			case "STLine":
				console.log("Gestalt-->STLine");
				break;

			case "Gestalt":
				console.log("Gestalt-->Gestalt Catch");
				break;

			default:
				console.log("Transition from", this.shapeType, "to ", targetShape.shapeType, "is unknown.");
		}
		super.transformTo(sourceG, targetShape, targetG);
	}

	/**
	 * Draw and create new visualizations of edges, initial update included
	 * @param location
	 * @param data 
	 * @param timeStepIndex 
	 */
	public draw(location: Selection<any, {}, any, {}>, data: DynamicGraph, timeStampIndex: number, attrOpts: SVGAttrOpts): void {
		this.initScales(data, timeStampIndex, attrOpts);
		let gestaltGlyphs = location.selectAll("line.edgeGestalt")
			.data(data.timesteps[timeStampIndex].edges, function (d: Edge): string { return "" + d.id });

		gestaltGlyphs.exit().remove();

		let gestaltEnter = this.initDraw(gestaltGlyphs.enter());

		gestaltGlyphs = gestaltGlyphs.merge(gestaltEnter as Selection<any, Edge, any, {}>);

		this.updateDraw(gestaltGlyphs, attrOpts, data, timeStampIndex);
	}
	get shapeType(): string {
		return this._shapeType;
	}
	/**
 	* Create a domain based on the data and the weights of those edges in the data.
 	* @param edges 
 	*/
	public createDomain(edges: Array<Edge>) {
		return extent(edges, function (d: Edge): number {
			return d.weight;
		});
	}
	set weightScale(scale: ScaleLinear<number, number>) {
		this._weightScale = scale;
	}
	get weightScale(): ScaleLinear<number, number> {
		return this._weightScale
	}
	set thicknessScale(scale: ScaleLinear<number, number>) {
		this._thicknessScale = scale;
	}
	get thicknessScale(): ScaleLinear<number, number> {
		return this._thicknessScale;
	}
}