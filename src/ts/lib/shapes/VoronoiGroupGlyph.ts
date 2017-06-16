import { NodeGlyphShape } from "../NodeGlyphInterface"
import { EdgeGlyphShape } from "../EdgeGlyphInterface";
import { GroupGlyph } from "../GroupGlyphInterface";
import { Selection } from "d3-selection";
import { DynamicGraph, Node, Edge } from "../../model/dynamicgraph";
import { SVGAttrOpts } from "../DGLOsSVG";
import { ScaleOrdinal, scaleOrdinal, schemeCategory20 } from "d3-scale";
import { VoronoiLayout, VoronoiPolygon } from "d3-voronoi";


export class VoronoiGroupGlyph implements GroupGlyph {
	readonly _groupType = "Voronoi";

	/**
	 * Make new <g>
	 * @param location
	 */
	public init(location: Selection<any, {}, any, {}>): Selection<any, {}, any, {}> {
		return location.append("g").classed("VoronoiPaths", true);
	}

	/**
	 * Create selection of paths. Returns new selection
	 * @param paths
	 */
	public initDraw(paths: Selection<any, VoronoiPolygon<Node>, any, {}>, data: DynamicGraph, TimeStampIndex: number): Selection<any, VoronoiPolygon<Node>, any, {}> {
		let ret: Selection<any, VoronoiPolygon<Node>, any, {}> = paths.insert("path")
			.classed("voronoi", true)
			.attr("id", function (d: VoronoiPolygon<Node>): string | number { return d.data.id; })
		return ret;
	}

	/**
	 * Assign and/or update voronoi path attributes and draw paths
	 * @param paths 
	 */
	public updateDraw(paths: Selection<any, VoronoiPolygon<Node>, any, {}>, attrOpts: SVGAttrOpts, data: DynamicGraph, timeStampIndex: number, noisePoints?: Node[]): Selection<any, VoronoiPolygon<Node>, any, {}> {
		let colorScheme = scaleOrdinal<string | number, string>(schemeCategory20);
		try {
			paths.attr("fill", "none").attr("stroke", "none");
			switch (attrOpts.fill) {
				case "id":
					paths
						.attr("fill", this.fill(data, timeStampIndex, noisePoints, "id"))
						.attr("stroke", this.fill(data, timeStampIndex, noisePoints, "id"));
					break;

				case "label":
					paths
						.attr("fill", this.fill(data, timeStampIndex, noisePoints, "label"))
						.attr("stroke", this.fill(data, timeStampIndex, noisePoints, "label"));
					break;

				case "type":
					paths
						.attr("fill", this.fill(data, timeStampIndex, noisePoints, "type"))
						.attr("stroke", this.fill(data, timeStampIndex, noisePoints, "type"));
					break;
			}
		}
		catch (err) {
			console.log("attrOpts undefined");
		}
		try {
			paths
				.attr("d", function (d: any): string {
					return d ? "M" + d.join("L") + "Z" : null;
				});
		} catch (err) {
			console.log("No paths!");
		}

		return paths;
	}
	//TODO: figure out how to parse
	private fill(data: DynamicGraph, timeStampIndex: number, noisePoints: Node[], key: string) {
		let colorScheme = scaleOrdinal<string | number, string>(schemeCategory20);
		switch (key) {
			case "id":
				return function (d: VoronoiPolygon<Node>, i: number): string {
					if (d.data.type === "noise") {
						return "white";
					}
					return colorScheme(d.data.id);
				}

			case "label":
				return function (d: VoronoiPolygon<Node>, i: number): string {
					if (d.data.type === "noise") {
						return "white";
					}
					return colorScheme(d.data.label);
				}

			case "type":
				return function (d: VoronoiPolygon<Node>, i: number): string {
					if (d.data.type === "noise") {
						return "white";
					}
					return colorScheme(d.data.type);
				}
		}
	}

	/**
	 * Transform the current GroupGlyph to given GroupGlyph
	 * @param sourceSelection 
	 * @param newGroup 
	 * @param targetSelection 
	 */
	public transformTo(sourceSelection: Selection<any, {}, any, {}>, newGroup: GroupGlyph, targetSelection: Selection<any, {}, any, {}>) {
		switch (newGroup.groupType) {
			case "Voronoi":
				console.log("Voronoi-->Voronoi Catch");
				break;

			default: console.log("new NodeShape is undefined");
				break;
		};
		sourceSelection.transition().style("display", "none");
		targetSelection.transition().style("display", null);
	}

	/**
	 * Draw and create new visualizations of regions, initial update included
	 * @param voronoiG Should be the vonornoiG
	 * @param data 
	 * @param timeStepIndex 
	 */
	public draw(voronoiG: Selection<any, Node, any, {}>, data: DynamicGraph, timeStepIndex: number, attrOpts: SVGAttrOpts, noisePoints: Node[], voronoi: VoronoiLayout<Node>): void {
		let vData = voronoi.polygons(data.timesteps[timeStepIndex].nodes.concat(noisePoints));
		let voronoiPaths: Selection<any, VoronoiPolygon<Node>, any, {}> = voronoiG.selectAll("path.voronoi")
			.data(vData, function (d: VoronoiPolygon<Node>, i: number): string {
				let ret: string;
				try {
					ret = "" + d.data.id;
					return ret;
				} catch (err) {
					// console.log(i, vData);
					// throw err;
				}
				return "empty";
			});

		voronoiPaths.exit().remove();

		let voronoiEnter: Selection<any, VoronoiPolygon<Node>, any, {}> = this.initDraw(voronoiPaths.enter(), data, timeStepIndex);

		voronoiPaths = voronoiPaths.merge(voronoiEnter);

		this.updateDraw(voronoiPaths, attrOpts, data, timeStepIndex, noisePoints);
	}

	get groupType(): string {
		return this._groupType;
	}
}