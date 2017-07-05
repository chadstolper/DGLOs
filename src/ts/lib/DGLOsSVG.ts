import { DGLOsSVGBaseClass } from "./DGLOsSVGBaseClass";

import { Selection, select } from "d3-selection";
import { Node, Edge, Graph, DynamicGraph, MetaNode, MetaEdge } from "../model/dynamicgraph";
import * as d3force from "d3-force";
import { Simulation } from "d3-force";
import { NodeGlyphShape } from "./NodeGlyphInterface";
import { EdgeGlyphShape } from "./EdgeGlyphInterface";
import { GroupGlyph } from "./GroupGlyphInterface";
import { SVGAttrOpts } from "./SVGAttrOpts";
import { SimulationAttrOpts } from "./SVGSimulationAttrOpts";

import * as d3 from "d3-selection";
import { scaleLinear, scaleOrdinal, scalePoint, scaleBand } from "d3-scale";
import { extent } from "d3-array";
import calculateSize from "calculate-size"

import { VoronoiLayout, voronoi } from "d3-voronoi";


export class DGLOsSVG extends DGLOsSVGBaseClass {


	readonly ITERATIONS: number = 3;
	readonly REGION_STROKE_WIDTH: number = 0;
	readonly REGION_STROKE_WIDTH_EDGE: number = .25;
	readonly REGION_RADIUS: number = 1;


	/**
	 * Current timestep of the data.
	 */
	private _timeStampIndex: number = 0;
	/**
	 * A map of SVG related maps with pointers to their respective <g> tag selection by NodeGlyphShape.
	 * <SVG#, Map<NodeGlyphShape, Selection<any, {}, any, {}>>.
	 */
	private _nodeGlyphMap: Map<number, Map<NodeGlyphShape, Selection<any, {}, any, {}>>> = new Map<number, Map<NodeGlyphShape, Selection<any, {}, any, {}>>>();
	/**
	 * A map of SVG related maps with pointers to their respective <g> tag selection by EdgeGlyphShape.
	 * <SVG#, Map<EdgeGlyphShape, Selection<any, {}, any, {}>>.
	 */
	private _edgeGlyphMap: Map<number, Map<EdgeGlyphShape, Selection<any, {}, any, {}>>> = new Map<number, Map<EdgeGlyphShape, Selection<any, {}, any, {}>>>();
	/**
	 * A map of SVG related maps with pointers to their respective <g> tag selection by GroupGlyph.
	 * <SVG#, Map<GroupGlyph, Selection<any, {}, any, {}>>.
	 */
	private _groupGlyphMap: Map<number, Map<GroupGlyph, Selection<any, {}, any, {}>>> = new Map<number, Map<GroupGlyph, Selection<any, {}, any, {}>>>();
	/**
	 * The physics simulation used to direct force-directed visualizations.
	 */
	private _simulation: Simulation<any, undefined>;
	/**
	 * Boolean representing the existance of multiple SVG elements needing to be updated by timestep.
	 */
	private _multipleTimestepsEnabled: boolean = false;
	/**
	 * Boolean representing the current DGLO visualization being displayed.
	 * Extended to Gestalt.
	 */
	private _matrixViewEnabled: boolean = false;
	/**
	 * Boolean representing if enter exit coloring is enabled on the current visualization.
	 */
	private _enterExitColorEnabled: boolean = false;

