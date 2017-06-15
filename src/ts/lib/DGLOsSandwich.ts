import { DGLOsSVGBaseClass } from "./DGLOsSVGBaseClass";
import { Selection, select } from "d3-selection";
import { Node, Edge } from "../model/dynamicgraph";
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

export class DGLOsSandwich extends DGLOsWill {

	/**
	 * Append and SVG element to the body per timestep in the DynammicGraph dataset.
	 * Elements will be classed as SVG_Timestamp:#.
	 * Initial drawNodeGlyphs() and drawEdgesGlyphs() must be called prior to calling drawTimesteps().
	 */
	public drawTimesteps() {
		this._timeStampIndex++;
		if (this.data.timesteps.length > 1) {
			for (let i = 1; i < this.data.timesteps.length; i++) {
				let newSVG: Selection<any, {}, any, {}> = select("body").append("svg") //TODO: needs to be a way to set the selection entry, ie. replace "body" varible
					.classed("SVG_Timestamp:" + (i + 1), true)
					.attr("width", this._width).attr("height", this._height);
				this.drawEdgeGlyphsAt(newSVG);
				this.drawNodeGlyphsAt(newSVG);
				this._timeStampIndex++;
			}
			this._timeStampIndex = 0; //reset to 0;
			this._multipleTimestepsEnabled = true;
		}
	}
}