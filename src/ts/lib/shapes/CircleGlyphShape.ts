import { NodeGlyphShape } from "../NodeGlyphInterface"
import { EdgeGlyphShape } from "../EdgeGlyphInterface";
import { Selection } from "d3-selection";
import { DynamicGraph, Node, Edge } from "../../model/dynamicgraph";
import { SVGAttrOpts, DGLOsSVG } from "../DGLOsSVG";
import { Shape } from "./Shape"
import { ScaleOrdinal, scaleOrdinal, scalePoint, schemeCategory20 } from "d3-scale";
import "d3-transition";

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
	 * Make new <g>
	 * @param location
	 */
	public init(location: Selection<any, {}, any, {}>): Selection<any, {}, any, {}> {
		return location.append("g").classed("CircleNodes", true)
	}

	/**
	 * Create selection of nodes. Returns new selection
	 * @param glyphs
	 */
	public initDraw(glyphs: Selection<any, Node, any, {}>): Selection<any, Node, any, {}> {
		let self = this;
		let ret: Selection<any, Node, any, {}> = glyphs.append("circle")
			.classed("node", true)
			.attr("id", function (d: Node): string | number { return d.id; })
			.on("click", function (d: Node) {
				if (self.lib.onClickRedraw) {
					self.lib.setCenterNode(d.origID);
				}
			});
		return ret;
	}

	/**
	 * Assign and/or update node circle attributes and (cx,cy) positions. Assigns enter and exit coloring.
	 * @param glyphs 
	 */
	public updateDraw(glyphs: Selection<any, {}, any, {}>, attrOpts: SVGAttrOpts, data: DynamicGraph, timeStampIndex: number, labelYAxis?: boolean): Selection<any, {}, any, {}> {
		let self = this;
		if (labelYAxis === undefined) {
			labelYAxis = true;
		}
		if (labelYAxis) {
			let yAxisScale = scalePoint<number>()
				.domain(data.timesteps[timeStampIndex].nodes.map(function (d) { return d.index }))
				.range([attrOpts.height / 8, attrOpts.height])
				.padding(0.5);
			try {
				glyphs
					.text(function (d: Node): string {
						return d.label;
					});
				glyphs
					.attr("cx", function (d: Node) {
						d.x = attrOpts.width / 8 - (3 * attrOpts.width / 100);
						return attrOpts.width / 8 - (3 * attrOpts.width / 100);
					})
					.attr("cy", function (d: Node) {
						d.y = yAxisScale(d.index);
						return yAxisScale(d.index);
					});
			} catch (err) {
				console.log("No label nodes!");
			}
		} else {
			let xAxisScale = scalePoint<number>()
				.domain(data.timesteps[timeStampIndex].nodes.map(function (d) { return d.index }))
				.range([attrOpts.width / 8, attrOpts.width])
				.padding(0.5);
			try {
				glyphs
					.text(function (d: Node): string {
						return d.label;
					});
				glyphs
					.attr("cx", function (d: Node) {
						d.x = xAxisScale(d.index);
						return xAxisScale(d.index);
					})
					.attr("cy", function (d: Node) {
						d.y = attrOpts.height / 8 - (3 * attrOpts.height / 100);
						return attrOpts.height / 8 - (3 * attrOpts.height / 100);
					});
			} catch (err) {
				console.log("No label nodes!");
			}
		}
		if (this.enterExitEnabled) {
			glyphs.style("fill", this.enterExitCheck());
		}
		else {
			// glyphs.style("fill", function (d: Node): string {
			// 	return self.fill(d, attrOpts.fill);
			// });
			glyphs
				.attr("fill", "id");
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
	 * Green: Node entering and present in next timestep; Red: Node was present already and exiting;
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
	 * Fill the CircleGlyph selection color. Returns hexCode as string.
	 * @param d : current CircleGlyph
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
	 * @param circleG Should be the circleG
	 * @param data 
	 * @param timeStepIndex 
	 */
	public draw(circleG: Selection<any, {}, any, {}>, data: DynamicGraph, timeStepIndex: number, attrOpts: SVGAttrOpts, enterExit: boolean = false): void {
		this.enterExitEnabled = enterExit;
		let circleGlyphs = circleG.selectAll("circle.node.side")
			.data(data.timesteps[timeStepIndex].nodes, function (d: Node): string { return "" + d.id });

		circleGlyphs.exit().remove();

		if (true) {
			let copySet = circleG.selectAll("circle.node.top")
				.data(data.timesteps[timeStepIndex].nodes, function (d: Node): string { return "" + d.id });
			copySet.exit().remove();
			let enterCircle: Selection<any, Node, any, {}> = this.initDraw(copySet.enter());
			copySet = copySet.merge(enterCircle);
			this.updateDraw(copySet, attrOpts, data, timeStepIndex, false);
		}

		let circleEnter: Selection<any, Node, any, {}> = this.initDraw(circleGlyphs.enter());

		circleGlyphs = circleGlyphs.merge(circleEnter);

		this.updateDraw(circleGlyphs, attrOpts, data, timeStepIndex, true);
	}

	get shapeType(): string {
		return this._shapeType;
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
	set enterExitColor(c: string) {
		this._enterExitColor = c;
	}
	get enterExitColor(): string {
		return this._enterExitColor;
	}
	set stableColor(c: string) {
		this._stableColor = c;
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