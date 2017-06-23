import { Selection, select } from "d3-selection";
import { DGLOsSVGCombined } from "./DGLOsSVGCombined";
import { DGLOsWill } from "./DGLOsWill";

export class DGLOsSandwich extends DGLOsWill {

	/**
	 * Append and SVG element to the body per timestep in the DynammicGraph dataset.
	 * Elements will be classed as SVG_#.
	 * Initial drawNodeGlyphs() and drawEdgesGlyphs() must be called prior to calling drawTimesteps().
	 */
	public drawTimesteps() {
		if (this.data.timesteps.length > 1) {
			for (let i = 1; i < this.data.timesteps.length; i++) {
				let newSVG: Selection<any, {}, any, {}> = this.loc.append("svg") //TODO: needs to be a way to set the selection entry, ie. replace "body" varible
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
}