import { DGLOsSVGBaseClass } from "./DGLOsSVGBaseClass";
import { Selection } from "d3-selection";
import { Node, Edge } from "../model/dynamicgraph";
import { ScaleOrdinal, scaleOrdinal, schemeCategory20 } from "d3-scale";
import * as d3force from "d3-force";
import { Simulation } from "d3-force";
import { NodeGlyphShape } from "./NodeGlyphInterface";
import { EdgeGlyphShape } from "./EdgeGlyphInterface";

import { RectGlyphShape } from "./shapes/RectGlyphShape";
import { CircleGlyphShape } from "./shapes/CircleGlyphShape";
import { LabelGlyphShape } from "./shapes/LabelGlyphShape";
import { SourceTargetLineGlyphShape } from "./shapes/SourceTargetLineGlyphShape";
import { GestaltGlyphShape } from "./shapes/GestaltGlyphShape";

import { DGLOsSVGCombined } from "./DGLOsSVGCombined";
import { SVGAttrOpts } from "./DGLOsSVG";
import { DGLOsWill } from "./DGLOsWill";

export class DGLOsMatt extends DGLOsSVGCombined {

	protected _labelGlyphShape = new LabelGlyphShape();
	protected _circleGlyphShape = new CircleGlyphShape();

	public drawNodeGlyphs() {

		// this._currentEdgeShape = new SourceTargetLineGlyphShape("black", 1); //need to make specific?
		this._currentNodeShape = this._labelGlyphShape;

		//create "g" group for nodes; parent "g". Acts as pseudo init() function
		if (this._nodeG === undefined) {
			this._nodeG = this.loc.append("g").classed("nodeG", true)

			//create child "g" in parent for NodeGlyphs
			let nodeLabelG: Selection<any, {}, any, {}> = this._labelGlyphShape.init(this._nodeG);
			let nodeCircleG: Selection<any, {}, any, {}> = this._circleGlyphShape.init(this._nodeG);

			nodeLabelG.style("display", "none");
			nodeCircleG.style("display", "none");

			//add nodes to new map
			this._nodeGlyphs.set(this._labelGlyphShape, nodeLabelG);
			this._nodeGlyphs.set(this._circleGlyphShape, nodeCircleG);
		}
	}

	public transformNodeGlyphsTo(shape: NodeGlyphShape) {
		if (this._currentNodeShape.shapeType === "Label") {
			this._currentNodeShape.transformTo(this._nodeGlyphs.get(this._labelGlyphShape), shape, this._nodeGlyphs.get(shape));
			this._currentNodeShape = shape;
		}
		else {
			this._currentNodeShape.transformTo(this._nodeGlyphs.get(this._circleGlyphShape), shape, this._nodeGlyphs.get(shape));
			this._currentNodeShape = shape;
		}
	}

	public setNodeGlyphAttrs(attr: SVGAttrOpts) {
		// this._nodeGlyphs.get(this.currentNodeShape.draw())
	}

	public setEdgeGlyphAttrs(attr: SVGAttrOpts) {
		console.log("Closed until further notice\nSorry for the inconvience");
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
		console.log("oh god its ticking")
		let self = this; //d3 hold this issue

		//update edges(specifically STLines) in map; run update of simulation on all edges
		this._edgeGlyphs.forEach(function (edges: Selection<any, {}, any, {}>, shape: EdgeGlyphShape) {
			shape.draw(edges, self.data, self._timeStampIndex, self._attrOpts);
		});

		//update nodes in map; run update of simulation on all NodeGlyphs
		this._nodeGlyphs.forEach(function (glyphs: Selection<any, {}, any, {}>, shape: NodeGlyphShape) {
			shape.draw(glyphs, self._data, self._timeStampIndex, self._attrOpts);
		});
	}
}