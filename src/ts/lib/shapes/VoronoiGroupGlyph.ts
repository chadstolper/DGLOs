import { GroupGlyph } from "../GroupGlyphInterface";
import { Selection } from "d3-selection";
import { DynamicGraph, Node } from "../../model/dynamicgraph";
import { SVGAttrOpts } from "../DGLOsSVG";
import { ScaleOrdinal, scaleOrdinal, schemeCategory20 } from "d3-scale";
import { VoronoiLayout, VoronoiPolygon } from "d3-voronoi";

export class VoronoiGroupGlyph implements GroupGlyph {
	readonly _groupType = "Voronoi";
	private _colorScheme = scaleOrdinal<string | number, string>(schemeCategory20);
	private _enterColor: string = "#00D50F"; /* Value used for initial enterNode color transition. Default #00D50F. */
	private _exitColor: string = "#D90000"; /* Value used for exitNode color transition. Default #D90000. */
	private _noiseDefaultColor = "#FFFFFF"; /* Default color of NoiseNodes. Default #FFFFFF. */
	private _enterExitColor: string = "#FFE241"; /* Value used for entering and exiting nodes. Default #FFE241. */
	private _stableColor: string = "#404ABC"; /* Values used for non-exiting, non-entering nodes. Default #404ABC. */
	private _transitionDuration: number = 1000; /* Duration of transition / length of animation. Default 1000ms. */
	private _transitionDelay: number = 7000; /* Time between animation from standard view to exitview. Default 7000ms. */
	private _enterExitEnabled: boolean;

	/**
	 * Make new <g>
	 * Make a new <g> tag for the voronoi path glyphs to be created. Returns Selection <g> classed VoronoiPaths.
	 * @param location
	 */
	public init(location: Selection<any, {}, any, {}>): Selection<any, {}, any, {}> {
		return location.append("g").classed("VoronoiPaths", true);
	}

	/**
	 * Creates selection of paths. Returns new selection.
	 * @param location
	 */
	public initDraw(location: Selection<any, VoronoiPolygon<Node>, any, {}>): Selection<any, VoronoiPolygon<Node>, any, {}> {
		let ret: Selection<any, VoronoiPolygon<Node>, any, {}> = location.insert("path")
			.classed("voronoi", true)
			.attr("id", function (d: VoronoiPolygon<Node>): string | number {
				try {
					return d.data.id;
				}
				catch (err) {
					// console.log(err);
				}
			});
		return ret;
	}

	/**
	 * Assign and/or update voronoi path attributes and draw paths. Assigns coloring for entering and exiting elements.
	 * @param glyphs
	 * @param attrOpts
	 */
	public updateDraw(glyphs: Selection<any, VoronoiPolygon<Node>, any, {}>, attrOpts: SVGAttrOpts): Selection<any, VoronoiPolygon<Node>, any, {}> {
		glyphs.style("fill", "none").attr("stroke", "none");
		let self = this;
		if (this.enterExitEnabled) {
			glyphs
				.style("fill", this.enterExitCheck())
				.style("stroke", this.enterExitCheck());
		}
		else {
			glyphs
				.style("fill", function (d: VoronoiPolygon<Node>): string { return self.fill(d, attrOpts.fill); })
				.style("stroke", function (d: VoronoiPolygon<Node>): string { return self.fill(d, attrOpts.fill); });
		}
		glyphs
			.attr("d", function (d: any): string {
				return d ? "M" + d.join("L") + "Z" : null;
			});
		return glyphs;
	}
	/**
	* Returns the correct color relating to the Enter/Exit of data in each timestep.
	* Green: Node entering and present in next timestep; Red: Node was present already and exiting;
	* Yellow: Node entering and exiting in same timestep; Blue: Node present in previous and next timestep.
	*/
	private enterExitCheck() {
		let self = this;
		return function (d: VoronoiPolygon<Node>): string {
			if (d.data.type === "noise") {
				return self.noiseColor;
			}
			if (d.data.isEnter) {
				if (d.data.isExit) {
					return self.enterExitColor;
				}
				return self.enterColor;
			}
			else {
				if (d.data.isExit) {
					return self.exitColor;
				}
				return self.stableColor;
			}
		}
	}
	/**
	 * Fill the VoronoiPolygon path selection color. Returns hexCode as string.
	 * @param d : current path object
	 * @param key 
	 */
	private fill(d: VoronoiPolygon<Node>, key: string) {
		try {
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
		catch (err) {
			// console.log(d, err);
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
	 * Method draws current timestep of Nodes with data. Enter/update/exit included. Draw update for visualization included.
	 * @param location location of glyphs
	 * @param data 
	 * @param timeStepIndex 
	 * @param attrOpts
	 * @param noisePoints
	 * @param voronoi
	 */
	public draw(location: Selection<any, Node, any, {}>, data: DynamicGraph, timeStepIndex: number, attrOpts: SVGAttrOpts, noisePoints: Node[], voronoi: VoronoiLayout<Node>, enterExit: boolean = false): void {
		this.enterExitEnabled = enterExit;
		let vData = voronoi.polygons(data.timesteps[timeStepIndex].nodes.concat(noisePoints));
		let voronoiPaths: Selection<any, VoronoiPolygon<Node>, any, {}> = location.selectAll("path.voronoi")
			.data(vData, function (d: VoronoiPolygon<Node>, i: number): string {
				let ret: string;
				try {
					ret = "" + d.data.id;
					return ret;
				} catch (err) {
					// console.log(err);
				}
				return "empty";
			});

		voronoiPaths.exit().remove();

		let voronoiEnter: Selection<any, VoronoiPolygon<Node>, any, {}> = this.initDraw(voronoiPaths.enter());

		voronoiPaths = voronoiPaths.merge(voronoiEnter);

		this.updateDraw(voronoiPaths, attrOpts);
	}

	get groupType(): string {
		return this._groupType;
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
	set noiseColor(color: string) {
		this._noiseDefaultColor = color;
	}
	get noiseColor(): string {
		return this._noiseDefaultColor;
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