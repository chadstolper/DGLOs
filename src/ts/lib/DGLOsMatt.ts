import { Selection } from "d3-selection";
import { Node, Edge, DynamicGraph, MetaNode, MetaEdge } from "../model/dynamicgraph";
import * as d3force from "d3-force";
import { Simulation } from "d3-force";
import { NodeGlyphShape } from "./NodeGlyphInterface";
import { EdgeGlyphShape } from "./EdgeGlyphInterface";
import { GroupGlyph } from "./GroupGlyphInterface";
import { DGLOsSVGCombined } from "./DGLOsSVGCombined";
import { SVGAttrOpts, SimulationAttrOpts } from "./DGLOsSVG";

export class DGLOsMatt extends DGLOsSVGCombined {
	readonly ITERATIONS: number = 3;
	readonly REGION_STROKE_WIDTH: number = 0;
	readonly REGION_STROKE_WIDTH_EDGE: number = .25;
	readonly REGION_RADIUS: number = 1;

	/**
	 * Initialize and draw all NodeGlyphshapes, adds them to Map and sets display to "none".
	 */
	public drawNodeGlyphs(): void {
		this.drawNodeGlyphsAt(this.drawLocation);
	}
	/**
	* Initialize and draw all NodeGlyphshapes to a specific Selection, adds them to Map and sets display to "none".
	* @param location Selection<any, {}, any, {}>
	* @param SVGNum number; Default 0.
	*/
	protected drawNodeGlyphsAt(location: Selection<any, {}, any, {}>, svgNum: number = 0): void {

		//create "g" group for nodes; parent "g".
		let nodeG: Selection<any, {}, any, {}> = location.append("g").classed("nodeG", true);

		//create child "g" in parent for NodeGlyphs per shape and initialize.
		let nodeLabelG: Selection<any, {}, any, {}> = this.labelShape.init(nodeG);
		let nodeCircleG: Selection<any, {}, any, {}> = this.circleShape.init(nodeG);

		nodeLabelG.style("display", "none");
		nodeCircleG.style("display", "none");

		//add nodeselections to map, then add map to NodeGLyphMap at SVG position.
		let glyphMap: Map<NodeGlyphShape, Selection<any, {}, any, {}>> = new Map<NodeGlyphShape, Selection<any, {}, any, {}>>();
		glyphMap.set(this.labelShape, nodeLabelG);
		glyphMap.set(this.circleShape, nodeCircleG);

		this.nodeGlyphMap.set(svgNum, glyphMap);
	}
	/**
	* Initialize and draw all GroupGlyphShapes, adds them to Map and sets display to "none"
	*/
	public drawRegions(): void {
		this.drawRegionsAt(this.drawLocation);
	}
	/**
	 * Initialize and draw all GroupGlyphShapes at a specified Selection, adds them to Map and sets display to "none" 
	 * @param location 
	 * @param SVGNum 
	 */
	protected drawRegionsAt(location: Selection<any, {}, any, {}>, svgNum: number = 0): void {
		let groupGlyphG: Selection<any, {}, any, {}> = location.append("g").classed("groupG", true).lower();
		let voronoiG: Selection<any, {}, any, {}> = this.voronoiShape.init(groupGlyphG);

		voronoiG.style("display", "none");

		let glyphMap: Map<GroupGlyph, Selection<any, {}, any, {}>> = new Map<GroupGlyph, Selection<any, {}, any, {}>>();
		glyphMap.set(this.voronoiShape, voronoiG);

		this.groupGlyphMap.set(svgNum, glyphMap);
	}
	/**
	 * Transforms/makes visible the target GroupGlyph.
	 * @param shape 
	 */
	public transformGroupGlyphsTo(shape: GroupGlyph): void {
		let self = this;
		this.groupGlyphMap.forEach(function (glyphMap: Map<GroupGlyph, Selection<any, {}, any, {}>>, timestep: number): void {
			self.currentGroupGlyph.transformTo(glyphMap.get(self.currentGroupGlyph), shape, glyphMap.get(shape));
		});
		this.currentGroupGlyph = shape;
	}

