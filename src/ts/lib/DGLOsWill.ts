import { DGLOsSVGBaseClass } from "./DGLOsSVGBaseClass";
import { Selection } from "d3-selection";
import { Node, Edge } from "../model/dynamicgraph";
import { ScaleOrdinal, scaleOrdinal, schemeCategory20b } from "d3-scale";
import * as d3force from "d3-force";
import { Simulation } from "d3-force";

import { DGLOsSVGCombinedBase } from "./DGLOsCombinedBase";
import { DGLOsMatt } from "./DGLOsMatt";

export class DGLOsWill extends DGLOsMatt {
	public drawEdgeGlyphs() {
		this._edgeG = this.loc.append("g")
			.classed("edges", true);

		this._nodeGlyphs = this._edgeG.selectAll("line")
			.data(this.data.timesteps[this._timeStampIndex].edges, function (d: Edge): string { return d.source + ":" + d.target });
		this._edgeGlyphs.exit().remove();

		let edgeEnter = this._edgeGlyphs.enter().append("line")
			.attr("id", function (d: Edge): string { return d.source + ":" + d.target })
			.attr("x1", 0)
			.attr("x2", 1)
			.attr("y1", 0)
			.attr("y2", 1)
			.attr("Stroke", "white");

		this._edgeGlyphs = this._edgeGlyphs.merge(edgeEnter);

	}
}