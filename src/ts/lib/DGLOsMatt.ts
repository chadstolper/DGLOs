import { DGLOsSVGBaseClass } from "./DGLOsSVGBaseClass";
import { Selection, select } from "d3-selection";
import { Node, Edge, DynamicGraph, MetaNode, MetaEdge } from "../model/dynamicgraph";
import { ScaleOrdinal, scaleOrdinal, schemeCategory20 } from "d3-scale";
import * as d3force from "d3-force";
import { Simulation } from "d3-force";
import { NodeGlyphShape } from "./NodeGlyphInterface";
import { EdgeGlyphShape } from "./EdgeGlyphInterface";
import { GroupGlyph } from "./GroupGlyphInterface";

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
	 * Initialize and draw all NodeGlyphshapes, adds them to Map and sets display to "none".
	 */
	public drawNodeGlyphs() {
		this.drawNodeGlyphsAt(this.loc);
	}
	/**
	* Initialize and draw all NodeGlyphshapes to a specific Selection, adds them to Map and sets display to "none". //TODO: update description for flubber
	* @param loc: Selection<any, {}, any, {}>
	*/
	protected drawNodeGlyphsAt(loc: Selection<any, {}, any, {}>, SVGNum?: number) {
		let SVGPosition = 0;
		if (SVGNum !== undefined) {
			SVGPosition = SVGNum;
		}
		//create "g" group for nodes; parent "g". Acts as pseudo init() function
		this._nodeG = loc.append("g").classed("nodeG", true);

		//create child "g" in parent for NodeGlyphs
		let nodeLabelG: Selection<any, {}, any, {}> = this.labelShape.init(this._nodeG);
		let nodeCircleG: Selection<any, {}, any, {}> = this.circleShape.init(this._nodeG);

		nodeLabelG.style("display", "none");
		nodeCircleG.style("display", "none");

		//add nodeselections to new map and map map
		let glyphMap = new Map<NodeGlyphShape, Selection<any, {}, any, {}>>();
		glyphMap.set(this.labelShape, nodeLabelG);
		glyphMap.set(this.circleShape, nodeCircleG);

		this._nodeGlyphMap.set(SVGPosition, glyphMap);
	}
	/**
	* Initialize and draw all GroupGlyphShapes, adds them to Map and sets display to "none"
	*/
	public drawRegions() { //TODO: expand drawregions to accept multiple timestep-svg drawing scheme?
		if (this._groupGlyphG === undefined) {
			this._groupGlyphG = this.loc.append("g").classed("groupG", true).lower();

			//create child "g" in parent for GroupGlyphs
			let voronoiG: Selection<any, {}, any, {}> = this.voronoiGroupGlyph.init(this._groupGlyphG);

			voronoiG.style("display", "none");

			//add voronoi regions to map
			let glyphMap = new Map<GroupGlyph, Selection<any, {}, any, {}>>();
			glyphMap.set(this.voronoiGroupGlyph, voronoiG);

			this._groupGlyphMap.set(this._timeStampIndex, glyphMap);
		}

		let self = this;
		this._groupGlyphMap.forEach(function (groupMap: Map<GroupGlyph, Selection<any, {}, any, {}>>, timestep: number) {
			self._currentGroupGlyph.transformTo(groupMap.get(self._currentGroupGlyph), self.voronoiGroupGlyph, groupMap.get(self.voronoiGroupGlyph));
		});

		this._currentGroupGlyph = this.voronoiGroupGlyph; //TODO: assign possibly somewhere else
	}

	/**
	 * Transforms/makes visible the target NodeGlyphShape //TODO: update description for flubber
	 * @param shape 
	 */
	public transformNodeGlyphsTo(shape: NodeGlyphShape) {
		let self = this;
		this.nodeGlyphMap.forEach(function (nodeGlyphMap: Map<NodeGlyphShape, Selection<any, {}, any, {}>>, timestep: number) {
			self.currentNodeShape.transformTo(nodeGlyphMap.get(self.currentNodeShape), shape, nodeGlyphMap.get(shape));
		});

		this.currentNodeShape = shape;
	}

	/**
	 * (Re)sets the visual attributes of the NodeGlyphShape
	 * @param attr 
	 */
	public setNodeGlyphAttrs(attr: SVGAttrOpts) {
		this._attrOpts = attr;
	}

	/**
	 * (Re)sets the visual attributes of the GroupGlyphShape.
	 * Also sets NodeGlyph and EdgeGlyph attributes to correspond with GroupGlyph visualization.
	 * @param attr 
	 */
	public setRegionGlyphAttrs(attr: SVGAttrOpts) {
		this._groupAttrOpts = attr;
		this._attrOpts = new SVGAttrOpts("black", null, 0.5);
		this._edgeAttrOpts = new SVGAttrOpts(null, "grey", null, 0.25);
	}

	/**
	 * Begins the force simulation for positioning Nodes and Edges, calls internal tick().
	 * True initializes simulation, if already exisits assigns data for Nodes and Edges and restarts simulation.
	 * False stops the simulation internal tick. Returns simulation at that point.
	 * @param setRunning: boolean
	 */
	public positionNodesAndEdgesForceDirected(setRunning: boolean) {
		if (setRunning) {
			let self = this;
			//Check simulation exists
			if (this.simulation === undefined) {
				this.simulation = d3force.forceSimulation()
					.force("link", d3force.forceLink().id(function (d: MetaNode): string { return "" + d.id }))
					.force("charge", d3force.forceManyBody().strength(-50))
					.force("center", d3force.forceCenter(self._width / 2, self._height / 2))
					.force("collide", d3force.forceCollide().radius(function (d: MetaNode): number {
						try {
							if (self.currentNodeShape.shapeType === "Label") {
								let ret: number;
								d.nodes.forEach(function (n: Node) {
									ret = n.label.length * 4; //TODO: replace # with font related function
								});
								return ret;
							}
							else {
								return self._attrOpts.radius;
							}
						}
						catch (err) {
							console.log("unreachable error catch, how did you...?")
							return null;
						}
					})
						.iterations(2))
					.on("tick", this.ticked(self))
					.on("end", function () {
						console.log("SIMULATION DONE HALLELUJAH!");
					});
			}
			if (this.simulation !== undefined) {
				this.simulation.nodes(self.data.metaNodesAsArray);
				(this.simulation.force("link") as d3force.ForceLink<MetaNode, MetaEdge>)
					.links(self.data.metaEdgesAsArray)
					.strength(function (d: MetaEdge): number {
						return d.weight * 0.05; //TODO: varible for strength
					});
				this.simulation.alpha(.3).restart();
			}

		} else {
			this.simulation.stop();
		}
	}

	/**
	 * "Super tick" called during simulation
	 * @param self
	 */
	private ticked(self: DGLOsMatt) {
		return () => self.tick();
	}

	/**
	 *  Tick called during simulation updating x and y positions of DOM elements
	 */
	private tick() {
		let self = this; //d3 scope this issue

		if (!this._multipleTimestepsEnabled) { //check if small multiples are enabled.
			//update groups in map; run update of simulation on all groups at the current timestep
			this._groupGlyphMap.forEach(function (GlyphMap: Map<GroupGlyph, Selection<any, {}, any, {}>>, timestep: number) {
				GlyphMap.forEach(function (glyphs: Selection<any, {}, any, {}>, shape: GroupGlyph) {
					shape.draw(glyphs, self.data, self._timeStampIndex, self._groupAttrOpts, self.noisePoints, self.voronoi);
				});
			});
			//update edges in map; run update of simulation on all edges at the current timestep
			this._edgeGlyphMap.forEach(function (GlyphMap: Map<EdgeGlyphShape, Selection<any, {}, any, {}>>, timestep: number) {
				GlyphMap.forEach(function (glyphs: Selection<any, {}, any, {}>, shape: EdgeGlyphShape) {
					shape.draw(glyphs, self.data, self._timeStampIndex, self._edgeAttrOpts);
				});
			});
			//update nodes in map; run update of simulation on all NodeGlyphs at the current timestep
			this._nodeGlyphMap.forEach(function (GlyphMap: Map<NodeGlyphShape, Selection<any, {}, any, {}>>, timestep: number) {
				GlyphMap.forEach(function (glyphs: Selection<any, {}, any, {}>, shape: NodeGlyphShape) {
					shape.draw(glyphs, self.data, self._timeStampIndex, self._attrOpts);
				});
			});
		}
		else {
			//update groups in map; run update of simulation on all groups accross multiple SVG elements
			this._groupGlyphMap.forEach(function (GlyphMap: Map<GroupGlyph, Selection<any, {}, any, {}>>, timestep: number) {
				GlyphMap.forEach(function (glyphs: Selection<any, {}, any, {}>, shape: GroupGlyph) {
					shape.draw(glyphs, self.data, timestep, self._groupAttrOpts, self.noisePoints, self.voronoi);
				});
			});
			//update edges in map; run update of simulation on all edges accross multiple SVG elements
			this._edgeGlyphMap.forEach(function (GlyphMap: Map<EdgeGlyphShape, Selection<any, {}, any, {}>>, timestep: number) {
				GlyphMap.forEach(function (glyphs: Selection<any, {}, any, {}>, shape: EdgeGlyphShape) {
					shape.draw(glyphs, self.data, timestep, self._edgeAttrOpts);
				});
			});
			//update nodes in map; run update of simulation on all NodeGlyphs accross multiple SVG elements
			this._nodeGlyphMap.forEach(function (GlyphMap: Map<NodeGlyphShape, Selection<any, {}, any, {}>>, timestep: number) {
				GlyphMap.forEach(function (glyphs: Selection<any, {}, any, {}>, shape: NodeGlyphShape) {
					shape.draw(glyphs, self.data, timestep, self._attrOpts);
				});
			});
		}
	}
}