	/**
	 * Transforms/makes visible the target NodeGlyphShape.
	 * @param shape 
	 */
	public transformNodeGlyphsTo(shape: NodeGlyphShape): void {
		let self = this;
		this.nodeGlyphMap.forEach(function (nodeGlyphMap: Map<NodeGlyphShape, Selection<any, {}, any, {}>>, timestep: number): void {
			self.currentNodeShape.transformTo(nodeGlyphMap.get(self.currentNodeShape), shape, nodeGlyphMap.get(shape));
		});
		this.currentNodeShape = shape;
	}

	/**
	 * Sets the attributes of Node and Edge visualizations.
	 * @param attr 
	 */
	public setAttributes(attr: SVGAttrOpts): void {
		this.attrOpts = attr;
	}

	/**
	 * Sets the attributes of Node and Edge visualizations with Gmap visualization.
	 * Some attributes manually assigned for Gmap.
	 * Stroke-Width = 0.
	 * Stroke-Width_Edge = 0.25.
	 * Radius = 1.
	 * @param attr 
	 */
	public setRegionGlyphAttrs(attr: SVGAttrOpts): void {
		this.attrOpts = attr;
		this.attrOpts.stroke_width = this.REGION_STROKE_WIDTH;
		this.attrOpts.stroke_width_edge = this.REGION_STROKE_WIDTH_EDGE;
		this.attrOpts.radius = this.REGION_RADIUS;
	}

	/**
	 * Sets the attributes of the simulation used in force-directed visualizations.
	 * @param attr 
	 */
	public setSimulationAttrs(attr: SimulationAttrOpts): void {
		this.simulationAttrOpts = attr;
	}

	/**
	 * Enables enter and exit coloring between timestep visualizations.
	 */
	public enableEnterExitColoring(): void {
		this.enterExitColorEnabled = true;
	}

	/**
	 * Disables enter and exit coloring between timestep visualizations.
	 */
	public disableEnterExitColoring(): void {
		this.enterExitColorEnabled = false;
	}

