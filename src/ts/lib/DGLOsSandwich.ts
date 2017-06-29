import { Selection, select } from "d3-selection";
import { DGLOsSVGCombined } from "./DGLOsSVGCombined";
import { DGLOsWill } from "./DGLOsWill";

export class DGLOsSandwich extends DGLOsWill {

	/**
	 * Append a SVG element to the location per timestep in the DynammicGraph dataset.
	 * Elements will be classed as SVG_#.
	 * Initial drawNodeGlyphs() and drawEdgesGlyphs() should be called prior to calling drawTimesteps().
	 */
	public drawTimesteps() {
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
	public removeTimesteps(delay: number = 0) {
		let self = this;
		if (this.multipleTimestepsEnabled) {
			let reference: Array<number> = new Array<number>(); //array for reversing delay calculations
			let SVGMap: Map<number, Selection<any, {}, any, {}>> = new Map<number, Selection<any, {}, any, {}>>();
			for (let i = this.data.timesteps.length; i > 0; i--) {
				let getSVG = this.location.select("svg.SVG_" + i);
				SVGMap.set(i, getSVG);
				reference.push(i);
			}
			SVGMap.forEach(function (curSVG: Selection<any, {}, any, {}>, i: number) {
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
}