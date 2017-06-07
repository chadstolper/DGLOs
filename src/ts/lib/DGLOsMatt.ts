import { DGLOsSVGBaseClass } from "./DGLOsSVGBaseClass";
import { Selection } from "d3-selection";
import { Node, Edge } from "../model/dynamicgraph";
import { ScaleOrdinal, scaleOrdinal, schemeCategory20 } from "d3-scale";
import * as d3force from "d3-force";
import { Simulation } from "d3-force";
import { NodeGlyphShape } from "./NodeGlyphInterface";
import { EdgeGlyphShape } from "./EdgeGlyphInterface";
import { GroupGlyph } from "./GroupGlyphInterface";

import { VoronoiLayout } from "d3-voronoi";
import * as d3 from "d3"; //TODO: replace later with module

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
			this._nodeG = this.loc.append("g").classed("nodeG", true);

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

	public drawRegions() {
		let voronoi: VoronoiLayout<Node> = d3.voronoi<Node>().extent([[-1, -1], [this._width + 1, this._height + 1]]) //set dimensions of voronoi
			.x(function (d: Node) { return d.x; })
			.y(function (d: Node) { return d.y; });
		let cardinalPoints = [[0, 0], [this._width / 2, 0], [this._width, 0], [0, this._height / 2], [this._width, this._height / 2], [0, this._height], [this._width / 2, this._height], [this._height, this._width]];
		let noisePoints = [new Node("noise0", cardinalPoints.length + 0, "noise", ""), new Node("noise1", cardinalPoints.length + 1, "noise", ""), new Node("noise2", cardinalPoints.length + 2, "noise", ""), new Node("noise3", cardinalPoints.length + 3, "noise", ""), new Node("noise4", cardinalPoints.length + 4, "noise", ""), new Node("noise5", cardinalPoints.length + 5, "noise", ""), new Node("noise6", cardinalPoints.length + 6, "noise", ""), new Node("noise7", cardinalPoints.length + 7, "noise", "")];

		//give noisenodes (x, y) of cardinalPoints
		for (let i = 0; i < cardinalPoints.length; i++) {
			noisePoints[i].x = cardinalPoints[i][0];
			noisePoints[i].y = cardinalPoints[i][1];
		}

		if (this._groupGlyphG === undefined) {
			this._groupGlyphG = this.loc.append("g").classed("groupG", true);

			//create child "g" in parent for GroupGlyphs
			let voronoiG: Selection<any, {}, any, {}> = this.voronoiGroupGlyph.init(this._groupGlyphG);

			voronoiG.style("display", "none");

			//add voronoi regions to map
			this._groupGlyphMap.set(this.voronoiGroupGlyph, voronoiG);
		}
	}

	public removeRegions() {

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
	}

	public setRegionGlyphAttrs(attr: SVGAttrOpts) {
		//set regions attr
		//custom set nodes and edges
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

		this._groupGlyphMap.forEach(function (paths: Selection<any, {}, any, {}>, group: GroupGlyph) {
			group.draw(paths, self.data, self._timeStampIndex, self._attrOpts);
		});

		//update edges in map; run update of simulation on all edges
		this._edgeGlyphMap.forEach(function (edges: Selection<any, {}, any, {}>, shape: EdgeGlyphShape) {
			shape.draw(edges, self.data, self._timeStampIndex, self._edgeAttrOpts);
		});

		//update nodes in map; run update of simulation on all NodeGlyphs
		this._nodeGlyphMap.forEach(function (glyphs: Selection<any, {}, any, {}>, shape: NodeGlyphShape) {
			shape.draw(glyphs, self._data, self._timeStampIndex, self._attrOpts);
		});
	}
}