	/**
	 * Holders for current shapes being used in the visualization.
	 */
	private _currentEdgeShape: EdgeGlyphShape = this.rectShape;
	private _currentNodeShape: NodeGlyphShape = this.circleShape;
	private _currentGroupGlyph: GroupGlyph = this.voronoiShape;
	/**
	 * Voronoi Tesselation mechanic holders.
	 * In case of rendering error, modify extent to larger values for calculations and Voronoi constraints.
	 */
	private readonly _voronoi: VoronoiLayout<Node> = voronoi<Node>().extent([[-this.width, -this.height], [this.width * 2, this.height * 2]])
		.x(function (d: Node): number { return d.x; })
		.y(function (d: Node): number { return d.y; });
	/**
	 * Array of random points held as an array for vornoi calculations and GMap visualization.
	 */
	private _noisePoints: Node[] = this.setNoisePoints();
	/**
	 * Attributes pertaining to SVG visualization.
	 */
	private _attrOpts: SVGAttrOpts = new SVGAttrOpts();
	/**
	 * Attributes pertaining to the simulation. Empty constructor defaults.
	 */
	private _simulationAttrOpts: SimulationAttrOpts = new SimulationAttrOpts();
	/**
	 * A map used for constructing an Egograph.
	 */
	private _neighboringNodesMap: Map<string | number, Node> = new Map<string | number, Node>();
	/**
	 * An array holding all of the nodes that neighbor the central node.
	 */
	private _nbrNodes: Array<Node>;
	/**
	 * An array holding all of the edges incident to the central node.
	 */
	private _nbrEdges: Array<Edge>;
	/**
	 * An array holding all of the instances of the cnetral node across all timesteps.
	 */
	private _centralNodeArray: Array<Node>;




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
									return (n.label.length * +self.attrOpts.font_size.substring(0, self.attrOpts.font_size.length - 2)) / self.simulationAttrOpts.divisorPX; //TODO: see wills implementation to find width to make simpler
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
	private tick(self: DGLOsSVG): () => void {
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


	private calculateMaxWordSize() {
		let maxLength: number = 0;
		for (let timestep of this.dataToDraw.timesteps) {
			for (let node of timestep.nodes) {
				const size = calculateSize(node.label);
				console.log(size.height);
				console.log(size.width);
			}
		}
	}



	/**
	 * Initialize and draw all EdgeGlyphshapes, adds them to Map and sets display to "none".
	 */
	public drawEdgeGlyphs() {
		this.drawEdgeGlyphsAt(this.drawLocation);
	}

	/**
	 * Initialize and draw all EdgeGlyphShapes to Selection, adds them to Map and sets display to "none".
	 * @param location: Selection<any, {}, any, {}>
	 */
	protected drawEdgeGlyphsAt(location: Selection<any, {}, any, {}>, SVGNum: number = 0) {

		let edgeG = location.append("g").classed("edgeG", true);

		let edgeRectG: Selection<any, {}, any, {}> = this.rectShape.init(edgeG);
		let edgeGestaltG: Selection<any, {}, any, {}> = this.gestaltShape.init(edgeG);
		let edgeSTLineG: Selection<any, {}, any, {}> = this.sourceTargetLineShape.init(edgeG);

		edgeRectG.style("display", "none");
		edgeGestaltG.style("display", "none");
		edgeSTLineG.style("display", "none");

		let glyphMap = new Map<EdgeGlyphShape, Selection<any, {}, any, {}>>();
		glyphMap.set(this.rectShape, edgeRectG);
		glyphMap.set(this.gestaltShape, edgeGestaltG);
		glyphMap.set(this.sourceTargetLineShape, edgeSTLineG);

		this.edgeGlyphMap.set(SVGNum, glyphMap);
	}

	/**
	 * tansformEdgeGlyphsTo is a DGLO method that calls the ___ _currentEdgeShape ___ transformTo method.
	 * It takes an __ EdgeGlyphShape __ in order to know what shape to transfrom th edge glyphs to.
	 */
	public transformEdgeGlyphsTo(shape: EdgeGlyphShape) {
		let self = this;
		this.edgeGlyphMap.forEach(function (edgeMap: Map<EdgeGlyphShape, Selection<any, {}, any, {}>>, timestep: number) {
			self.currentEdgeShape.transformTo(edgeMap.get(self.currentEdgeShape), shape, edgeMap.get(shape));
		});
		this.currentEdgeShape = shape;
	}

	/**
	 * SEARCHFORME!!!
	 */
	public positionEdgeGlyphsGestalt() {
		this.matrixViewEnabled = true;
		let self = this;
		if (this.currentEdgeShape.shapeType === this.gestaltShape.shapeType) {
			this.dataToDraw.metaEdges.forEach(function (meta: MetaEdge) {
				let innerGlyphSpacing = scaleLinear()
					.domain(extent(Array.from(meta.edges), function (d: Edge): number { //TODO: remove magic numbers, possibly move calculations to gestaltGlyphShape class.
						return d.timestep;
					}))
					.range([(3 / 10) * (self.height / self.dataToDraw.timesteps[self.timeStampIndex].nodes.length),
					(7 / 10) * (self.height / self.dataToDraw.timesteps[self.timeStampIndex].nodes.length)]);
				let gridScaleY = scaleBand<number>()
					.domain(self.dataToDraw.timesteps[self.timeStampIndex].nodes.map(function (d: any) {
						return d.index;
					}))
					.range([self.height / 8 + 10, self.height - 10]);
				let gridScaleX = scaleBand<number>()
					.domain(self.dataToDraw.timesteps[self.timeStampIndex].nodes.map(function (d: any) {
						return d.index;
					}))
					.range([self.width / 8 + 10, self.width - 10]);

				meta.edges.forEach(function (e: Edge) {
					e.x = gridScaleX(e.target.index);
					e.y = gridScaleY(e.source.index) + innerGlyphSpacing(e.timestep);
				});
			});
			let edgeList = new Array<Edge>();
			for (let step of this.dataToDraw.timesteps) {
				edgeList = edgeList.concat(step.edges);
			}
			let nodeList = new Array<Node>();
			let getNode = true;
			for (let key of this.dataToDraw.metaNodes.keys()) {
				for (let key2 of this.dataToDraw.metaNodes.get(key).nodes) {
					if (getNode) {
						nodeList = nodeList.concat(key2);
						getNode = false;
					}
				}
				getNode = true;
			}
			this.dataToDraw = new DynamicGraph([new Graph(nodeList, edgeList, 0)]);
			this.currentEdgeShape.draw(this.edgeGlyphMap.get(0).get(this.currentEdgeShape), this.dataToDraw, 0, this.attrOpts, this.width, this.height);
		}
		this.dataToDraw = this.data;
	}


	/**
	 * positionNodeGlyphsMatrix positions the Nodes along the axis of the Matrix
	 */
	public positionNodeGlyphsMatrix() {
		let self = this;
		this.matrixViewEnabled = true;
		this.attrOpts.width = this.width;
		this.attrOpts.height = this.height;
		if (!this.multipleTimestepsEnabled) {
			this.currentNodeShape.draw(this.nodeGlyphMap.get(0).get(this.currentNodeShape), this.dataToDraw, this.timeStampIndex, this.attrOpts, true, this.enterExitColorEnabled);
		}
		if (this.multipleTimestepsEnabled) {
			this.nodeGlyphMap.forEach(function (glyphMap: Map<NodeGlyphShape, Selection<any, {}, any, {}>>, timestep: number) {
				self.currentNodeShape.draw(glyphMap.get(self.currentNodeShape), self.dataToDraw, timestep, self.attrOpts, true, self.enterExitColorEnabled);
			});
		}
	}
	/**
	 * positionEdgeGlyphsMatrix positions the Edges as Rectangles in the matrix.
	 */
	public positionEdgeGlyphsMatrix() {
		let self = this;
		this.matrixViewEnabled = true;
		this.attrOpts.stroke_width_edge = null;
		this.attrOpts.width = this.width;
		this.attrOpts.height = this.height;
		if (!this.multipleTimestepsEnabled) {
			this.currentEdgeShape.draw(this.edgeGlyphMap.get(0).get(this.currentEdgeShape), this.dataToDraw, this.timeStampIndex, this.attrOpts, this.width, this.height, this.enterExitColorEnabled);
		}
		if (this.multipleTimestepsEnabled) {
			let self = this;
			this.edgeGlyphMap.forEach(function (glyphMap: Map<EdgeGlyphShape, Selection<any, {}, any, {}>>, timestep: number) {
				self.currentEdgeShape.draw(glyphMap.get(self.currentEdgeShape), self.dataToDraw, timestep, self.attrOpts, self.width, self.height, self.enterExitColorEnabled);
			});
		}
	}
	/**
	 * A method that appends buttons to the webpage which allow the user to move through 
	 * the dynamic graph's timesteps.
	 */
	public enableStepping() {
		let self = this;
		let buttonDiv = this.location.append("div").classed("buttons", true)
		let prevButton = buttonDiv.append("button")
			.text("<--")
			.on("click", function () {
				console.log("clicked");
				self.timeStampIndex = (self.timeStampIndex + self.data.timesteps.length - 1) % self.data.timesteps.length;
				if (!self.multipleTimestepsEnabled || self.matrixViewEnabled) {
					self.currentEdgeShape.draw(self.edgeGlyphMap.get(0).get(self.currentEdgeShape), self.data, self.timeStampIndex, self.attrOpts, self.width, self.height, self.enterExitColorEnabled);
					self.currentNodeShape.draw(self.nodeGlyphMap.get(0).get(self.currentNodeShape), self.dataToDraw, self.timeStampIndex, self.attrOpts, true, self.enterExitColorEnabled);
				}
				if (!self.matrixViewEnabled) {
					self.simulationAttrOpts.alpha = 0;
					self.positionNodesAndEdgesForceDirected(true);
				}
			});

		let nextButton = buttonDiv.append("button")
			.text("-->")
			.on("click", function () {
				console.log("clicked");
				self.timeStampIndex = (self.timeStampIndex + 1) % self.data.timesteps.length;
				if (!self.multipleTimestepsEnabled || self.matrixViewEnabled) {
					self.currentEdgeShape.draw(self.edgeGlyphMap.get(0).get(self.currentEdgeShape), self.data, self.timeStampIndex, self.attrOpts, self.width, self.height, self.enterExitColorEnabled);
					self.currentNodeShape.draw(self.nodeGlyphMap.get(0).get(self.currentNodeShape), self.dataToDraw, self.timeStampIndex, self.attrOpts, true, self.enterExitColorEnabled);
				}
				if (!self.matrixViewEnabled) {
					self.simulationAttrOpts.alpha = 0;
					self.positionNodesAndEdgesForceDirected(true);
				}
			});
	}
	/**
	 * Sets the central node and calls calculateNeighhborAndIncidentEdges.
	 * @param newID 
	 */
	public setCenterNode(newID: number | string) {
		this.centralNodeID = newID;
		this.emptyArrays();
		if (this.centralNodesEnabled) {
			this.calculateNeighborsAndIncidentEdges();
		}
	}
	/**
 	* _emptyArrays clears _nbrNodes, _nbrEdges, _neighboringNodesMap, and _centralNodeArray. It also
 	* sets the _fx and _fy properties of all nodes in _nbrNodes to null.
 	*/
	protected emptyArrays() {
		if (this.nbrNodes !== undefined) {
			for (let node of this.nbrNodes) {
				node.fx = null;
				node.fy = null;
			}
		}
		this.neighboringNodesMap.clear();
		this.centralNodeArray = [];
		this.nbrEdges = [];
		this.nbrNodes = [];
	}
	/**
	 * Calculates all edges and nodes that directly touch the central
	 * node in every timestep.
	 */
	protected calculateNeighborsAndIncidentEdges() {
		let self = this;
		this.getCentralNodes();
		this.setCentralNodeFixedPositions();
		this.getEdges();
		this.getNeighboringNodes();
		this.mergeNodeLists();
		this.dataToDraw = new DynamicGraph([new Graph(this.nbrNodes, this.nbrEdges, 0)]);
		let yScale = scaleLinear()
			.domain(extent(this.centralNodeArray, function (d: Node): number {
				return d.timestamp as number;
			}))
			.range([0 + (this.height * .15), this.height - (this.height * 0.15)]);
		for (let node of this.centralNodeArray) {
			node.fx = this.width / 2;
			node.fy = yScale(node.timestamp);
		}
		for (let node of this.dataToDraw.metaNodes.get(this.centralNodeID).nodes) {
			let meta = new MetaNode(node.id);
			meta.fx = self.width / 2;//node.fx;
			meta.fy = yScale(node.timestamp);//node.fy;
			meta.add(node);
			this.dataToDraw.metaNodes.set(node.label + ":" + node.timestamp, meta);
		}
		this.dataToDraw.metaNodes.delete(this.centralNodeID);
		if (this.centralNodesEnabled) {
			this.redrawEgo();
		}
	}
	/** collects a list of nodes with the same _origID across all timesteps and places them into
 	* __ _centralNodeArray ___.
 	*/
	protected getCentralNodes() {
		this.dataToDraw = this.data;
		for (let node of this.data.metaNodes.get(this.centralNodeID).nodes) {
			this.centralNodeArray.push(node);
		}
	}
	/**
	 * Sets the position of the central nodes.
 	*/
	protected setCentralNodeFixedPositions(): void {
		if (this.centralNodesEnabled) {
			let yScale = scaleLinear()
				.domain(extent(this.centralNodeArray, function (d: Node): number {
					return d.timestamp;
				}))
				.range([0 + (this.height * .15), this.height - (this.height * 0.15)]);
			for (let node of this.centralNodeArray) {
				node.fx = this.width / 2;
				node.fy = yScale(node.timestamp);
			}
		} else {
			this.centralNodesEnabled = false;
			for (let node of this.nbrNodes) {
				node.fx = null;
				node.fy = null;
			}
		}
	}
	/**
	 * Places all edges that touch the central nodes into __ _nbrEdges __.
	 */
	protected getEdges() {
		for (let i of this.dataToDraw.timesteps) {
			for (let e of i.edges) {
				if (this.centralNodeArray.includes(e.origSource) || this.centralNodeArray.includes(e.origTarget)) {
					this.nbrEdges.push(e);
				}
			}
		}
	}
	/**
	 * Collects all nodes that share an edge with the central nodes and places them into 
	 * __ _nbrNodes __
	 */
	protected getNeighboringNodes() {
		for (let edge of this.nbrEdges) {
			if (this.centralNodeArray.includes(edge.origTarget)) {
				this.neighboringNodesMap.set(edge.origSource.origID, edge.origSource);
			}
			if (this.centralNodeArray.includes(edge.origSource)) {
				this.neighboringNodesMap.set(edge.origTarget.origID, edge.origTarget);
			}
		}

		for (let edge of this.nbrEdges) {
			if (this.neighboringNodesMap.has(edge.origSource.origID)) {
				edge.source = this.neighboringNodesMap.get(edge.origSource.origID);
				edge.target = edge.origTarget;
			}
			if (this.neighboringNodesMap.has(edge.origTarget.origID)) {
				edge.target = this.neighboringNodesMap.get(edge.origTarget.origID);
				edge.source = edge.origSource;
			}
		}
		//convert the map to an array
		for (let key of this.neighboringNodesMap.keys()) {
			this.nbrNodes.push(this.neighboringNodesMap.get(key));
		}
	}
	/**
 	* Merges __ _centralNodeArray __ into __ _nbrNodes __
 	*/
	protected mergeNodeLists() {
		for (let node of this.centralNodeArray) {
			this.nbrNodes.push(node);
		}
	}
	/**
	 * Redraws the graph.
	 */
	public redrawEgo(): void {
		this.currentEdgeShape.draw(this.edgeGlyphMap.get(0).get(this.currentEdgeShape), this.dataToDraw, 0, this.attrOpts, this.width, this.height);
		this.currentNodeShape.draw(this.nodeGlyphMap.get(0).get(this.currentNodeShape), this.dataToDraw, 0, this.attrOpts, undefined);
		if (this.centralNodesEnabled) {
			this.positionNodesAndEdgesForceDirected(true);
		}
	}
	/**
	 * A DGLO that decides if central nodes should have fixed positions, and then
	 * redraws.	
	 * @param fixed
	 */
	public fixCentralNodePositions(fixed: boolean): void {
		this.centralNodesEnabled = fixed;
		this.setCentralNodeFixedPositions();
		//this.redraw();
	}

	/**
	 * Append a SVG element to the location per timestep in the DynammicGraph dataset.
	 * Elements will be classed as SVG_#.
	 * Initial drawNodeGlyphs() and drawEdgesGlyphs() should be called prior to calling drawTimesteps().
	 */
	public drawTimesteps(): void {
		if (this.data.timesteps.length > 1) {
			for (let i = 1; i < this.data.timesteps.length; i++) {
				let newSVG: Selection<any, {}, any, {}> = this.location.append("svg")
					.classed("SVG_" + (i + 1), true)
					.attr("width", this.width)
					.attr("height", this.height);
				this.drawEdgeGlyphsAt(newSVG, i);
				this.drawNodeGlyphsAt(newSVG, i);
				this.drawRegionsAt(newSVG, i);
			}
			this.multipleTimestepsEnabled = true;
		}
	}

	/**
	 * If timeline view is enabled, all SVG elements except SVG_1 are removed. If not specified, delay between SVG removal defaults to 0 seconds.
	 * @param delay
	 */
	public removeTimesteps(delay: number = 0): void {
		let self = this;
		if (this.multipleTimestepsEnabled) {
			let reference: Array<number> = new Array<number>(); //array for reversing delay calculations
			let svgMap: Map<number, Selection<any, {}, any, {}>> = new Map<number, Selection<any, {}, any, {}>>();
			for (let i = this.data.timesteps.length; i > 0; i--) {
				let getSVG: Selection<any, {}, any, {}> = this.location.select("svg.SVG_" + i);
				svgMap.set(i, getSVG);
				reference.push(i);
			}
			svgMap.forEach(function (curSVG: Selection<any, {}, any, {}>, i: number): void {
				if (i !== 1) {
					curSVG.transition().delay(function (): number {
						return delay * reference[i - 1];
					})
						.style("opacity", 0);
					curSVG.transition().delay(delay * reference.length).remove();
				}
			});
		}
		this.multipleTimestepsEnabled = false;
	}

	/**
	 * Removes all regions from the SVG at all timesteps. All DOM elements are removed, <g> of groupGlyphs not removed.
	 */
	public removeRegions(): void {
		this.groupGlyphMap.forEach(function (glyphMap: Map<GroupGlyph, Selection<any, {}, any, {}>>, svgPosition: number): void {
			glyphMap.forEach(function (glyphs: Selection<any, {}, any, {}>, shape: GroupGlyph): void {
				glyphs
					.transition()
					.style("opacity", 0)
					.remove();
			})
		})
	}

	/**
	 * Removes all Edges from the SVG at all timesteps. All DOM elements are removed, <g> of EdgeGlyphShape not removed.
	 */
	public removeEdgeGlyphs(): void {
		this.edgeGlyphMap.forEach(function (glyphMap: Map<EdgeGlyphShape, Selection<any, {}, any, {}>>, svgPosition: number): void {
			glyphMap.forEach(function (glyphs: Selection<any, {}, any, {}>, shape: EdgeGlyphShape): void {
				glyphs
					.transition()
					.style("opacity", 0)
					.remove();
			})
		})
	}

	/**
	 * Removes all Nodes from the SVG at all timesteps. All DOM elements are removed, <g> of NodeGlyphShape not removed.
	 */
	public removeNodeGlyphs(): void {
		this.nodeGlyphMap.forEach(function (glyphMap: Map<NodeGlyphShape, Selection<any, {}, any, {}>>, svgPosition: number): void {
			glyphMap.forEach(function (glyphs: Selection<any, {}, any, {}>, shape: NodeGlyphShape): void {
				glyphs
					.transition()
					.style("opacity", 0)
					.remove();
			})
		})
	}

	/**
	 * Initializes the noiseNodes[Node]. Random new nodes assigned with fixed x and y values along border.
	 */
	private setNoisePoints(): Node[] {
		let newNoiseNodes: Node[] = new Array<Node>();
		let iterator: number = 0;
		let limit: number = ((this.width + this.height) / 2) / 100 * 5;
		while (iterator < limit) {
			newNoiseNodes.push(new Node("NoiseNode" + (iterator + 0), iterator + 0, "noise", "", 0)); //top
			newNoiseNodes[iterator + 0].x = Math.floor((Math.random() * this._width) + 1);
			newNoiseNodes[iterator + 0].y = 0;

			newNoiseNodes.push(new Node("NoiseNode" + (iterator + 1), iterator + 1, "noise", "", 0)); //bottom
			newNoiseNodes[iterator + 1].x = Math.floor((Math.random() * this._width) + 1);
			newNoiseNodes[iterator + 1].y = this._height;

			newNoiseNodes.push(new Node("NoiseNode" + (iterator + 2), iterator + 2, "noise", "", 0)); //left
			newNoiseNodes[iterator + 2].x = 0;
			newNoiseNodes[iterator + 2].y = Math.floor((Math.random() * this._height) + 1);

			newNoiseNodes.push(new Node("NoiseNode" + (iterator + 3), iterator + 3, "noise", "", 0)); //right
			newNoiseNodes[iterator + 3].x = this._width;
			newNoiseNodes[iterator + 3].y = Math.floor((Math.random() * this._height) + 1);
			iterator += 4;
		}
		return newNoiseNodes;
	}

	set timeStampIndex(num: number) {
		this._timeStampIndex = num;
	}
	get timeStampIndex(): number {
		return this._timeStampIndex;
	}
	get nodeGlyphMap(): Map<number, Map<NodeGlyphShape, Selection<any, {}, any, {}>>> {
		return this._nodeGlyphMap;
	}
	get edgeGlyphMap(): Map<number, Map<EdgeGlyphShape, Selection<any, {}, any, {}>>> {
		return this._edgeGlyphMap;
	}
	get groupGlyphMap(): Map<number, Map<GroupGlyph, Selection<any, {}, any, {}>>> {
		return this._groupGlyphMap;
	}
	set simulation(newSim: Simulation<any, undefined>) {
		this._simulation = newSim;
	}
	get simulation(): Simulation<any, undefined> {
		return this._simulation;
	}
	set multipleTimestepsEnabled(boo: boolean) {
		this._multipleTimestepsEnabled = boo;
	}
	get multipleTimestepsEnabled(): boolean {
		return this._multipleTimestepsEnabled;
	}
	set matrixViewEnabled(boo: boolean) {
		this._matrixViewEnabled = boo;
	}
	get matrixViewEnabled(): boolean {
		return this._matrixViewEnabled;
	}
	set enterExitColorEnabled(boo: boolean) {
		this._enterExitColorEnabled = boo;
	}
	get enterExitColorEnabled(): boolean {
		return this._enterExitColorEnabled;
	}
	set currentEdgeShape(shape: EdgeGlyphShape) {
		this._currentEdgeShape = shape;
	}
	get currentEdgeShape(): EdgeGlyphShape {
		return this._currentEdgeShape;
	}
	set currentNodeShape(shape: NodeGlyphShape) {
		this._currentNodeShape = shape;
	}
	get currentNodeShape(): NodeGlyphShape {
		return this._currentNodeShape;
	}
	set currentGroupGlyph(shape: GroupGlyph) {
		this._currentGroupGlyph = shape;
	}
	get currentGroupGlyph(): GroupGlyph {
		return this._currentGroupGlyph;
	}
	get voronoi(): VoronoiLayout<Node> {
		return this._voronoi;
	}
	get noisePoints(): Node[] {
		return this._noisePoints;
	}
	set attrOpts(attr: SVGAttrOpts) {
		this._attrOpts = attr;
	}
	get attrOpts(): SVGAttrOpts {
		return this._attrOpts;
	}
	set simulationAttrOpts(attr: SimulationAttrOpts) {
		this._simulationAttrOpts = attr;
	}
	get simulationAttrOpts(): SimulationAttrOpts {
		return this._simulationAttrOpts;
	}
	set neighboringNodesMap(map: Map<string | number, Node>) {
		this._neighboringNodesMap = map;
	}
	get neighboringNodesMap(): Map<string | number, Node> {
		return this._neighboringNodesMap;
	}
	set nbrNodes(arr: Array<Node>) {
		this._nbrNodes = arr;
	}
	get nbrNodes(): Array<Node> {
		return this._nbrNodes;
	}
	set nbrEdges(arr: Array<Edge>) {
		this._nbrEdges = arr;
	}
	get nbrEdges(): Array<Edge> {
		return this._nbrEdges;
	}
	set centralNodeArray(arr: Array<Node>) {
		this._centralNodeArray = arr;
	}
	get centralNodeArray(): Array<Node> {
		return this._centralNodeArray;
	}
};