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

	protected drawNodeGlyphsAt(loc: Selection<any, {}, any, {}>) {
		//create "g" group for nodes; parent "g". Acts as pseudo init() function
		// if (this._nodeG === undefined) {
		let nodeG = loc.append("g").classed("nodeG", true);

		//create child "g" in parent for NodeGlyphs
		let nodeLabelG: Selection<any, {}, any, {}> = this.labelShape.init(nodeG);
		let nodeCircleG: Selection<any, {}, any, {}> = this.circleShape.init(nodeG);

		nodeLabelG.style("display", "none");
		nodeCircleG.style("display", "none");

		//add nodes to new map
		this._nodeGlyphMapMap.set(this._timeStampIndex, this._nodeGlyphMap.set(this.labelShape, nodeLabelG));
		this._nodeGlyphMapMap.set(this._timeStampIndex, this._nodeGlyphMap.set(this.circleShape, nodeCircleG));
		// }
	}

	public drawRegions() {
		this._currentGroupGlyph = this.voronoiGroupGlyph;
		this.voronoiInit();

		if (this._groupGlyphG === undefined) {
			this._groupGlyphG = this.loc.append("g").classed("groupG", true).lower();

			//create child "g" in parent for GroupGlyphs
			let voronoiG: Selection<any, {}, any, {}> = this.voronoiGroupGlyph.init(this._groupGlyphG);

			voronoiG.style("display", "none");

			//add voronoi regions to map
			this._groupGlyphMap.set(this.voronoiGroupGlyph, voronoiG);
		}

		this._currentGroupGlyph.transformTo(this._groupGlyphMap.get(this._currentGroupGlyph), this.voronoiGroupGlyph, this._groupGlyphMap.get(this.voronoiGroupGlyph));
	}

	/**
	 * Transforms/makes visible the target NodeGlyphShape
	 * @param shape 
	 */
	public transformNodeGlyphsTo(shape: NodeGlyphShape) {
		this._currentNodeShape.transformTo(this._nodeGlyphMap.get(this._currentNodeShape), shape, this._nodeGlyphMap.get(shape));
		this._currentNodeShape = shape;
		// this.runSimulation(true);
	}

	/**
	 * Resets the visual attributes of the NodeGlyphShape
	 * @param attr 
	 */
	public setNodeGlyphAttrs(attr: SVGAttrOpts) {
		this._attrOpts = attr;
	}

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
					.force("link", d3force.forceLink().id(function (d: Node): string { return "" + d.id })) //Pull applied to EdgeGlyphs
					.force("charge", d3force.forceManyBody().strength(-50)) //Push applied to all things from center
					.force("center", d3force.forceCenter(self._width / 2, self._height / 2))
					.force("collide", d3force.forceCollide().radius(function (d: Node) {
						try {
							if (self._currentNodeShape.shapeType === "Label") {
								return d.label.length * 4; //TODO: replace 4 with font related function
							}
							else return self._attrOpts.radius;
						}
						catch (err) {
							return null;
						}
					})
						.iterations(2))
					.on("tick", this.ticked(self))
					.on("end", function () { console.log("SIMULATION DONE HALLELUJAH!"); });
			}
			if (this._simulation !== undefined) {
				this._simulation.nodes(self.data.timesteps[this._timeStampIndex].nodes);
				(this._simulation.force("link") as d3force.ForceLink<Node, Edge>).links(self.data.timesteps[this._timeStampIndex].edges);

				this._simulation.alpha(.5).restart();
			}

		} else {
			this._simulation.stop();
			this._simulationEnabled = false;
		}
		// this._simulationMap.forEach(function (sim: Simulation<any, any>, timestep: number) {
		// 	//Check simulation exists
		// 	if (sim === undefined) {
		// 		sim = d3force.forceSimulation()
		// 			.force("link", d3force.forceLink().id(function (d: Node): string { return "" + d.id })) //Pull applied to EdgeGlyphs
		// 			.force("charge", d3force.forceManyBody().strength(-50)) //Push applied to all things from center
		// 			.force("center", d3force.forceCenter(self._width / 2, self._height / 2))
		// 			.force("collide", d3force.forceCollide().radius(function (d: Node) {
		// 				try {
		// 					if (self._currentNodeShape.shapeType === "Label") {
		// 						return d.label.length * 4;
		// 					}
		// 					else return self._attrOpts.radius;
		// 				}
		// 				catch (err) {
		// 					return null;
		// 				}
		// 			})
		// 				.iterations(2))
		// 			.on("tick", self.ticked(self))
		// 			.on("end", function () { console.log("SIMULATION DONE HALLELUJAH!"); });
		// 	}
		// 	if (sim !== undefined) {
		// 		sim.nodes(self.data.timesteps[timestep].nodes);
		// 		(sim.force("link") as d3force.ForceLink<Node, Edge>).links(self.data.timesteps[timestep].edges);

		// 		sim.alpha(.5).restart();
		// 	}
		// 	self._simulationMap.set(timestep, sim);
		// })
		// else {
		// 	this._simulationMap.forEach(function (sim: Simulation<any, undefined>, timestep: number) {
		// 		sim.stop();
		// 	}
		// }
	}

	private ticked(self: DGLOsMatt) {
		return () => self.tick();
	}

	private tick() {
		let self = this; //d3 scope this issue

		this._groupGlyphMap.forEach(function (paths: Selection<any, {}, any, {}>, group: GroupGlyph) {
			group.draw(paths, self.data, self._timeStampIndex, self._groupAttrOpts, self._noisePoints, self._voronoi);
		});

		//update edges in map; run update of simulation on all edges
		this._edgeGlyphMap.forEach(function (edges: Selection<any, {}, any, {}>, shape: EdgeGlyphShape) {
			shape.draw(edges, self.dataToDraw, self._timeStampIndex, self._edgeAttrOpts);
		});

		//update nodes in map; run update of simulation on all NodeGlyphs
		this._nodeGlyphMapMap.forEach(function (nodeGlyphMap: Map<NodeGlyphShape, Selection<any, {}, any, {}>>, timestep: number) {
			nodeGlyphMap.forEach(function (glyphs: Selection<any, {}, any, {}>, shape: NodeGlyphShape) {
				console.log("glyphs")
				// self.metaTick();
				shape.draw(glyphs, self._data, timestep, self._attrOpts);
				// self.communicateNodePositions(self._data, self._data, self._timeStampIndex);
			})
		});
	}

	private metaTick() {
		let self = this;
		for (let step of this._data.timesteps) {
			for (let n of step.nodes) {
				let metaN = this._data.metaNodes.get(n.origID);
				metaN.x = n.x;
				metaN.y = n.y;
				this._data.metaNodes.set(n.origID, metaN);
			}
		}
		// console.log(this.data.metaNodes)
	}

	private communicateNodePositions(from: DynamicGraph, to: DynamicGraph, timestep: number) { //pass previous node positions to next generation
		for (let n of from.timesteps[timestep].nodes) {
			let n_prime: Node;
			try {
				n_prime = to.timesteps[timestep + 1].nodes.find(function (d: Node) { return d.id === n.id; });
			}
			catch (err) {
				console.log("timsestep revert to 0")
				n_prime = to.timesteps[0].nodes.find(function (d: Node) { return d.id === n.id; });
			}
			if (n_prime !== undefined) {
				n_prime.x = n.x;
				n_prime.y = n.y;
				n_prime.vx = n.vx;
				n_prime.vy = n.vy;
			}
		}
	}

	private voronoiInit() {
		this._cardinalPoints = [[0, 0], [this._width / 2, 0], [this._width, 0], [0, this._height / 2], [this._width, this._height / 2], [0, this._height], [this._width / 2, this._height], [this._height, this._width]];
		this._noisePoints = [new Node("noise0", this._cardinalPoints.length + 0, "noise", "", 0), new Node("noise1", this._cardinalPoints.length + 1, "noise", "", 0), new Node("noise2", this._cardinalPoints.length + 2, "noise", "", 0), new Node("noise3", this._cardinalPoints.length + 3, "noise", "", 0), new Node("noise4", this._cardinalPoints.length + 4, "noise", "", 0), new Node("noise5", this._cardinalPoints.length + 5, "noise", "", 0), new Node("noise6", this._cardinalPoints.length + 6, "noise", "", 0), new Node("noise7", this._cardinalPoints.length + 7, "noise", "", 0)];

		//give noisenodes (x, y) of cardinalPoints
		for (let i = 0; i < this._cardinalPoints.length; i++) {
			this._noisePoints[i].x = this._cardinalPoints[i][0];
			this._noisePoints[i].y = this._cardinalPoints[i][1];
		}
	}
}