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
	 * Initialize and draw all NodeGlyphshapes, adds them to Map and sets display to "none"
	 */
	public drawNodeGlyphs() {
		this.drawNodeGlyphsAt(this.loc);
	}
	/**
	* Initialize and draw all NodeGlyphshapes to a specific Selection, adds them to Map and sets display to "none"
	* @param loc: Selection<any, {}, any, {}>
	*/
	protected drawNodeGlyphsAt(loc: Selection<any, {}, any, {}>, timestep?: number) {
		let internalTime = 0;
		if (timestep !== undefined) {
			internalTime = timestep;
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

		this._nodeGlyphMap.set(internalTime, glyphMap);
	}
	/**
	* Initialize and draw all GroupGlyphShapes, adds them to Map and sets display to "none"
	*/
	public drawRegions() {
		// this.voronoiInit();

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
	 * Transforms/makes visible the target NodeGlyphShape
	 * @param shape 
	 */
	public transformNodeGlyphsTo(shape: NodeGlyphShape) {
		let self = this;
		this._nodeGlyphMap.forEach(function (nodeGlyphMap: Map<NodeGlyphShape, Selection<any, {}, any, {}>>, timestep: number) {
			self._currentNodeShape.transformTo(nodeGlyphMap.get(self._currentNodeShape), shape, nodeGlyphMap.get(shape));
		});

		this._currentNodeShape = shape;
	}

	/**
	 * Resets the visual attributes of the NodeGlyphShape
	 * @param attr 
	 */
	public setNodeGlyphAttrs(attr: SVGAttrOpts) {
		this._attrOpts = attr;
	}

	/**
	 * Resets the visual attributes of the GroupGlyphShape.
	 * Also sets NodeGlyph and EdgeGlyph attributes to correspond with GroupGlyph visualization.
	 * @param attr 
	 */
	public setRegionGlyphAttrs(attr: SVGAttrOpts) {
		this._groupAttrOpts = attr;
		this._attrOpts = new SVGAttrOpts("black", null, 0.5);
		this._edgeAttrOpts = new SVGAttrOpts(null, "grey", null, 0.25);
	}

	/**
	 * Begins the force simulation, calls internal tick().
	 */
	public runSimulation(setRunning: boolean) {
		this._simulationEnabled = setRunning;
		if (this._simulationEnabled) {
			let self = this;
			//Check simulation exists
			if (this._simulation === undefined) {
				this._simulation = d3force.forceSimulation()
					.force("link", d3force.forceLink().id(function (d: MetaNode): string { return "" + d.id })) //push applied to NodeGlyphs
					.force("charge", d3force.forceManyBody().strength(-50)) //pull applied to all things from center
					.force("center", d3force.forceCenter(self._width / 2, self._height / 2))
					.force("collide", d3force.forceCollide().radius(function (d: MetaNode): number {
						try {
							console.log(self.currentNodeShape.shapeType)
							if (self.currentNodeShape.shapeType === "Label") {
								let ret: number;
								d.nodes.forEach(function (n: Node) {
									ret = n.label.length * 2; //TODO: replace # with font related function
								});
								return ret;
							}
							else return self._attrOpts.radius;
						}
						catch (err) {
							return null;
						}
					})
						.iterations(2))
					.on("tick", this.ticked(self))
					.on("end", function () {
						// console.log(self.data.metaNodes)
						console.log("SIMULATION DONE HALLELUJAH!");
					});
			}
			if (this._simulation !== undefined) {
				this._simulation.nodes(self.data.metaNodesAsArray);
				(this._simulation.force("link") as d3force.ForceLink<MetaNode, MetaEdge>).links(self.data.metaEdgesAsArray);

				this._simulation.alpha(.3).restart();
				// console.log(this.data.metaNodesAsArray)
			}

		} else {
			this._simulation.stop();
			this._simulationEnabled = false;
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

		console.log("ticking")

		if (!this._multipleTimestepsEnabled) {
			this._groupGlyphMap.forEach(function (GlyphMap: Map<GroupGlyph, Selection<any, {}, any, {}>>, timestep: number) {
				GlyphMap.forEach(function (glyphs: Selection<any, {}, any, {}>, shape: GroupGlyph) {
					// self.metaTick();
					shape.draw(glyphs, self.data, self._timeStampIndex, self._groupAttrOpts, self.noisePoints, self.voronoi);
				});
			});

			//update edges in map; run update of simulation on all edges
			this._edgeGlyphMap.forEach(function (GlyphMap: Map<EdgeGlyphShape, Selection<any, {}, any, {}>>, timestep: number) {
				GlyphMap.forEach(function (glyphs: Selection<any, {}, any, {}>, shape: EdgeGlyphShape) {
					// self.metaTick();
					shape.draw(glyphs, self.data, self._timeStampIndex, self._edgeAttrOpts);
				});
			});

			//update nodes in map; run update of simulation on all NodeGlyphs
			this._nodeGlyphMap.forEach(function (GlyphMap: Map<NodeGlyphShape, Selection<any, {}, any, {}>>, timestep: number) {
				GlyphMap.forEach(function (glyphs: Selection<any, {}, any, {}>, shape: NodeGlyphShape) {
					// console.log(self._nodeGlyphMap)
					shape.draw(glyphs, self.data, self._timeStampIndex, self._attrOpts);
				});
			});
		}
		else {
			this._groupGlyphMap.forEach(function (GlyphMap: Map<GroupGlyph, Selection<any, {}, any, {}>>, timestep: number) {
				GlyphMap.forEach(function (glyphs: Selection<any, {}, any, {}>, shape: GroupGlyph) {
					// self.metaTick();
					shape.draw(glyphs, self.data, timestep, self._groupAttrOpts, self.noisePoints, self.voronoi);
				});
			});

			//update edges in map; run update of simulation on all edges
			this._edgeGlyphMap.forEach(function (GlyphMap: Map<EdgeGlyphShape, Selection<any, {}, any, {}>>, timestep: number) {
				GlyphMap.forEach(function (glyphs: Selection<any, {}, any, {}>, shape: EdgeGlyphShape) {
					// self.metaTick();
					shape.draw(glyphs, self.data, timestep, self._edgeAttrOpts);
				});
			});

			//update nodes in map; run update of simulation on all NodeGlyphs
			this._nodeGlyphMap.forEach(function (GlyphMap: Map<NodeGlyphShape, Selection<any, {}, any, {}>>, timestep: number) {
				GlyphMap.forEach(function (glyphs: Selection<any, {}, any, {}>, shape: NodeGlyphShape) {
					// console.log(self._nodeGlyphMap)
					shape.draw(glyphs, self.data, timestep, self._attrOpts);
				});
			});
		}
	}
}