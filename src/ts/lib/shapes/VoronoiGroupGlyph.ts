import { NodeGlyphShape } from "../NodeGlyphInterface"
import { EdgeGlyphShape } from "../EdgeGlyphInterface";
import { GroupGlyph } from "../GroupGlyphInterface";
import { Selection } from "d3-selection";
import { DynamicGraph, Node, Edge } from "../../model/dynamicgraph";
import { SVGAttrOpts } from "../DGLOsSVG";
import { ScaleOrdinal, scaleOrdinal, schemeCategory20 } from "d3-scale";


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
	public initDraw(paths: Selection<any, {}, any, {}>, data: DynamicGraph, TimeStampIndex: number): Selection<any, {}, any, {}> {
		let ret: Selection<any, {}, any, {}> = paths.append("path")
			.classed("voronoi", true)
			.attr("id", function (d: Node): string | number { return d.id; })
		return ret;
	}

	/**
	 * Assign and/or update voronoi path attributes and draw paths
	 * @param paths 
	 */
	public updateDraw(paths: Selection<any, {}, any, {}>, attrOpts: SVGAttrOpts, data: DynamicGraph, TimeStampIndex: number): Selection<any, {}, any, {}> {
		let colorScheme = scaleOrdinal<string | number, string>(schemeCategory20);
		try {

		} catch (err) {
			console.log("No paths!");
		}
		try {
			// switch (attrOpts.fill) {
			// 	case "id":
			// 		paths
			// 			.attr("fill", function (d: Node): string {
			// 				return colorScheme(d.id);
			// 			});
			// 		break;

			// 	case "label":
			// 		paths
			// 			.attr("fill", function (d: Node): string {
			// 				return colorScheme(d.label);
			// 			});
			// 		break;

			// 	case "type":
			// 		paths
			// 			.attr("fill", function (d: Node): string {
			// 				return colorScheme(d.type);
			// 			});
			// 		break;
			// }

			// paths.attr();
		}
		catch (err) {
			console.log("attropts Circle undefined");
		}

		return paths;
	}

	/**
	 * Transform the current GroupGlyph to given GroupGlyph
	 * @param sourceSelection 
	 * @param newGroup 
	 * @param targetSelection 
	 */
	public transformTo(sourceSelection: Selection<any, {}, any, {}>, newGroup: GroupGlyph, targetSelection: Selection<any, {}, any, {}>) {
		switch (newGroup.groupType) {
			case "Label":
				console.log("Circle-->Label")
				sourceSelection.transition().style("display", "none");
				targetSelection.transition().style("display", null);
				break;

			case "Circle":
				console.log("Circle-->Circle Catch");
				sourceSelection.style("display", null);
				break;

			default: console.log("new NodeShape is undefined");
				break;
		};
	}

	/**
	 * Draw and create new visualizations of regions, initial update included
	 * @param voronoiG Should be the circleG
	 * @param data 
	 * @param timeStepIndex 
	 */
	public draw(voronoiG: Selection<any, {}, any, {}>, data: DynamicGraph, timeStepIndex: number, attrOpts: SVGAttrOpts): void {
		this.preInit();
		let voronoiPaths = voronoiG.selectAll("circle.node")
			.data(data.timesteps[timeStepIndex].nodes, function (d: Node): string { return "" + d.id });

		voronoiPaths.exit().remove();

		let voronoiEnter: Selection<any, {}, any, {}> = this.initDraw(voronoiPaths.enter(), data, timeStepIndex);

		voronoiPaths = voronoiPaths.merge(voronoiEnter);

		this.updateDraw(voronoiPaths, attrOpts, data, timeStepIndex);
	}

	get groupType(): string {
		return this._groupType;
	}
}