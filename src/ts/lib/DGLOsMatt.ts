import { Selection, select } from "d3-selection";
import { Node, Edge, DynamicGraph, MetaNode, MetaEdge } from "../model/dynamicgraph";
import * as d3force from "d3-force";
import { Simulation } from "d3-force";
import { NodeGlyphShape } from "./NodeGlyphInterface";
import { EdgeGlyphShape } from "./EdgeGlyphInterface";
import { GroupGlyph } from "./GroupGlyphInterface";
import { DGLOsSVGCombined } from "./DGLOsSVGCombined";
import { SVGAttrOpts, SimulationAttrOpts } from "./DGLOsSVG";

export class DGLOsMatt extends DGLOsSVGCombined {

	/**
	 * Initialize and draw all NodeGlyphshapes, adds them to Map and sets display to "none".
	 */
	public drawNodeGlyphs() {
		this.drawNodeGlyphsAt(this.drawLocation);
	}
	/**
	* Initialize and draw all NodeGlyphshapes to a specific Selection, adds them to Map and sets display to "none".
	* @param location Selection<any, {}, any, {}>
	* @param SVGNum number; Default 0.
	*/
	protected drawNodeGlyphsAt(location: Selection<any, {}, any, {}>, SVGNum: number = 0) {

		//create "g" group for nodes; parent "g".
		let nodeG = location.append("g").classed("nodeG", true);

		//create child "g" in parent for NodeGlyphs per shape and initialize.
		let nodeLabelG: Selection<any, {}, any, {}> = this.labelShape.init(nodeG);
		let nodeCircleG: Selection<any, {}, any, {}> = this.circleShape.init(nodeG);

		nodeLabelG.style("display", "none");
		nodeCircleG.style("display", "none");

		//add nodeselections to map, then add map to NodeGLyphMap at SVG position.
		let glyphMap = new Map<NodeGlyphShape, Selection<any, {}, any, {}>>();
		glyphMap.set(this.labelShape, nodeLabelG);
		glyphMap.set(this.circleShape, nodeCircleG);

		this.nodeGlyphMap.set(SVGNum, glyphMap);
	}
	/**
	* Initialize and draw all GroupGlyphShapes, adds them to Map and sets display to "none"
	*/
	public drawRegions() {
		this.drawRegionsAt(this.drawLocation);
	}
	/**
	 * Initialize and draw all GroupGlyphShapes at a specified Selection, adds them to Map and sets display to "none" 
	 * @param location 
	 * @param SVGNum 
	 */
	protected drawRegionsAt(location: Selection<any, {}, any, {}>, SVGNum: number = 0) {
		let groupGlyphG = location.append("g").classed("groupG", true).lower();
		let voronoiG: Selection<any, {}, any, {}> = this.voronoiShape.init(groupGlyphG);

		voronoiG.style("display", "none");

		let glyphMap = new Map<GroupGlyph, Selection<any, {}, any, {}>>();
		glyphMap.set(this.voronoiShape, voronoiG);

		this.groupGlyphMap.set(SVGNum, glyphMap);
	}
	/**
	 * Transforms/makes visible the target GroupGlyph.
	 * @param shape 
	 */
	public transformGroupGlyphsTo(shape: GroupGlyph) {
		let self = this;
		this.groupGlyphMap.forEach(function (glyphMap: Map<GroupGlyph, Selection<any, {}, any, {}>>, timestep: number) {
			self.currentGroupGlyph.transformTo(glyphMap.get(self.currentGroupGlyph), shape, glyphMap.get(shape));
		});
		this.currentGroupGlyph = shape;
	}

	/**
	 * Transforms/makes visible the target NodeGlyphShape.
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
	 * Sets the attributes of Node and Edge visualizations.
	 * @param attr 
	 */
	public setAttributes(attr: SVGAttrOpts) {
		this.attrOpts = new SVGAttrOpts(attr.fill, attr.stroke, attr.stroke_edge, attr.stroke_width, attr.stroke_width_edge, attr.radius, attr.width, attr.height, attr.opacity, attr.font_size);
	}

	/**
	 * Sets the attributes of Node and Edge visualizations with Gmap visualization.
	 * Some attributes manually assigned for Gmap.
	 * @param attr 
	 */
	public setRegionGlyphAttrs(attr: SVGAttrOpts) {
		this.attrOpts = new SVGAttrOpts(attr.fill, attr.stroke, attr.stroke_edge, 0, 0.25, 1, attr.width, attr.height, attr.opacity, attr.font_size);
	}

