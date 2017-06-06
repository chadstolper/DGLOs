import { DGLOsSVGBaseClass } from "./DGLOsSVGBaseClass";
import { Selection } from "d3-selection";
import { Node, Edge } from "../model/dynamicgraph";
import { ScaleOrdinal, scaleOrdinal, schemeCategory20 } from "d3-scale";
import * as d3force from "d3-force";
import { Simulation } from "d3-force";
import { NodeGlyphShape } from "./NodeGlyphInterface";
import { EdgeGlyphShape } from "./EdgeGlyphInterface";
import { CircleGlyphShape, SourceTargetLineGlyphShape, LabelGlyphShape } from "./shapeClasses";
import { DGLOsSVGCombined } from "./DGLOsSVGCombined";
import { SVGAttrOpts } from "./DGLOsSVG";
import { DGLOsWill } from "./DGLOsWill";

export class DGLOsMatt extends DGLOsSVGCombined {

	protected _labelGlyphShape = new LabelGlyphShape(null, null);
	protected _circleGlyphShape = new CircleGlyphShape(null, null, null, null);

	public drawNodeGlyphs() {

		this._currentEdgeShape = new SourceTargetLineGlyphShape("black", 1); //need to make specific?
		this._currentNodeShape = this._labelGlyphShape;

		//create "g" group for nodes; parent "g"
		if (this._nodeG === undefined) {
			this._nodeG = this.loc.append("g").classed("nodeG", true)
		}

		//create child "g" in parent for NodeGlyphs
		let nodeLabelG: Selection<any, {}, any, {}> = this._labelGlyphShape.init(this._nodeG); //replace with call to the library's instance of the shape
		let nodeCircleG: Selection<any, {}, any, {}> = this._circleGlyphShape.init(this._nodeG); //replace with call to the library's instance of the shape

		nodeLabelG.style("display", "none");
		nodeCircleG.style("display", "none");

		//add nodes to new map
		this._nodeGlyphs.set(this._labelGlyphShape, nodeLabelG); //need to update later
		this._nodeGlyphs.set(this._circleGlyphShape, nodeCircleG); //need to update later
	}

	public transformNodeGlyphsTo(shape: NodeGlyphShape | any) {
		if (this._currentNodeShape.shapeType === "Label") {
			this._currentNodeShape.transformTo(this._nodeGlyphs.get(this._labelGlyphShape), shape, this._nodeGlyphs.get(this._circleGlyphShape));
			this._currentNodeShape = this._circleGlyphShape;
		}
		else {
			this._currentNodeShape.transformTo(this._nodeGlyphs.get(this._circleGlyphShape), shape, this._nodeGlyphs.get(this._labelGlyphShape));
			this._currentNodeShape = this._labelGlyphShape;
		}
	}

	public setNodeGlyphAttrs(attr: SVGAttrOpts) {
		let color = this._colorScheme; //because scope issues
		this._nodeCircleGlyphs
			.attr("fill", function (d: Node): string {
				return color(d.id);
			})
			.attr("stroke", attr.stroke)
			.attr("r", attr.radius)
			.attr("stroke-width", attr.stroke_width)
			.attr("width", attr.width)
			.attr("height", attr.height)
			.attr("opacity", attr.opacity);
	}

	public setEdgeGlyphAttrs(attr: SVGAttrOpts) {
		console.log(this._currentEdgeShape)
		if (this._currentEdgeShape.shapeType === "STLine") {
			this._edgeLineGlyphs
				.attr("fill", attr.fill)
				.attr("stroke", attr.stroke)
				.attr("r", attr.radius)
				.attr("stroke-width", attr.stroke_width)
				.attr("width", attr.width)
				.attr("height", attr.height)
				.attr("opacity", attr.opacity);
		} else if (this._currentEdgeShape.shapeType === "Rect") {
			this._edgeRectGlyphs
				.attr("fill", attr.fill)
				.attr("stroke", attr.stroke)
				.attr("r", attr.radius)
				.attr("stroke-width", attr.stroke_width)
				.attr("width", attr.width)
				.attr("height", attr.height)
				.attr("opacity", attr.opacity);
		} else if (this._currentEdgeShape.shapeType === "Gestalt") {
			this._edgeGestaltGlyphs
				.attr("fill", attr.fill)
				.attr("stroke", attr.stroke)
				.attr("r", attr.radius)
				.attr("stroke-width", attr.stroke_width)
				.attr("width", attr.width)
				.attr("height", attr.height)
				.attr("opacity", attr.opacity);
		}
	}

	public runSimulation() {

		//Check simulation exists
		if (this._simulation === undefined) {
			this._simulation = d3force.forceSimulation()
				.force("link", d3force.forceLink().id(function (d: Node): string { return "" + d.id })) //Pull applied to EdgeGlyphs
				.force("charge", d3force.forceManyBody().strength(-50)) //Push applied to all things from center
				.force("center", d3force.forceCenter(this._width / 2, this._height / 2))
				.on("tick", this.ticked(this));
		}
		if (this._simulation !== undefined) {
			this._simulation.nodes(this._data.timesteps[this._timeStampIndex].nodes);
			(this._simulation.force("link") as d3force.ForceLink<Node, Edge>).links(this._data.timesteps[this._timeStampIndex].edges);

			this._simulation.alpha(.5).restart();
		}
	}

	private ticked(self: DGLOsMatt) {
		return () => self.tick();
	}

	private tick() {
		if (this._edgeLineGlyphs !== undefined) { //only lineglyphs needed for simulation
			this._edgeLineGlyphs
				.attr("x1", function (d: Edge) { return d.source.x; })
				.attr("y1", function (d: Edge) { return d.source.y; })
				.attr("x2", function (d: Edge) { return d.target.x; })
				.attr("y2", function (d: Edge) { return d.target.y; });
		} else {
			console.log("No links!");
		}

		let self = this; //d3 hold this issue

		//update nodes in map; run update of simulation on all NodeGlyphs
		this._nodeGlyphs.forEach(function (glyphs: Selection<any, {}, any, {}>, shape: NodeGlyphShape) {
			shape.draw(glyphs, self._data, self._timeStampIndex);
		})

	}
}