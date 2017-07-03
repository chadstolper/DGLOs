import { Selection, select } from "d3-selection";
import { DGLOsSVGCombined } from "./DGLOsSVGCombined";
import { DGLOsWill } from "./DGLOsWill";
import { NodeGlyphShape } from "./NodeGlyphInterface";
import { EdgeGlyphShape } from "./EdgeGlyphInterface";
import { GroupGlyph } from "./GroupGlyphInterface";

export class DGLOsSandwich extends DGLOsWill {

	/**
	 * Append a SVG element to the location per timestep in the DynammicGraph dataset.
	 * Elements will be classed as SVG_#.
	 * Initial drawNodeGlyphs() and drawEdgesGlyphs() should be called prior to calling drawTimesteps().
	 */
	public drawTimesteps(): void {
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
	public removeTimesteps(delay: number = 0): void {
		let self = this;
		if (this.multipleTimestepsEnabled) {
			let reference: Array<number> = new Array<number>(); //array for reversing delay calculations
			let svgMap: Map<number, Selection<any, {}, any, {}>> = new Map<number, Selection<any, {}, any, {}>>();
			for (let i = this.data.timesteps.length; i > 0; i--) {
				let getSVG: Selection<any, {}, any, {}> = this.location.select("svg.SVG_" + i);
				svgMap.set(i, getSVG);
				reference.push(i);
			}
			svgMap.forEach(function (curSVG: Selection<any, {}, any, {}>, i: number): void {
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

	/**
	 * Removes all regions from the SVG at all timesteps. All DOM elements are removed, <g> of groupGlyphs not removed.
	 */
	public removeRegions() {
		this.groupGlyphMap.forEach(function (glyphMap: Map<GroupGlyph, Selection<any, {}, any, {}>>, svgPosition: number): void {
			glyphMap.forEach(function (glyphs: Selection<any, {}, any, {}>, shape: GroupGlyph): void {
				glyphs
					.transition()
					.style("opacity", 0)
					.remove();
			})
		})
	}

	/**
	 * Removes all Edges from the SVG at all timesteps. All DOM elements are removed, <g> of EdgeGlyphShape not removed.
	 */
	public removeEdgeGlyphs() {
		this.edgeGlyphMap.forEach(function (glyphMap: Map<EdgeGlyphShape, Selection<any, {}, any, {}>>, svgPosition: number): void {
			glyphMap.forEach(function (glyphs: Selection<any, {}, any, {}>, shape: EdgeGlyphShape): void {
				glyphs
					.transition()
					.style("opacity", 0)
					.remove();
			})
		})
	}

	/**
	 * Removes all Nodes from the SVG at all timesteps. All DOM elements are removed, <g> of NodeGlyphShape not removed.
	 */
	public removeNodeGlyphs() {
		this.nodeGlyphMap.forEach(function (glyphMap: Map<NodeGlyphShape, Selection<any, {}, any, {}>>, svgPosition: number): void {
			glyphMap.forEach(function (glyphs: Selection<any, {}, any, {}>, shape: NodeGlyphShape): void {
				glyphs
					.transition()
					.style("opacity", 0)
					.remove();
			})
		})
	}
}