	/**
	 * Sets the attributes of the simulation used in force-directed visualizations.
	 * @param attr 
	 */
	public setSimulationAttrs(attr: SimulationAttrOpts) {
		this.simulationAttrOpts = attr;
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
	 * True initializes simulation, if already exisits assigns data for Nodes and Edges and restarts simulation with alpha.
	 * False stops the simulation internal tick. Returns simulation at that point.
	 * @param setRunning boolean
	 */
	public positionNodesAndEdgesForceDirected(setRunning: boolean) {
		if (setRunning) {
			let self = this;
			//Check simulation exists
			if (this.simulation === undefined) {
				this.simulation = d3force.forceSimulation()
					.force("link", d3force.forceLink().id(function (d: MetaNode): string { return "" + d.id }))
					.force("charge", d3force.forceManyBody().strength(this._simulationAttrOpts.charge))
					.force("center", d3force.forceCenter(self._width / 2, self._height / 2))
					.on("tick", this.tick(self))
					.on("end", function () {
						console.log("SIMULATION DONE HALLELUJAH!");
					});
			}
			if (this.simulation !== undefined) {
				if (this.onClickRedraw) {//Egograph
					this.simulation.nodes(this.dataToDraw.metaNodesAsArray);
				} else {
					this.simulation.nodes(self.data.metaNodesAsArray);
				}
				let linkForce = (this.simulation.force("link") as d3force.ForceLink<MetaNode, MetaEdge>);
				if (this.onClickRedraw) {//Egograph
					linkForce.links(self.dataToDraw.metaEdgesAsArray)
				} else {
					linkForce.links(self.data.metaEdgesAsArray)
				}
				if (this._simulationAttrOpts.simulationWeightEnabled) {
					linkForce.strength(function (d: MetaEdge): number {
						return d.weight * self._simulationAttrOpts.linkStrength;
					});
				}
				if (this._simulationAttrOpts.simulationCollisionEnabled) {
					this.simulation.force("collide", d3force.forceCollide().radius(function (d: MetaNode): number {
						if (self.currentNodeShape.shapeType === "Label") {
							d.nodes.forEach(function (n: Node) {
								if ((self._attrOpts.font_size.substring(self._attrOpts.font_size.length - 2, self._attrOpts.font_size.length)) === "px") {
									return (n.label.length * +self._attrOpts.font_size.substring(0, self._attrOpts.font_size.length - 2)) / self._simulationAttrOpts.divisorPX;
								}
								return (n.label.length * +self._attrOpts.font_size.substring(0, self._attrOpts.font_size.length - 2)) / self._simulationAttrOpts.divisorPT;
							});
						}
						else {
							return self._attrOpts.radius;
						}
					})
						.iterations(2));
				}
				this.simulation.alpha(this._simulationAttrOpts.alpha).restart();
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
	private tick(self: DGLOsMatt) {
		return () => self.tock();
	}

	/**
	 *  (Tick) Tock called during simulation updating x and y positions of DOM elements at all timesteps.
	 */
	private tock() {
		let self = this;

		if (!this._multipleTimestepsEnabled) { //check if timeline view is enabled.
			//update groups in map; run update of simulation on all groups at the current timestep
			this._groupGlyphMap.forEach(function (GlyphMap: Map<GroupGlyph, Selection<any, {}, any, {}>>, SVGPosition: number) {
				GlyphMap.forEach(function (glyphs: Selection<any, {}, any, {}>, shape: GroupGlyph) {
					shape.draw(glyphs, self.dataToDraw, self.timeStampIndex, self._attrOpts, self.noisePoints, self.voronoi, self.enterExitColorEnabled);
				});
			});
			//update edges in map; run update of simulation on all edges at the current timestep
			this._edgeGlyphMap.forEach(function (GlyphMap: Map<EdgeGlyphShape, Selection<any, {}, any, {}>>, SVGPosition: number) {
				GlyphMap.forEach(function (glyphs: Selection<any, {}, any, {}>, shape: EdgeGlyphShape) {
					if (shape.shapeType === "Gestalt" && self.currentEdgeShape.shapeType !== "Gestalt") {

					} else {
						shape.draw(glyphs, self.dataToDraw, self.timeStampIndex, self._attrOpts, self.width, self.height, self.enterExitColorEnabled);
					}
				});
			});
			//update nodes in map; run update of simulation on all NodeGlyphs at the current timestep
			this._nodeGlyphMap.forEach(function (GlyphMap: Map<NodeGlyphShape, Selection<any, {}, any, {}>>, SVGPosition: number) {
				GlyphMap.forEach(function (glyphs: Selection<any, {}, any, {}>, shape: NodeGlyphShape) {
					shape.draw(glyphs, self.dataToDraw, self.timeStampIndex, self._attrOpts, undefined, self.enterExitColorEnabled);
				});
			});
		}
		else {
			//update groups in map; run update of simulation on all groups accross multiple SVG elements
			this._groupGlyphMap.forEach(function (GlyphMap: Map<GroupGlyph, Selection<any, {}, any, {}>>, SVGPosition: number) {
				GlyphMap.forEach(function (glyphs: Selection<any, {}, any, {}>, shape: GroupGlyph) {
					shape.draw(glyphs, self.dataToDraw, SVGPosition, self._attrOpts, self.noisePoints, self.voronoi, self.enterExitColorEnabled);
				});
			});
			//update edges in map; run update of simulation on all edges accross multiple SVG elements
			this._edgeGlyphMap.forEach(function (GlyphMap: Map<EdgeGlyphShape, Selection<any, {}, any, {}>>, SVGPosition: number) {
				GlyphMap.forEach(function (glyphs: Selection<any, {}, any, {}>, shape: EdgeGlyphShape) {
					if (shape.shapeType === "Gestalt" && self.currentEdgeShape.shapeType !== "Gestalt") {

					} else {
						shape.draw(glyphs, self.dataToDraw, SVGPosition, self._attrOpts, self.width, self.height, self.enterExitColorEnabled);
					}
				});
			});
			//update nodes in map; run update of simulation on all NodeGlyphs accross multiple SVG elements
			this._nodeGlyphMap.forEach(function (GlyphMap: Map<NodeGlyphShape, Selection<any, {}, any, {}>>, SVGPosition: number) {
				GlyphMap.forEach(function (glyphs: Selection<any, {}, any, {}>, shape: NodeGlyphShape) {
					shape.draw(glyphs, self.dataToDraw, SVGPosition, self._attrOpts, undefined, self.enterExitColorEnabled);
				});
			});
		}
	}
}