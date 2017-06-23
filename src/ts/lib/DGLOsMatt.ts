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
		this.drawNodeGlyphsAt(this.drawLoc);
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
		let nodeG = loc.append("g").classed("nodeG", true);

		//create child "g" in parent for NodeGlyphs
		let nodeLabelG: Selection<any, {}, any, {}> = this.labelShape.init(nodeG);
		let nodeCircleG: Selection<any, {}, any, {}> = this.circleShape.init(nodeG);

		nodeLabelG.style("display", "none");
		nodeCircleG.style("display", "none");

		//add nodeselections to new map and map map
		let glyphMap = new Map<NodeGlyphShape, Selection<any, {}, any, {}>>();
		glyphMap.set(this.labelShape, nodeLabelG);
		glyphMap.set(this.circleShape, nodeCircleG);

		this.nodeGlyphMap.set(SVGPosition, glyphMap);
	}
	/**
	* Initialize and draw all GroupGlyphShapes, adds them to Map and sets display to "none"
	*/
	public drawRegions() {
		this.drawRegionsAt(this.loc);
	}
	/**
	 * Initialize and draw all GroupGlyphShapes at a specified Selection, adds them to Map and sets display to "none" 
	 * @param loc 
	 * @param SVGNum 
	 */
	protected drawRegionsAt(loc: Selection<any, {}, any, {}>, SVGNum?: number) {
		let SVGPosition = 0;
		if (SVGNum !== undefined) {
			SVGPosition = SVGNum;
		}
		let groupGlyphG = loc.append("g").classed("groupG", true).lower();

		//create child "g" in parent for GroupGlyphs
		let voronoiG: Selection<any, {}, any, {}> = this.voronoiShape.init(groupGlyphG);

		voronoiG.style("display", "none");

		//add voronoi regions to map
		let glyphMap = new Map<GroupGlyph, Selection<any, {}, any, {}>>();
		glyphMap.set(this.voronoiShape, voronoiG);

		this.groupGlyphMap.set(SVGPosition, glyphMap);

		// let self = this;
		// this._groupGlyphMap.forEach(function (groupMap: Map<GroupGlyph, Selection<any, {}, any, {}>>, timestep: number) {
		// 	self._currentGroupGlyph.transformTo(groupMap.get(self._currentGroupGlyph), self.voronoiGroupGlyph, groupMap.get(self.voronoiGroupGlyph));
		// });

	}
	/**
	 * Transforms/makes visible the target GroupGlyph. //TODO: update descriptiong for flubber
	 * @param shape 
	 */
	public transformGroupGlyphsTo(shape: GroupGlyph) {
		let self = this;
		this.groupGlyphMap.forEach(function (glyphMap: Map<GroupGlyph, Selection<any, {}, any, {}>>, timestep: number) {
			self.currentGroupGlyph.transformTo(glyphMap.get(self.currentGroupGlyph), shape, glyphMap.get(shape));
		});
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
	public setNodeGlyphAttrs(attr: SVGAttrOpts) { //TODO: fix all sets to generic attropt varible
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
	 * Enables enter and exit coloring between timestep visualizations.
	 */
	public enableEnterExitColoring() {
		this.enterExitColorEnabled = true;
	}

	/**
	 * Disables enter and exit coloring between timestep visualizations.
	 */
	public disableEnterExitColoring() {
		this.enterExitColorEnabled = false;
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
					.force("charge", d3force.forceManyBody().strength(-100))
					.force("center", d3force.forceCenter(self._width / 2, self._height / 2))
					.force("collide", d3force.forceCollide().radius(function (d: MetaNode): number {
						try {
							if (self.currentNodeShape.shapeType === "Label") {
								let ret: number;
								d.nodes.forEach(function (n: Node) {
									let divisor: number;
									if (self._attrOpts.font_size.substring(self._attrOpts.font_size.length - 2, self._attrOpts.font_size.length) === "px") {
										divisor = 2.5;
									}
									else {
										divisor = 2;
									}
									ret = (n.label.length * +self._attrOpts.font_size.substring(0, self._attrOpts.font_size.length - 2)) / divisor;
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
			if (this._simulation !== undefined) {
				if (this.onClickRedraw) {//Egograph
					this._simulation.nodes(this.dataToDraw.metaNodesAsArray);
				} else {
					this._simulation.nodes(self.data.metaNodesAsArray);
				}


				let linkForce = (this._simulation.force("link") as d3force.ForceLink<MetaNode, MetaEdge>);
				if (this.onClickRedraw) {//Egograph
					linkForce.links(self.dataToDraw.metaEdgesAsArray)
				} else {
					linkForce.links(self.data.metaEdgesAsArray)
				}
				linkForce.strength(function (d: MetaEdge): number {
					return d.weight * 0.05;
				});
				this._simulation.alpha(.3).restart();
			}

		} else {
			this.simulation.stop();
			console.log("SIMULATION STOPPED. DO NOT PASS GO, DO NOT COLLECT $200");
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
					shape.draw(glyphs, self.dataToDraw, self._timeStampIndex, self._groupAttrOpts, self.noisePoints, self.voronoi, self.enterExitColorEnabled);
				});
			});
			//update edges in map; run update of simulation on all edges at the current timestep
			this._edgeGlyphMap.forEach(function (GlyphMap: Map<EdgeGlyphShape, Selection<any, {}, any, {}>>, timestep: number) {
				GlyphMap.forEach(function (glyphs: Selection<any, {}, any, {}>, shape: EdgeGlyphShape) {
					shape.draw(glyphs, self.dataToDraw, self._timeStampIndex, self._edgeAttrOpts, self.enterExitColorEnabled);
				});
			});
			//update nodes in map; run update of simulation on all NodeGlyphs at the current timestep
			this._nodeGlyphMap.forEach(function (GlyphMap: Map<NodeGlyphShape, Selection<any, {}, any, {}>>, timestep: number) {
				GlyphMap.forEach(function (glyphs: Selection<any, {}, any, {}>, shape: NodeGlyphShape) {
					shape.draw(glyphs, self.dataToDraw, self._timeStampIndex, self._attrOpts, self.enterExitColorEnabled);
				});
			});
		}
		else {
			//update groups in map; run update of simulation on all groups accross multiple SVG elements
			this._groupGlyphMap.forEach(function (GlyphMap: Map<GroupGlyph, Selection<any, {}, any, {}>>, timestep: number) {
				GlyphMap.forEach(function (glyphs: Selection<any, {}, any, {}>, shape: GroupGlyph) {
					shape.draw(glyphs, self.dataToDraw, timestep, self._groupAttrOpts, self.noisePoints, self.voronoi, self.enterExitColorEnabled);
				});
			});
			//update edges in map; run update of simulation on all edges accross multiple SVG elements
			this._edgeGlyphMap.forEach(function (GlyphMap: Map<EdgeGlyphShape, Selection<any, {}, any, {}>>, timestep: number) {
				GlyphMap.forEach(function (glyphs: Selection<any, {}, any, {}>, shape: EdgeGlyphShape) {
					shape.draw(glyphs, self.dataToDraw, timestep, self._edgeAttrOpts, self.enterExitColorEnabled);
				});
			});
			//update nodes in map; run update of simulation on all NodeGlyphs accross multiple SVG elements
			this._nodeGlyphMap.forEach(function (GlyphMap: Map<NodeGlyphShape, Selection<any, {}, any, {}>>, timestep: number) {
				GlyphMap.forEach(function (glyphs: Selection<any, {}, any, {}>, shape: NodeGlyphShape) {
					shape.draw(glyphs, self.dataToDraw, timestep, self._attrOpts, self.enterExitColorEnabled);
				});
			});
		}
	}
}