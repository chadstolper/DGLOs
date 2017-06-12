import { DGLOsSVGBaseClass } from "./DGLOsSVGBaseClass";
import { Selection } from "d3-selection";
import { Node, Edge, Graph, DynamicGraph } from "../model/dynamicgraph";
import { DGLOsSVGCombined } from "./DGLOsSVGCombined";
import { DGLOsMatt } from "./DGLOsMatt";
import { NodeGlyphShape } from "./NodeGlyphInterface"
import { EdgeGlyphShape } from "./EdgeGlyphInterface";
import { SVGAttrOpts } from "../lib/DGLOsSVG";
import { RectGlyphShape } from "./shapes/RectGlyphShape";
import { CircleGlyphShape } from "./shapes/CircleGlyphShape";
import { LabelGlyphShape } from "./shapes/LabelGlyphShape";
import { SourceTargetLineGlyphShape } from "./shapes/SourceTargetLineGlyphShape";
import { GestaltGlyphShape } from "./shapes/GestaltGlyphShape";
import * as d3 from "d3-selection";
import { scaleLinear } from "d3-scale";
import { extent } from "d3-array";

export class DGLOsWill extends DGLOsMatt {
	/**
	 * drawEdgeGlyphs is a DGLO responsible drawing edge glyphs. It creates the <g> tags
	 * that hold all of the glyphs (e.g. edgeRectG, edgeGestaltG, and edgeSTLineG). It then
	 * maps each of the shapeType objects to their respective <g> tag, thus linking the two.
	 * It hides all of the edge groups and then draws the currentEdgeShape.
	 */

