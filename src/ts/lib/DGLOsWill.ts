import { DGLOsSVGBaseClass } from "./DGLOsSVGBaseClass";
import { Selection } from "d3-selection";
import { Node, Edge, Graph, DynamicGraph, MetaNode, MetaEdge } from "../model/dynamicgraph";
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
import { scaleLinear, scaleOrdinal, scalePoint } from "d3-scale";
import { extent } from "d3-array";

export class DGLOsWill extends DGLOsMatt {
	/**
	 * Initialize and draw all EdgeGlyphshapes, adds them to Map and sets display to "none".
	 */
	public drawEdgeGlyphs() {
		this.drawEdgeGlyphsAt(this.loc);
	}

	/**
	 * Initialize and draw all EdgeGlyphShapes to Selection, adds them to Map and sets display to "none".
	 * @param loc: Selection<any, {}, any, {}> 
	 */
	protected drawEdgeGlyphsAt(loc: Selection<any, {}, any, {}>, timestep?: number) {
		let internalTime = 0;
		if (timestep !== undefined) {
			internalTime = timestep;
		}

		let edgeG = loc.append("g").classed("edgeG", true);

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

		this._edgeGlyphMap.set(internalTime, glyphMap);
	}

	/**
	 * setEdgeGlyphAtters is used to set the _edgeAttrOpts SVGAttrOpts object. This object
	 * determines the attributes that are used when drawing edges (e.g. color, thickness, etc..). 
	 * @param attr: SVGAttrOpts
	 */
	public setEdgeGlyphAttrs(attr: SVGAttrOpts) {
		this._edgeAttrOpts = attr;
	}
	/**
	 * tansformEdgeGlyphsTo is a DGLO method that calls the ___ _currentEdgeShape ___ transformTo method.
	 * It takes an __ EdgeGlyphShape __ in order to know what shape to transfrom th edge glyphs to.
	 */
	public transformEdgeGlyphsTo(shape: EdgeGlyphShape) {
		let self = this;
		this._edgeGlyphMap.forEach(function (edgeMap: Map<EdgeGlyphShape, Selection<any, {}, any, {}>>, timestep: number) {
			self.currentEdgeShape.transformTo(edgeMap.get(self.currentEdgeShape), shape, edgeMap.get(shape));
		});
		this.currentEdgeShape = shape;
	}