	/**
	 * Begins the force simulation for positioning Nodes and Edges, calls internal tick(). The simulation runs based on a compilation of all
	 * data at all timesteps and then assigns the Nodes and Edges their positioning based on the full simulation and relative to other Nodes
	 * which might not be present in the same timestep.
	 * True initializes simulation, if already exisits assigns data for Nodes and Edges and restarts simulation with alpha.
	 * False stops the simulation internal tick. Returns simulation at that point.
	 * @param setRunning boolean
	 */
	public positionNodesAndEdgesForceDirected(setRunning: boolean): void {
		if (setRunning) {
			let self = this;
			//Check simulation exists
			if (this.simulation === undefined) {
				this.simulation = d3force.forceSimulation()
					.force("link", d3force.forceLink().id(function (d: MetaNode): string { return "" + d.id }))
					.force("charge", d3force.forceManyBody().strength(this.simulationAttrOpts.charge))
					.force("center", d3force.forceCenter(self.width / 2, self.height / 2))
					.on("tick", this.tick(self))
					.on("end", function (): void {
						console.log("SIMULATION DONE HALLELUJAH!");
					});
			}
			if (this.simulation !== undefined) {
				if (this.centralNodesEnabled) {//Egograph
					this.simulation.nodes(this.dataToDraw.metaNodesAsArray);
				} else {
					this.simulation.nodes(self.data.metaNodesAsArray);
				}
				let linkForce: d3force.ForceLink<MetaNode, MetaEdge> = (this.simulation.force("link") as d3force.ForceLink<MetaNode, MetaEdge>);
				if (this.centralNodesEnabled) {//Egograph
					linkForce.links(self.dataToDraw.metaEdgesAsArray)
				} else {
					linkForce.links(self.data.metaEdgesAsArray)
				}
				if (this.simulationAttrOpts.simulationWeightEnabled) {
					linkForce.strength(function (d: MetaEdge): number {
						return d.weight * self.simulationAttrOpts.linkStrength;
					});
				}
				if (this.simulationAttrOpts.simulationCollisionEnabled) {
					this.simulation.force("collide", d3force.forceCollide().radius(function (d: MetaNode): number {
						if (self.currentNodeShape.shapeType === "Label") {
							d.nodes.forEach(function (n: Node): number {
								if ((self.attrOpts.font_size.substring(self.attrOpts.font_size.length - 2, self.attrOpts.font_size.length)) === "px") {
									return (n.label.length * +self.attrOpts.font_size.substring(0, self.attrOpts.font_size.length - 2)) / self.simulationAttrOpts.divisorPX;
								}
								return (n.label.length * +self.attrOpts.font_size.substring(0, self.attrOpts.font_size.length - 2)) / self.simulationAttrOpts.divisorPT;
							});
						}
						else {
							return self.attrOpts.radius;
						}
					})
						.iterations(this.ITERATIONS));
				}
				this.simulation.alpha(this.simulationAttrOpts.alpha).restart();
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
	private tick(self: DGLOsMatt): () => void {
		return () => self.tock();
	}

	/**
	 *  (Tick) Tock called during simulation updating x and y positions of DOM elements.
	 */
	private tock(): void {
		let self = this;

		if (!this.multipleTimestepsEnabled) { //check if timeline view is enabled.
			//update groups in map; run update of simulation on all groups at the current timestep
			this.groupGlyphMap.forEach(function (glyphMap: Map<GroupGlyph, Selection<any, {}, any, {}>>, svgPosition: number): void {
				glyphMap.forEach(function (glyphs: Selection<any, {}, any, {}>, shape: GroupGlyph): void {
					shape.draw(glyphs, self.dataToDraw, self.timeStampIndex, self.attrOpts, self.noisePoints, self.voronoi, self.enterExitColorEnabled);
				});
			});
			//update edges in map; run update of simulation on all edges at the current timestep
			this.edgeGlyphMap.forEach(function (glyphMap: Map<EdgeGlyphShape, Selection<any, {}, any, {}>>, svgPosition: number): void {
				glyphMap.forEach(function (glyphs: Selection<any, {}, any, {}>, shape: EdgeGlyphShape): void {
					if (shape.shapeType === "Gestalt" && self.currentEdgeShape.shapeType !== "Gestalt") {

					} else {
						shape.draw(glyphs, self.dataToDraw, self.timeStampIndex, self.attrOpts, self.width, self.height, self.enterExitColorEnabled);
					}
				});
			});
			//update nodes in map; run update of simulation on all NodeGlyphs at the current timestep
			this.nodeGlyphMap.forEach(function (glyphMap: Map<NodeGlyphShape, Selection<any, {}, any, {}>>, svgPosition: number): void {
				glyphMap.forEach(function (glyphs: Selection<any, {}, any, {}>, shape: NodeGlyphShape): void {
					shape.draw(glyphs, self.dataToDraw, self.timeStampIndex, self.attrOpts, undefined, self.enterExitColorEnabled);
				});
			});
		}
		else {
			//update groups in map; run update of simulation on all groups accross multiple SVG elements
			this.groupGlyphMap.forEach(function (glyphMap: Map<GroupGlyph, Selection<any, {}, any, {}>>, svgPosition: number): void {
				glyphMap.forEach(function (glyphs: Selection<any, {}, any, {}>, shape: GroupGlyph): void {
					shape.draw(glyphs, self.dataToDraw, svgPosition, self.attrOpts, self.noisePoints, self.voronoi, self.enterExitColorEnabled);
				});
			});
			//update edges in map; run update of simulation on all edges accross multiple SVG elements
			this.edgeGlyphMap.forEach(function (glyphMap: Map<EdgeGlyphShape, Selection<any, {}, any, {}>>, svgPosition: number): void {
				glyphMap.forEach(function (glyphs: Selection<any, {}, any, {}>, shape: EdgeGlyphShape): void {
					if (shape.shapeType === "Gestalt" && self.currentEdgeShape.shapeType !== "Gestalt") {

					} else {
						shape.draw(glyphs, self.dataToDraw, svgPosition, self.attrOpts, self.width, self.height, self.enterExitColorEnabled);
					}
				});
			});
			//update nodes in map; run update of simulation on all NodeGlyphs accross multiple SVG elements
			this.nodeGlyphMap.forEach(function (glyphMap: Map<NodeGlyphShape, Selection<any, {}, any, {}>>, svgPosition: number): void {
				glyphMap.forEach(function (glyphs: Selection<any, {}, any, {}>, shape: NodeGlyphShape): void {
					shape.draw(glyphs, self.dataToDraw, svgPosition, self.attrOpts, undefined, self.enterExitColorEnabled);
				});
			});
		}
	}
}