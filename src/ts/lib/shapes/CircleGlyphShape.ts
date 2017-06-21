import { NodeGlyphShape } from "../NodeGlyphInterface"
import { EdgeGlyphShape } from "../EdgeGlyphInterface";
import { Selection } from "d3-selection";
import { DynamicGraph, Node, Edge } from "../../model/dynamicgraph";
import { SVGAttrOpts, DGLOsSVG } from "../DGLOsSVG";
import { Shape } from "./Shape"

import { ScaleOrdinal, scaleOrdinal, schemeCategory20 } from "d3-scale";
import "d3-transition";

export class CircleGlyphShape extends Shape implements NodeGlyphShape {
	readonly _shapeType = "Circle";
	private _colorScheme = scaleOrdinal<string | number, string>(schemeCategory20);
	private _enterColor: string = "#00D50F"; /* Value used for initial enterNode color transition. Default #00D50F. */
	private _exitColor: string = "#D90000"; /* Value used for exitNode color transition. Default #D90000. */
	private _transitionDuration: number = 1000; /* Duration of transition / length of animation. Default 1000ms. */
	private _transitionDelay: number = 7000; /* Time between animation from standard view to exitview. Default 7000ms. */
	private _enterExitEnabled: boolean = false;

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
	public initDraw(glyphs: Selection<any, Node, any, {}>, data: DynamicGraph, TimeStampIndex: number, ): Selection<any, Node, any, {}> {
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
	 * Assign and/or update node circle attributes and (cx,cy) positions. Assigns enter and exit transitions.
	 * @param glyphs 
	 */
	public updateDraw(glyphs: Selection<any, {}, any, {}>, attrOpts: SVGAttrOpts, data: DynamicGraph, timeStampIndex: number): Selection<any, {}, any, {}> {
		let self = this;
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
		let n = 0;
		if (this.enterExitEnabled) {
			glyphs
				.style("fill", this.enterCheck(data, timeStampIndex, attrOpts.fill))
				.transition()
				.on("end", function () {
					glyphs
						// .transition()
						.style("fill", self.timeCheck(data, timeStampIndex, attrOpts.fill))
					// .duration(this.transitionDuration);
				})

			// glyphs
			// 	.style("fill", this.enterCheck(data, timeStampIndex, attrOpts.fill))
			// 	.transition().on("end", function () {
			// 		// n++;
			// 		glyphs.transition().style("fill", function (d: Node): string {
			// 			// n++;
			// 			// console.log(n);
			// 			return self.fill(d, attrOpts.fill);
			// 		}).duration(self.transitionDuration)
			// 			.on("end", function () {
			// 				// n++;
			// 				// console.log(n);
			// 				glyphs.transition()
			// 				.delay(self.transitionDelay)
			// 				.style("fill", self.exitCheck(data, timeStampIndex, attrOpts.fill))
			// 				.duration(self.transitionDuration);
			// 			});
			// 	});
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
	private timeCheck(data: DynamicGraph, timeStampIndex: number, key: string) {
		let self = this;
		return function (d: Node, i: number): string {
			if (timeStampIndex === 0) {//timestep 0
				for (let n of data.timesteps[timeStampIndex + 1].nodes) {
					if (d.origID === n.origID) //check if entering and staying
					{
						return self.enterColor; //green
					}
				}
				//else entering and leaving
				return "yellow";
			}
			if (timeStampIndex === data.timesteps.length - 1) { //timestep n
				for (let n of data.timesteps[timeStampIndex - 1].nodes) {
					if (d.origID === n.origID)// been and leaving
					{
						return self.exitColor;
					}
				}
				//else entering and leaving
				return "yellow";
			}
			for (let i of data.timesteps[timeStampIndex - 1].nodes) {
				for (let j of data.timesteps[timeStampIndex + 1].nodes) {
					if (d.origID === i.origID && d.origID === j.origID) //been and leaving
					{
						return self.exitColor;
					}
					if (d.origID !== j.origID && d.origID === i.origID) { //entering and leaving
						return "yellow";
					}
					if (d.origID === j.origID && !(d.origID === i.origID)) //been and staying
					{
						return "blue";
					}
				}
			}
			return self.enterColor;
		}
	}


	/**
 * Check to see if the CircleGlyph object will be present in the next timestep data. If not present, the CircleGlyph will transition
 * to the exit color. Timestep[n] will default all data to be exitNodes. See _exitColor.
 * @param data 
 * @param timeStampIndex 
 * @param key 
 */
	private exitCheck(data: DynamicGraph, timeStampIndex: number, key: string) {
		let self = this;
		return function (d: Node, i: number): string {
			if (timeStampIndex === data.timesteps.length - 1) {
				return self.exitColor;
			}
			for (let n of data.timesteps[timeStampIndex + 1].nodes) {
				if (d.origID === n.origID) {
					return self.fill(d, key);
				}
			}
			return self.exitColor;
		}
	}
	/**
	 * Check to see if the VoronoiPolygon path object was present in the previous timestep data. If not present, the path 
	 * will start as the enter color then transition to the set attribute color. Timestep[0], returns to timestep[0], and 
	 * cycles back to timestep[0] default to enterNodes. See _enterColor.
	 * @param data 
	 * @param timeStampIndex 
	 * @param key 
	 */
	private enterCheck(data: DynamicGraph, timeStampIndex: number, key: string) {
		let self = this;
		return function (d: Node, i: number): string {
			if (timeStampIndex === 0) {
				return self.enterColor;
			}
			for (let n of data.timesteps[timeStampIndex - 1].nodes) {
				if (d.origID === n.origID) {
					return "blue";
				}
			}
			return self.enterColor;
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
	public draw(circleG: Selection<any, {}, any, {}>, data: DynamicGraph, timeStepIndex: number, attrOpts: SVGAttrOpts, enterExit?: boolean): void {
		this.enterExitEnabled = enterExit;
		let circleGlyphs = circleG.selectAll("circle.node")
			.data(data.timesteps[timeStepIndex].nodes, function (d: Node): string { return "" + d.id });

		circleGlyphs.exit().remove();

		let circleEnter: Selection<any, Node, any, {}> = this.initDraw(circleGlyphs.enter(), data, timeStepIndex);

		circleGlyphs = circleGlyphs.merge(circleEnter);

		this.updateDraw(circleGlyphs, attrOpts, data, timeStepIndex);
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