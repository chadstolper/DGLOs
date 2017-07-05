import { NodeGlyphShape } from "../NodeGlyphInterface"
import { EdgeGlyphShape } from "../EdgeGlyphInterface";
import { Selection } from "d3-selection";
import { DynamicGraph, Node, Edge } from "../../model/dynamicgraph";
import { DGLOsSVG } from "../DGLOsSVG";
import { SVGAttrOpts } from "../SVGAttrOpts";
import { Shape } from "./Shape"
import { ScaleOrdinal, scaleOrdinal, scalePoint, schemeCategory20 } from "d3-scale";
import "d3-transition";
import { interpolate, toCircle } from "flubber";

export class CircleGlyphShape extends Shape implements NodeGlyphShape {
	readonly _shapeType = "Circle";
	private _colorScheme = scaleOrdinal<string | number, string>(schemeCategory20);
	private _enterColor: string = "#00D50F"; /* Value used for entering and non-exiting nodes. Default #00D50F. */
	private _exitColor: string = "#D90000"; /* Value used for non-entering and exiting nodes. Default #D90000. */
	private _enterExitColor: string = "#FFE241"; /* Value used for entering and exiting nodes. Default #FFE241. */
	private _stableColor: string = "#404ABC"; /* Values used for non-exiting, non-entering nodes. Default #404ABC. */
	private _transitionDuration: number = 1000; /* Duration of transition / length of animation. Default 1000ms. */
	private _transitionDelay: number = 7000; /* Time between animation from standard view to exitview. Default 7000ms. */
	private _enterExitEnabled: boolean;

	/**
	 * Make a new <g> tag for the circle path glyphs to be created. Returns Selection <g> classed CircleNodes.
	 * @param location
	 */
	public init(location: Selection<any, {}, any, {}>): Selection<any, {}, any, {}> {
		return location.append("g").classed("CircleNodes", true)
	}

	/**
	 * Create a new Selection of circle path DOM elements and returns the Selection.
	 * @param location
	 */
	public initDraw(location: Selection<any, Node, any, {}>): Selection<any, Node, any, {}> {
		let self = this;
		let ret: Selection<any, Node, any, {}> = location.append("path")
			.classed("node", true)
			.attr("id", function (d: Node): string | number { return d.id; })
			.on("click", function (d: Node) {
				if (self.lib.centralNodesEnabled) {
					self.lib.setCenterNode(d.origID);
				}
			});
		return ret;
	}
	/**
	 * Updates the circle path shape Selection to correct simulation positions. Color fill and other attributes handled. Returns updated Selection
	 * @param glyphs 
	 * @param attrOpts
	 */
	public updateDraw(glyphs: Selection<any, {}, any, {}>, attrOpts: SVGAttrOpts): Selection<any, {}, any, {}> {
		let self = this;
		glyphs
			.attr("d", function (d: Node) {
				return self.circlePath(d.x, d.y, attrOpts.radius);
			})
		if (attrOpts.fill === "enterExit") {
			glyphs.style("fill", this.enterExitCheck());
		}
		else {
			glyphs.style("fill", function (d: Node): string {
				return self.fill(d, attrOpts.fill);
			});
		}
		glyphs
			.style("stroke", attrOpts.stroke)
			.attr("r", attrOpts.radius)
			.attr("stroke-width", attrOpts.stroke_width)
			.style("opacity", attrOpts.opacity);
		return glyphs;
	}
	/**
	 * Returns the correct color relating to the Enter/Exit of data in each timestep.
	 * Green: Node entering and present in next timestep; Red: Node present in previous timestep and exiting;
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
			else { //isEnter=false
				if (d.isExit) {
					return self.exitColor;
				}
				return self.stableColor;
			}
		}
	}
	/**
	 * Returns the corresponding color based on passed attribute's fill parameter. Returns hexCode as string.
	 * @param d
	 * @param key 
	 */
	private fill(d: Node, key: string) {
		switch (key) {
			case "id":
				return this.colorScheme(d.origID);
			case "label":
				return this.colorScheme(d.label);
			case "type":
				return this.colorScheme(d.type);
			default:
				return key;
		}
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
				//TODO: add a transition
				break;
			case "Circle":
				//TODO: add a transition
				break;
			case "Gestalt":
				//TODO: add a transition
				break;
			default: console.log("new NodeShape is undefined");
				break;
		};
		//console.log("Circle --> " + shape.shapeType)
		super.transformTo(sourceSelection, null, targetSelection);
	}

	/**
	 * Draw and create new visualizations of nodes, initial update included
	 * @param location
	 * @param data 
	 * @param timeStepIndex 
	 * @param attrOpts
	 * @param enterExit
	 */
	public draw(circleG: Selection<any, {}, any, {}>, data: DynamicGraph, timeStepIndex: number, attrOpts: SVGAttrOpts, duplicateNodes?: boolean, enterExit: boolean = false): void {
		this.enterExitEnabled = enterExit;
		let circleGlyphs = circleG.selectAll("path.node")
			.data(data.timesteps[timeStepIndex].nodes, function (d: Node) { return d.id + "" });
		circleGlyphs.exit().remove();
		if (duplicateNodes === undefined) {
			let circleEnter: Selection<any, Node, any, {}> = this.initDraw(circleGlyphs.enter());
			circleGlyphs = circleGlyphs.merge(circleEnter);
			this.updateDraw(circleGlyphs, attrOpts);
		} else {
			if (duplicateNodes) {
				let copySet = circleG.selectAll("path.node.top")
					.data(data.timesteps[timeStepIndex].nodes, function (d: Node): string { return "" + d.id });
				copySet.exit().remove();
				let copyEnter: Selection<any, Node, any, {}> = this.initDraw(copySet.enter());
				copySet = copySet.merge(copyEnter);
				this.updateDraw(copySet, attrOpts);
			}
			let circleEnter: Selection<any, Node, any, {}> = this.initDraw(circleGlyphs.enter());
			circleGlyphs = circleGlyphs.merge(circleEnter);
			this.updateDraw(circleGlyphs, attrOpts);
		}


	}
	/**
	 * Returns the circle path of the Node by calculating two arcs, one starting at the endpoint of the first and returning.
	 * https://stackoverflow.com/questions/5737975/circle-drawing-with-svgs-arc-path
	 */
	private circlePath(cx: number, cy: number, r: number) {
		return 'M ' + cx + ' ' + cy + ' m -' + r + ', 0 a ' + r + ',' + r + ' 0 1,0 ' + (r * 2) + ',0 a ' + r + ',' + r + ' 0 1,0 -' + (r * 2) + ',0';
	}

	/**
	 * Returns the shape path as a string of the current circle shape.
	 * @param d 
	 * @param attr 
	 */
	public getPath(d: Node, attr: SVGAttrOpts) {
		let r = attr.radius;
		return 'M ' + d.x + ' ' + d.y + ' m -' + r + ', 0 a ' + r + ',' + r + ' 0 1,0 ' + (r * 2) + ',0 a ' + r + ',' + r + ' 0 1,0 -' + (r * 2) + ',0';
	}

	get shapeType(): string {
		return this._shapeType;
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
	//TODO: transistions needed?
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