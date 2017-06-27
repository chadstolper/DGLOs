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
				let newSVG: Selection<any, {}, any, {}> = this.location.append("svg") //TODO: needs to be a way to set the selection entry, ie. replace "body" varible
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
	 * If timeline view is enabled, all SVG elements are removed from the DOM, and a new single one is created starting at the first timestep in the data.
	 * Takes as void n amount of SVGs, returns one SVG classed "SVG_1".
	 */
	public removeTimesteps() {
		let self = this;
		if (this.multipleTimestepsEnabled) {
			console.log("hi")
			let exitSVG = this.location.selectAll("svg").transition().delay(function (d: any, i: number): number {
				console.log(i)
				console.log(500 * (i + 1))
				return 500 * (i + 1);
			})
				.style("opacity", 0);
			// exitSVG.remove();
			// let newSVG: Selection<any, {}, any, {}> = this.location.append("svg")
			// 	.classed("SVG_1", true)
			// 	.attr("width", this.width)
			// 	.attr("height", this.height);
			// this.drawEdgeGlyphsAt(newSVG);
			// this.drawNodeGlyphsAt(newSVG); //TODO: expect chad not to like calling dglos inside dglos
			// this.transformNodeGlyphsTo(this.currentNodeShape);
			// this.transformEdgeGlyphsTo(this.currentEdgeShape);
			// this.simulation.restart();
		}
		this.multipleTimestepsEnabled = false;
	}
}