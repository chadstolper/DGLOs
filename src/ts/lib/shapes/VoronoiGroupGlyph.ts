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
	private _colorScheme = scaleOrdinal<string | number, string>(schemeCategory20);
	private _enterColor: string = "#00D50F"; /* Value used for initial enterNode color transition. Default #00D50F. */
	private _exitColor: string = "#D90000"; /* Value used for exitNode color transition. Default #D90000. */
	private _noiseDefaultColor = "#FFFFFF"; /* Default color of NoiseNodes. Default #FFFFFF. */
	private _transitionDuration: number = 1000; /* Duration of transition / length of animation. Default 1000ms. */
	private _transitionDelay: number = 8000; /* Time between animation from standard view to exitview. Default 8000ms. */

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
	 * Assign and/or update voronoi path attributes and draw paths. Assigns transitions for entering and exiting elements.
	 * @param paths 
	 */
	public updateDraw(paths: Selection<any, VoronoiPolygon<Node>, any, {}>, attrOpts: SVGAttrOpts, data: DynamicGraph, timeStampIndex: number, noisePoints?: Node[]): Selection<any, VoronoiPolygon<Node>, any, {}> {
		paths.style("fill", "none").attr("stroke", "none");
		let self = this;
		paths
			.style("fill", this.enterCheck(data, timeStampIndex, attrOpts.fill)).transition().on("end", function () {
				paths.transition().style("fill", function (d: VoronoiPolygon<Node>): string {
					return self.fill(d, attrOpts.fill);
				}).duration(self.transitionDuration).transition().delay(self.transitionDelay).on("end", function () {
					paths.transition().style("fill", self.exitCheck(data, timeStampIndex, attrOpts.fill)).duration(self.transitionDuration)
				});
			})
			.style("stroke", function (d: VoronoiPolygon<Node>): string { return self.fill(d, attrOpts.fill); })
		paths
			.attr("d", function (d: any): string {
				return d ? "M" + d.join("L") + "Z" : null;
			});
		return paths;
	}
	/**
	 * Check to see if the VoronoiPolygon path object will be present in the next timestep data. If not present, the path will transition
	 * to the exit color. Timestep[n] will default all data to be exitNodes. See _exitColor.
	 * @param data 
	 * @param timeStampIndex 
	 * @param key 
	 */
	private exitCheck(data: DynamicGraph, timeStampIndex: number, key: string) {
		let self = this;
		return function (d: VoronoiPolygon<Node>, i: number): string {
			if (timeStampIndex === data.timesteps.length - 1) {
				if (d.data.type === "noise") {
					return self._noiseDefaultColor;
				}
				return self._exitColor;
			}
			for (let n of data.timesteps[timeStampIndex + 1].nodes) {
				if (d.data.type === "noise") {
					return self._noiseDefaultColor;
				}
				if (d.data.origID === n.origID) {
					return self.fill(d, key);
				}
			}
			return self._exitColor;
		}
	}
	/**
	 * Check to see if the VoronoiPolygon path object was present in the previous timestep data. If not present, the path 
	 * will start as the enter color then transition to the set attribute color. Timestep[0], returns to timestep[0], and 
	 * cycles back to timestep[0] defualt to enterNodes. See _enterColor.
	 * @param data 
	 * @param timeStampIndex 
	 * @param key 
	 */
	private enterCheck(data: DynamicGraph, timeStampIndex: number, key: string) {
		let self = this;
		return function (d: VoronoiPolygon<Node>, i: number): string {
			if (timeStampIndex === 0) {
				if (d.data.type === "noise") {
					return self._noiseDefaultColor;
				}
				return self._enterColor;
			}
			for (let n of data.timesteps[timeStampIndex - 1].nodes) {
				if (d.data.type === "noise") {
					return self._noiseDefaultColor;
				}
				if (d.data.origID === n.origID) {
					return self.fill(d, key);
				}
			}
			return self._enterColor;
		}
	}
	/**
	 * Fill the VoronoiPolygon path selection color. Returns hexCode as string.
	 * @param d : current path object
	 * @param key 
	 */
	private fill(d: VoronoiPolygon<Node>, key: string) {
		if (d.data.type === "noise") {
			return this._noiseDefaultColor;
		}
		switch (key) {
			case "id":
				return this.colorScheme(d.data.origID);

			case "label":
				return this.colorScheme(d.data.label);

			case "type":
				return this.colorScheme(d.data.type);

			default:
				return key;
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
	 * Draw and create new visualizations of regions, initial update included.
	 * @param voronoiG Should be the vonornoiG
	 * @param data 
	 * @param timeStepIndex 
	 * @param attrOpts
	 * @param noisePoints
	 * @param voronoi
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
}