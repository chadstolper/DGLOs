import { DGLOsSVGBaseClass } from "./DGLOsSVGBaseClass";
import { Selection } from "d3-selection";
import { Node, Edge, Graph, DynamicGraph, MetaNode, MetaEdge } from "../model/dynamicgraph";
import { DGLOsSVGCombined } from "./DGLOsSVGCombined";
import { DGLOsMatt } from "./DGLOsMatt";
import { NodeGlyphShape } from "./NodeGlyphInterface"
import { EdgeGlyphShape } from "./EdgeGlyphInterface";
import { SVGAttrOpts } from "../lib/DGLOsSVG";
import * as d3 from "d3-selection";
import { scaleLinear, scaleOrdinal, scalePoint, scaleBand } from "d3-scale";
import { extent } from "d3-array";

export class DGLOsWill extends DGLOsMatt {
	/**
	 * Initialize and draw all EdgeGlyphshapes, adds them to Map and sets display to "none".
	 */
	public drawEdgeGlyphs() {
		this.drawEdgeGlyphsAt(this.drawLocation);
	}

	/**
	 * Initialize and draw all EdgeGlyphShapes to Selection, adds them to Map and sets display to "none".  //TODO: update description for flubber
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
	 * setEdgeGlyphAtters is used to set the _edgeAttrOpts SVGAttrOpts object. This object
	 * determines the attributes that are used when drawing edges (e.g. color, thickness, etc..). 
	 * @param attr: SVGAttrOpts
	 */
	public setEdgeGlyphAttrs(attr: SVGAttrOpts) {
		this._attrOpts = new SVGAttrOpts(attr.fill, attr.stroke, attr.stroke_edge, attr.stroke_width, attr.stroke_width_edge, attr.radius, attr.width, attr.height, attr.opacity, attr.font_size);
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

	public positionEdgeGlyphsGestalt() {
		this._matrixViewEnabled = true;
		let h = this.height;
		let w = this.width;
		let self = this;
		if (this.currentEdgeShape.shapeType === this.gestaltShape.shapeType) {
			this.dataToDraw.metaEdges.forEach(function (meta: MetaEdge) {
				let innerGlyphSpacing = scaleLinear()
					.domain(extent(Array.from(meta.edges), function (d: Edge): number {
						return d.timestep;
					}))
					.range([(3 / 10) * (self.height / self.dataToDraw.timesteps[self.timeStampIndex].nodes.length),
					(7 / 10) * (self.height / self.dataToDraw.timesteps[self.timeStampIndex].nodes.length)]);
				let gridScaleY = scaleBand<number>()
					.domain(self.dataToDraw.timesteps[self.timeStampIndex].nodes.map(function (d: any) {
						return d.index;
					}))
					.range([h / 8 + 10, h - 10]);
				let gridScaleX = scaleBand<number>()
					.domain(self.dataToDraw.timesteps[self.timeStampIndex].nodes.map(function (d: any) {
						return d.index;
					}))
					.range([w / 8 + 10, w - 10]);

				meta.edges.forEach(function (e: Edge) {
					e.x = gridScaleX(e.target.index);
					e.y = gridScaleY(e.source.index) + innerGlyphSpacing(e.timestep);
				})
			})
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
			this._currentEdgeShape.draw(this._edgeGlyphMap.get(0).get(this.currentEdgeShape), this.dataToDraw, 0, this._attrOpts, this.width, this.height);
		}
		//TODO: Decide if this line is necessary
		this.dataToDraw = this.data;
	}
	/**
	 * positionNodeGlyphsMatrix positions the Nodes along the axis of the Matrix
	 */
	public positionNodeGlyphsMatrix() {
		let self = this;
    let _matrixAttrOpts = new SVGAttrOpts(this._attrOpts.fill, this._attrOpts.stroke, this._attrOpts.stroke_edge, this._attrOpts.stroke_width, this._attrOpts.stroke_width_edge,
			this._attrOpts.radius, this.width, this.height, this._attrOpts.opacity, this._attrOpts.font_size);
		if (!this.multipleTimestepsEnabled) {
			this._currentNodeShape.draw(this._nodeGlyphMap.get(0).get(this.currentNodeShape), this.dataToDraw, this._timeStampIndex, _matrixAttrOpts, true, this.enterExitColorEnabled);
		}
		if (this.multipleTimestepsEnabled) {
				this.nodeGlyphMap.forEach(function (glyphMap: Map<NodeGlyphShape, Selection<any, {}, any, {}>>, timestep: number) {
				self.currentNodeShape.draw(glyphMap.get(self.currentNodeShape), self.dataToDraw, timestep, _matrixAttrOpts, true, self.enterExitColorEnabled);
			});
		}
	}
	/**
	 * positionEdgeGlyphsMatrix positions the Edges as Rectangles in the matrix.
	 */
	public positionEdgeGlyphsMatrix() {
		let self = this;
		this.matrixViewEnabled = true;
		this.dataToDraw.timesteps.forEach(function (g: Graph) {
			g.edges.forEach(function (e: Edge) {
				e.x = (w / 8) + (+e.source.index / g.nodes.length) * (7 * w / 8);
				e.y = (h / 8) + (+e.target.index / g.nodes.length) * (7 * h / 8);
			});
		});
		//TODO: check matrix attr opts for correct parameter positions
		//TODO: _martixAttrOpts is what is making this code work, but it is an ugly solution imo. not very flexible.
		let _matrixAttrOpts = new SVGAttrOpts(this._attrOpts.fill, this._attrOpts.stroke, null, this._attrOpts.stroke_width as number,
			(7 / 8) * (w / (this.dataToDraw.timesteps[this._timeStampIndex].nodes.length)),
			(7 / 8) * (h / (this.dataToDraw.timesteps[this._timeStampIndex].nodes.length)), this._attrOpts.opacity)
		if (!this.multipleTimestepsEnabled) {
			this._currentEdgeShape.draw(this._edgeGlyphMap.get(0).get(this.currentEdgeShape), this.dataToDraw, this._timeStampIndex, _matrixAttrOpts, this.width, this.height, this.enterExitColorEnabled);
		}
		if (this.multipleTimestepsEnabled) {
			let self = this;
			let w = this.width;
			let h = this.height;
			this._edgeGlyphMap.forEach(function (glyphMap: Map<EdgeGlyphShape, Selection<any, {}, any, {}>>, timestep: number) {
				self.currentEdgeShape.draw(glyphMap.get(self.currentEdgeShape), self.dataToDraw, timestep, _matrixAttrOpts, w, h, self.enterExitColorEnabled);
			});
		}
	}
	/**
	 * A method that appends buttons to the webpage which allow the user to move through 
	 * the dynamic graph's timesteps.
	 */
	public enableStepping() {
		//TODO: _matrixAttrOpts shouldnt always be called here, this is a very hardcoded solution.
		let _matrixAttrOpts = new SVGAttrOpts(this._attrOpts.fill, this._attrOpts.stroke, null, this._attrOpts.stroke_width as number,
			(7 / 8) * (this.width / (this.dataToDraw.timesteps[this._timeStampIndex].nodes.length)), (7 / 8) * (this.height / (this.dataToDraw.timesteps[this._timeStampIndex].nodes.length)),
			this._attrOpts.opacity)


		let buttonDiv = this.location.append("div").classed("buttons", true)
		let prevButton = buttonDiv.append("button")
			.text("<--")
			.on("click", function () {
				console.log("clicked");
				self._timeStampIndex = (self._timeStampIndex + self.data.timesteps.length - 1) % self.data.timesteps.length;
				if (!self._multipleTimestepsEnabled || self.matrixViewEnabled) {
					self.currentEdgeShape.draw(self._edgeGlyphMap.get(0).get(self.currentEdgeShape), self.data, self._timeStampIndex, _matrixAttrOpts, self.width, self.height, self.enterExitColorEnabled); //TODO: change matrixattropts as needed?	
				}
				if (!self.matrixViewEnabled) {
					self._simulationAttrOpts.alpha = 0; //TODO: figure out how to fix this, or if this is even an issue...
					self.positionNodesAndEdgesForceDirected(true);
				}
			});

		let nextButton = buttonDiv.append("button")
			.text("-->")
			.on("click", function () {
				console.log("clicked");
				self.timeStampIndex = (self.timeStampIndex + 1) % self.data.timesteps.length;
				if (!self._multipleTimestepsEnabled || self.matrixViewEnabled) {
					self.currentEdgeShape.draw(self._edgeGlyphMap.get(0).get(self.currentEdgeShape), self.data, self._timeStampIndex, _matrixAttrOpts, self.width, self.height, self.enterExitColorEnabled);
				}
				if (!self.matrixViewEnabled) {
					self._simulationAttrOpts.alpha = 0;
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
		this.calculateNeighborsAndIncidentEdges();
	}
	/**
 	* _emptyArrays clears _nbrNodes, _nbrEdges, _neighboringNodesMap, and _centralNodeArray. It also
 	* sets the _fx and _fy properties of all nodes in _nbrNodes to null.
 	*/
	protected emptyArrays() {
		if (this._nbrNodes !== undefined) {
			for (let node of this._nbrNodes) {
				node.fx = null;
				node.fy = null;
			}
		}
		this._neighboringNodesMap.clear();
		this._centralNodeArray = [];
		this._nbrEdges = [];
		this._nbrNodes = [];
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
		if (this.onClickRedraw) {
			this.redrawEgo();
		}
	}
	/**
	* collects a list of nodes with the same _origID across all timesteps and places them into
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
		if (this.onClickRedraw) {
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
			this.onClickRedraw = false;
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
		for (let edge of this._nbrEdges) {
			if (this.centralNodeArray.includes(edge.origTarget)) {
				this.neighboringNodesMap.set(edge.origSource.origID, edge.origSource);
			}
			if (this.centralNodeArray.includes(edge.origSource)) {
				this.neighboringNodesMap.set(edge.origTarget.origID, edge.origTarget);
			}
		}

		for (let edge of this._nbrEdges) {
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
		this.currentEdgeShape.draw(this.edgeGlyphMap.get(0).get(this.currentEdgeShape), this.dataToDraw, 0, this._attrOpts, this.width, this.height);
		this.currentNodeShape.draw(this.nodeGlyphMap.get(0).get(this.currentNodeShape), this.dataToDraw, 0, this._attrOpts, undefined);
		if (this.onClickRedraw) {
			this.positionNodesAndEdgesForceDirected(true);
		}
	}
	/**
	 * A DGLO that decides if central nodes should have fixed positions, and then
	 * redraws.	
	 * @param newOnClickRedraw 
	 */
	public fixCentralNodePositions(newOnClickRedraw: boolean): void {
		this.onClickRedraw = newOnClickRedraw;
		this.setCentralNodeFixedPositions();
		//this.redraw();
	}

}
