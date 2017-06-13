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

		//add nodeselections to new map and map map
		let glyphMap = new Map<NodeGlyphShape, Selection<any, {}, any, {}>>();
		glyphMap.set(this.labelShape, nodeLabelG);
		glyphMap.set(this.circleShape, nodeCircleG);

		this._nodeGlyphMap.set(this._timeStampIndex, glyphMap);
		// }
	}

	public drawRegions() {
		this.voronoiInit();

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
			self._currentGroupGlyph.transformTo(groupMap.get(self._currentGroupGlyph), this.voronoiGroupGlyph, groupMap.get(this.voronoiGroupGlyph));
		});

		this._currentGroupGlyph = this.voronoiGroupGlyph;
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
					.force("link", d3force.forceLink().id(function (d: Node): string { return "" + d.origID })) //Pull applied to NodeGlyphs // change node to metanode? run simulation only based on meta?// label becomes complicated
					.force("charge", d3force.forceManyBody().strength(-50)) //Push applied to all things from center
					.force("center", d3force.forceCenter(self._width / 2, self._height / 2))
					// .force("collide", d3force.forceCollide().radius(function (d: MetaNode) {
					// 	try {
					// 		if (self.currentNodeShape.shapeType === "Label") {
					// 			return d.label.length * 4; //TODO: replace 4 with font related function
					// 		}
					// 		else return self._attrOpts.radius;
					// 	}
					// 	catch (err) {
					// 		return null;
					// 	}
					// })
					// 	.iterations(2))
					.on("tick", this.ticked(self))
					.on("end", function () {
						console.log(self.data.metaNodes)
						console.log("SIMULATION DONE HALLELUJAH!");
					});
			}
			if (this._simulation !== undefined) {
				this._simulation.nodes(self.data.timesteps[self._timeStampIndex].nodes);
				(this._simulation.force("link") as d3force.ForceLink<Node, Edge>).links(self.data.timesteps[this._timeStampIndex].edges);

				this._simulation.alpha(.5).restart();
			}

		} else {
			this._simulation.stop();
			this._simulationEnabled = false;
		}
	}

	private ticked(self: DGLOsMatt) {
		return () => self.tick();
	}

	private tick() {
		let self = this; //d3 scope this issue

		this._groupGlyphMap.forEach(function (GlyphMap: Map<GroupGlyph, Selection<any, {}, any, {}>>, timestep: number) {
			GlyphMap.forEach(function (glyphs: Selection<any, {}, any, {}>, shape: GroupGlyph) {
				// self.metaTick();
				shape.draw(glyphs, self.data, timestep, self._attrOpts);
			})
		});

		//update edges in map; run update of simulation on all edges
		this._edgeGlyphMap.forEach(function (GlyphMap: Map<EdgeGlyphShape, Selection<any, {}, any, {}>>, timestep: number) {
			GlyphMap.forEach(function (glyphs: Selection<any, {}, any, {}>, shape: EdgeGlyphShape) {
				// self.metaTick();
				shape.draw(glyphs, self.data, timestep, self._attrOpts);
			})
		});

		//update nodes in map; run update of simulation on all NodeGlyphs
		this._nodeGlyphMap.forEach(function (GlyphMap: Map<NodeGlyphShape, Selection<any, {}, any, {}>>, timestep: number) {
			GlyphMap.forEach(function (glyphs: Selection<any, {}, any, {}>, shape: NodeGlyphShape) {
				// console.log(self._nodeGlyphMap)
				self.communicateNodePositions();
				shape.draw(glyphs, self.data, timestep, self._attrOpts);
			})
		});
	}

	private communicateNodePositions() {
		for (let t of this.data.timesteps) {
			for (let n of t.nodes) {
				this.data.metaNodes.get(n.origID).nodes.forEach(function (node: Node) {
					console.log(n)
					console.log(node)
					n.x = node.x;
					n.y = node.y;
				});
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