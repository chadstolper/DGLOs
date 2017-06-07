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

	/**
	 * Initialize and draw all NodeGlyphshapes, adds them to Map and sets display to "none"
	 */
	public drawNodeGlyphs() {
		this._currentNodeShape = this.circleShape;

		//create "g" group for nodes; parent "g". Acts as pseudo init() function
		if (this._nodeG === undefined) {
			this._nodeG = this.loc.append("g").classed("nodeG", true)

			//create child "g" in parent for NodeGlyphs
			let nodeLabelG: Selection<any, {}, any, {}> = this.labelShape.init(this._nodeG);
			let nodeCircleG: Selection<any, {}, any, {}> = this.circleShape.init(this._nodeG);

			nodeLabelG.style("display", "none");
			nodeCircleG.style("display", "none");

			//add nodes to new map
			this._nodeGlyphMap.set(this.labelShape, nodeLabelG);
			this._nodeGlyphMap.set(this.circleShape, nodeCircleG);
		}
	}

	/**
	 * Transforms/makes visible the target NodeGlyphShape
	 * @param shape 
	 */
	public transformNodeGlyphsTo(shape: NodeGlyphShape) {
		this._currentNodeShape.transformTo(this._nodeGlyphMap.get(this._currentNodeShape), shape, this._nodeGlyphMap.get(shape));
		this._currentNodeShape = shape;
	}

	/**
	 * Resets the visual attributes of the NodeGlyphShape
	 * @param attr 
	 */
	public setNodeGlyphAttrs(attr: SVGAttrOpts) {
		this._attrOpts = attr;
<<<<<<< HEAD
		this._currentNodeShape.updateDraw(this._nodeGlyphMap.get(this._currentNodeShape), this._attrOpts, this._data, this._timeStampIndex);
=======
		// this._currentNodeShape.updateDraw(this._nodeGlyphs.get(this._currentNodeShape), this._attrOpts, this._data, this._timeStampIndex);
>>>>>>> ff5279f1f85bb33cdc05ecf17252ae1320fe6722
	}

	/**
	 * Begins the force simulation, calls internal tick().
	 */
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
		let self = this; //d3 scope this issue

		//update edges in map; run update of simulation on all edges
		this._edgeGlyphMap.forEach(function (edges: Selection<any, {}, any, {}>, shape: EdgeGlyphShape) {
			shape.draw(edges, self.data, self._timeStampIndex, self._edgeAttrOpts);
		});

		//update nodes in map; run update of simulation on all NodeGlyphs
<<<<<<< HEAD
		this._nodeGlyphMap.forEach(function (glyphs: Selection<any, {}, any, {}>, shape: NodeGlyphShape) {
			shape.draw(glyphs, self._data, self._timeStampIndex, self._attrOpts);
=======
		this._nodeGlyphs.forEach(function (glyphs: Selection<any, {}, any, {}>, shape: NodeGlyphShape) {
			shape.draw(glyphs, self.data, self._timeStampIndex, self._attrOpts);
>>>>>>> ff5279f1f85bb33cdc05ecf17252ae1320fe6722
		});
	}
}