	public positionEdgeGlyphsGestalt() {
		this._matrixViewEnabled = true;
		let h = this._height;
		let w = this._width;
		let self = this;
		this.dataToDraw.timesteps
		this.dataToDraw.metaEdges.forEach(function (meta: MetaEdge) {
			let yScale = scaleLinear()
				.domain(extent(Array.from(meta.edges), function (d: Edge): number {
					return d.timestep;
				}))
				.range([0, h / self.dataToDraw.timesteps[self.timeStampIndex].nodes.length]);


			let gridScale = scalePoint<number>()
				.domain(self.dataToDraw.timesteps[self.timeStampIndex].edges.map(function (d: any) {
					return d.target.index;
				}))
				.range([h / 8, h]);


			meta.edges.forEach(function (e: Edge) {
				e.x = (w / 8) + (+e.source.index / self.dataToDraw.metaNodes.size) * (7 * w / 8);
				//Take a scale of this
				//e.y = (h / 8) + yScale(e.timestep) + (+e.target.index / self.dataToDraw.metaNodes.size) * (7 * h / 8);
				//e.y = (h / 8) + yScale(e.timestep) + gridScale(+e.target.index); /// self.dataToDraw.metaNodes.size) * (7 * h / 8);
				e.y = yScale(e.timestep) + gridScale(+e.target.index);
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
		this._currentEdgeShape.draw(this._edgeGlyphMap.get(0).get(this.currentEdgeShape), this.dataToDraw, 0, this._edgeAttrOpts, this._width, this._height);
	}
	public getNodeMatrixDomain(nodeList: Array<Node>): Array<number> {
		return extent(nodeList, function (d: Node): number {
			return d.index;
		});
	}
	/**
	 * positionNodeGlyphsMatrix positions the Nodes as Labels along the axis of the Matrix
	 */
	public positionNodeGlyphsMatrix() {
		let curGraph = this.dataToDraw.timesteps[this._timeStampIndex];
		let h = this._height;
		let w = this._width;
		let vertical = true;
		if (vertical) {
			let scale = scalePoint<number>()
				.domain(this.dataToDraw.timesteps[this.timeStampIndex].nodes.map(function (d) { return d.index; }))
				.range([h / 8, h])
				.padding(0.5);
			this.dataToDraw.timesteps.forEach(function (g: Graph) {
				g.nodes.forEach(function (d: Node) {
					d.x = w / 8 - (3 * w / 100);
					d.y = scale(d.index);
				});
			});
			//.domain(this.getNodeMatrixDomain(this.dataToDraw.timesteps[this.timeStampIndex].nodes))
			//.range([h / 8, (99 * h) / 100]);
			//.domain(this.getNodeMatrixDomain(this.dataToDraw.timesteps[this.timeStampIndex].nodes))
		} else {
			let scale = scalePoint<number>()
				.domain(this.dataToDraw.timesteps[this.timeStampIndex].nodes.map(function (d) { return d.index; }))
				.range([w / 8, w])
				.padding(0.5);
			this.dataToDraw.timesteps.forEach(function (g: Graph) {
				g.nodes.forEach(function (d: Node) {
					d.x = scale(d.index);
					d.y = h / 8 - (3 * h / 100);
				});
			});
		}
		if (!this.multipleTimestepsEnabled) {
			this._currentNodeShape.draw(this._nodeGlyphMap.get(0).get(this.currentNodeShape), this.dataToDraw, this._timeStampIndex, this._attrOpts);
		}
		if (this.multipleTimestepsEnabled) {
			let self = this;
			this.nodeGlyphMap.forEach(function (glyphMap: Map<NodeGlyphShape, Selection<any, {}, any, {}>>, timestep: number) {
				self.currentNodeShape.draw(glyphMap.get(self.currentNodeShape), self.dataToDraw, timestep, self._attrOpts);
			});
		}
	}
	/**
	 * positionEdgeGlyphsMatrix positions the Edges as Rectangles in the matrix.
	 */
	public positionEdgeGlyphsMatrix() {
		this._matrixViewEnabled = true;
		let h = this._height;
		let w = this._width;
		this.dataToDraw.timesteps.forEach(function (g: Graph) {
			g.edges.forEach(function (e: Edge) {
				e.x = (+e.source.index / g.nodes.length) * w;
				e.y = (+e.target.index / g.nodes.length) * h;
			});
		});
		let _matrixAttrOpts = new SVGAttrOpts(this._edgeAttrOpts.fill, this._edgeAttrOpts.stroke, null, this._edgeAttrOpts.stroke_width,
			this._width / (this.dataToDraw.timesteps[this._timeStampIndex].nodes.length - 1), this._height / (this.dataToDraw.timesteps[this._timeStampIndex].nodes.length - 1),
			this._edgeAttrOpts.opacity)
		if (!this.multipleTimestepsEnabled) {
			this._currentEdgeShape.draw(this._edgeGlyphMap.get(0).get(this.currentEdgeShape), this.dataToDraw, this._timeStampIndex, _matrixAttrOpts, this._width, this._height);
		}
		if (this.multipleTimestepsEnabled) {
			let self = this;
			this._edgeGlyphMap.forEach(function (glyphMap: Map<EdgeGlyphShape, Selection<any, {}, any, {}>>, timestep: number) {
				self.currentEdgeShape.draw(glyphMap.get(self.currentEdgeShape), self.dataToDraw, timestep, _matrixAttrOpts, this._width, this._height);
			});
		}
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
				if (!self._multipleTimestepsEnabled) {
					self.currentEdgeShape.draw(self._edgeGlyphMap.get(0).get(self.currentEdgeShape), self.data, self._timeStampIndex, _matrixAttrOpts, self._width, self._height); //TODO: change matrixattropts as needed?
				}
				if (!self._matrixViewEnabled) {
					self.positionNodesAndEdgesForceDirected(true);
				}
			});

		let nextButton = buttonDiv.append("button")
			.text("-->")
			.on("click", function () {
				console.log("clicked");
				self._timeStampIndex = (self._timeStampIndex + 1) % self.data.timesteps.length;
				if (!self._multipleTimestepsEnabled) {
					self.currentEdgeShape.draw(self._edgeGlyphMap.get(0).get(self.currentEdgeShape), self.data, self._timeStampIndex, _matrixAttrOpts, self._width, self._height);
				}
				if (!self._matrixViewEnabled) {
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
		this._emptyArrays();
		this._calculateNeighborsAndIncidentEdges();
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
	 * Calculates all edges and nodes that directly touch the central
	 * node in every timestep.
	 */
	protected _calculateNeighborsAndIncidentEdges() {
		this._getCentralNodes();
		this._setCentralNodeFixedPositions();
		this._getEdges();
		this._getNeighboringNodes();
		this._mergeNodeLists();
		this.dataToDraw = new DynamicGraph([new Graph(this._nbrNodes, this._nbrEdges, 0)]);
		let self = this;
		let yScale = scaleLinear()
			.domain(extent(this._centralNodeArray, function (d: Node): number {
				return d.timestamp as number;
			}))
			.range([0 + (this._height * .15), this._height - (this._height * 0.15)])
		for (let node of this._centralNodeArray) {
			node.fx = this._width / 2;
			node.fy = yScale(node.timestamp);
		}
		let check = 0;
		for (let node of this.dataToDraw.metaNodes.get(this.centralNodeID).nodes) {
			let meta = new MetaNode(node.id);
			console.log(node.fx);
			meta.fx = self._width / 2;//node.fx;
			console.log(node.label + ": " + node.timestamp);
			meta.fy = yScale(node.timestamp);//node.fy;
			meta.add(node);
			this.dataToDraw.metaNodes.set(node.label + ":" + node.timestamp, meta);
			check++;
		}
		check = 0;
		this.dataToDraw.metaNodes.delete(this.centralNodeID);
		if (this.onClickRedraw) {
			this.redrawEgo();
		}
	}



	/**
	 * collects a list of nodes with the same _origID across all timesteps and places them into
 	* __ _centralNodeArray ___.
 	*/
	protected _getCentralNodes() {
		this.dataToDraw = this.data;
		for (let node of this.data.metaNodes.get(this.centralNodeID).nodes) {
			this._centralNodeArray.push(node);
		}
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
	}
	public drawAllEdgeGlyphs() {
		let index = 0;
		for (let step of this.data.timesteps[index].edges) {

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
	 * Redraws the graph.
	 */
	public redrawEgo(): void {
		this.currentEdgeShape.draw(this.edgeGlyphMap.get(0).get(this.currentEdgeShape), this.dataToDraw, 0, this._edgeAttrOpts, this._width, this._height);
		this.currentNodeShape.draw(this.nodeGlyphMap.get(0).get(this.currentNodeShape), this.dataToDraw, 0, this._attrOpts);
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
		this._setCentralNodeFixedPositions();
		//this.redraw();
	}

}