	public drawEdgeGlyphs() {
		this.currentEdgeShape = this.rectShape;
		if (this._edgeG === undefined) {
			this._edgeG = this.loc.append("g").classed("edgeG", true);

			let edgeRectG: Selection<any, {}, any, {}> = this.rectShape.init(this._edgeG);
			let edgeGestaltG: Selection<any, {}, any, {}> = this.gestaltShape.init(this._edgeG);
			let edgeSTLineG: Selection<any, {}, any, {}> = this.sourceTargetLineShape.init(this._edgeG);

			this._edgeGlyphMap.set(this.rectShape, edgeRectG);
			this._edgeGlyphMap.set(this.gestaltShape, edgeGestaltG);
			this._edgeGlyphMap.set(this.sourceTargetLineShape, edgeSTLineG);

			edgeRectG.style("display", "none");
			edgeGestaltG.style("display", "none");
			edgeSTLineG.style("display", "none");
		}
	}
	/**
	 * setEdgeGlyphAtters is used to set the _edgeAttrOpts SVGAttrOpts object. This objecy
	 * determines the attributes that are used when drawing edges (e.g. color, thickness, etc..). 
	 * @param attr 
	 */
	public setEdgeGlyphAttrs(attr: SVGAttrOpts) {
		this._edgeAttrOpts = attr;
	}
	/**
	 * tansformEdgeGlyphsTo is a DGLO method that calls the ___ _currentEdgeShape ___ transformTo method.
	 * It takes an __ EdgeGlyphShape __ in order to know what shape to transfrom th edge glyphs to.
	 */
	public transformEdgeGlyphsTo(shape: EdgeGlyphShape) {
		this.currentEdgeShape.transformTo(this._edgeGlyphMap.get(this._currentEdgeShape), shape, this._edgeGlyphMap.get(shape));
		this.currentEdgeShape = shape;
		this.redraw();
	}
	public positionEdgeGlyphsGestalt() {
		this.redraw();
	}
	//TODO
	public positionNodeGlyphsMatrix() {
		let curGraph = this.dataToDraw.timesteps[this._timeStampIndex];
		let h = this._height;
		let w = this._width;
		this.dataToDraw.timesteps.forEach(function (g: Graph) {
			g.nodes.forEach(function (d: Node) {
				d.x = w / 10;
				d.y = d.index / curGraph.nodes.length * h;
			})
		})
		this._currentNodeShape.draw(this._nodeGlyphMap.get(this._currentNodeShape), this.dataToDraw, this._timeStampIndex, this._attrOpts);
	}
	/**
	 * positionEdgeGlyphsMatrix transforms edges to rectangles using the transfromEdgeGlyphsTo
	 * DGLO, and then positions the rectangles to form a matrix (heatmap).
	 */
	public positionEdgeGlyphsMatrix() {
		let h = this._height;
		let w = this._width;
		this.dataToDraw.timesteps.forEach(function (g: Graph) {
			g.edges.forEach(function (e: Edge) {
				e.x = (+e.source.index / g.nodes.length) * w;
				e.y = (+e.target.index / g.nodes.length) * h;
			})
		})
		let _matrixAttrOpts = new SVGAttrOpts(this._edgeAttrOpts.fill, this._edgeAttrOpts.stroke, null, this._edgeAttrOpts.stroke_width,
			this._width / (this.dataToDraw.timesteps[this._timeStampIndex].nodes.length - 1), this._height / (this.dataToDraw.timesteps[this._timeStampIndex].nodes.length - 1),
			this._edgeAttrOpts.opacity)
		this._currentEdgeShape.draw(this._edgeGlyphMap.get(this._currentEdgeShape), this.dataToDraw, this._timeStampIndex, _matrixAttrOpts);
	}
	/**
	 * A method that appends buttons to the webpage which allow the user to move through 
	 * the dynamic graph's timesteps.
	 */
	public enableStepping() {
		let _matrixAttrOpts = new SVGAttrOpts(this._edgeAttrOpts.fill, this._edgeAttrOpts.stroke, null, this._edgeAttrOpts.stroke_width,
			this._width / (this.dataToDraw.timesteps[this._timeStampIndex].nodes.length - 1), this._height / (this.dataToDraw.timesteps[this._timeStampIndex].nodes.length - 1),
			this._edgeAttrOpts.opacity)

		let self = this;

		let buttonDiv = d3.select("body").append("div").classed("buttons", true)
		let prevButton = buttonDiv.append("button")
			.text("<--")
			.on("click", function () {
				console.log("clicked");
				self._timeStampIndex = (self._timeStampIndex + self.data.timesteps.length - 1) % self.data.timesteps.length;
				self.currentEdgeShape.draw(self._edgeGlyphMap.get(self.currentEdgeShape), self.data, self._timeStampIndex, _matrixAttrOpts);
				self.runSimulation(true);
			});

		let nextButton = buttonDiv.append("button")
			.text("-->")
			.on("click", function () {
				console.log("clicked");
				self._timeStampIndex = (self._timeStampIndex + 1) % self.data.timesteps.length;
				self.currentEdgeShape.draw(self._edgeGlyphMap.get(self.currentEdgeShape), self.data, self._timeStampIndex, _matrixAttrOpts);
				self.runSimulation(true);
			});
	}
	/**
	 * Sets the central node and calls calculateNeighhborAndIncidentEdges.
	 * @param newID 
	 */
	public setCenterNode(newID: number | string) {
		this.centralNodeID = newID;
		this._emptyArrays();
		this._calculateNeighborsAndIncidentEdges();
	}
	/**
	 * Calculates all edges and nodes that directly touch the central
	 * node in every timestep.
	 */
	protected _calculateNeighborsAndIncidentEdges() {
		this.dataToDraw = this.data;
		this._getCentralNodes();
		this._setCentralNodeFixedPositions();
		for (let node of this._centralNodeArray) {
			console.log(node.label + ": " + node.fx + " " + node.fy);
		}
		this._getEdges();
		this._getNeighboringNodes();
		this._mergeNodeLists();
		this.dataToDraw = new DynamicGraph([new Graph(this._nbrNodes, this._nbrEdges, 0)]);
		//console.log(this._neighboringNodesMap)
		//console.log(this._nbrEdges, this._nbrNodes, this._centralNodeArray);
	}
	/**
	 * Redraws the graph.
	 */
	public redraw(): void {
		console.log("redrawing");
		this.currentEdgeShape.draw(this._edgeGlyphMap.get(this.currentEdgeShape), this.data, this._timeStampIndex, this._edgeAttrOpts);
		//this._currentNodeShape.draw(this._nodeGlyphMap.get(this._currentNodeShape), this.data, this._timeStampIndex, this._attrOpts);
	}
	/**
	 * _emptyArrays clears _nbrNodes, _nbrEdges, _neighboringNodesMap, and _centralNodeArray. It also
	 * sets the _fx and _fy properties of all nodes in _nbrNodes to null.
	 */
	protected _emptyArrays() {
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
	 * Sets the position of the central nodes.
	 */
	protected _setCentralNodeFixedPositions(): void {
		if (this.onClickRedraw) {
			let yScale = scaleLinear()
				.domain(extent(this._centralNodeArray, function (d: Node): number {
					return d.timestamp;
				}))
				.range([0 + (this._height * .15), this._height - (this._height * 0.15)])
			for (let node of this._centralNodeArray) {
				node.fx = this._width / 2;
				node.fy = yScale(node.timestamp);
			}
		} else {
			this.onClickRedraw = false;
			for (let node of this._nbrNodes) {
				node.fx = null;
				node.fy = null;
			}
		}
		console.log(this._centralNodeArray);
	}
	/**
	 * collects a list of nodes with the same _origID across all timesteps and places them into
	 * __ _centralNodeArray ___.
	 */
	protected _getCentralNodes() {
		for (let step of this.dataToDraw.timesteps) {
			for (let node of step.nodes) {
				if (node.origID === this.centralNodeID) {
					this._centralNodeArray.push(node);
				}
			}
		}
	}
	/**
	 * Places all edges that touch the central nodes into __ _nbrEdges __.
	 */
	protected _getEdges() {
		for (let step of this.dataToDraw.timesteps) {
			for (let edge of step.edges) {
				if (this._centralNodeArray.includes(edge.origSource)
					|| this._centralNodeArray.includes(edge.origTarget)) {
					this._nbrEdges.push(edge);
				}
			}
		}
	}
	/**
	 * Collects all nodes that share an edge with the central nodes and places them into 
	 * __ _nbrNodes __
	 */
	protected _getNeighboringNodes() {
		for (let edge of this._nbrEdges) {
			if (this._centralNodeArray.includes(edge.origTarget)) {
				this._neighboringNodesMap.set(edge.origSource.origID, edge.origSource);
			}
			if (this._centralNodeArray.includes(edge.origSource)) {
				this._neighboringNodesMap.set(edge.origTarget.origID, edge.origTarget);
			}
		}

		for (let edge of this._nbrEdges) {
			if (this._neighboringNodesMap.has(edge.origSource.origID)) {
				edge.source = this._neighboringNodesMap.get(edge.origSource.origID);
				edge.target = edge.origTarget;
			}
			if (this._neighboringNodesMap.has(edge.origTarget.origID)) {
				edge.target = this._neighboringNodesMap.get(edge.origTarget.origID);
				edge.source = edge.origSource;
			}
		}
		//convert the map to an array
		for (let key of this._neighboringNodesMap.keys()) {
			this._nbrNodes.push(this._neighboringNodesMap.get(key));
		}
	}
	/**
	 * Merges __ _centralNodeArray __ into __ _nbrNodes __
	 */
	protected _mergeNodeLists() {
		for (let node of this._centralNodeArray) {
			this._nbrNodes.push(node);
		}
	}
	/**
	 * A DGLO that decides if central nodes should have fixed positions, and then
	 * redraws.	
	 * @param newOnClickRedraw 
	 */
	public fixCentralNodePositions(newOnClickRedraw: boolean): void {
		this.onClickRedraw = newOnClickRedraw;
		this._setCentralNodeFixedPositions();
		//this.redraw();
	}

}
