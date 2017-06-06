import { select, Selection } from "d3-selection";
import { json } from "d3-request";

import { DynamicGraph } from "./Graph";


import { VoronoiDiagram } from "./VoronoiDiagram";
import { ForceDirectedGraph } from "./ForceDirectedGraph";
import { AnimatedForceDirectedGraph } from "./AnimatedForceDirectedGraph";
import { AnimatedHeatmap } from "./AnimatedHeatmap";
import { GestaltStaticGraph } from "./gestaltGlyphs";
import { Egograph } from "./Egograph";

import { HeatmapTimeline } from "./HeatmapTimeline";


import { DynamicLesMiserablesGraph } from "./MiserablesGraph";
import { DynamicRadoslawGraph } from "./EmailGraph";
import { DynamicDrinkGraph } from "./DummyGraph";


let emails: DynamicGraph;
let dummy: DynamicGraph;
let lesmis: DynamicGraph;



function delayedMain() {
	// Uncomment ONLY ONE at a time!

	// drawGestalt(dummy);

	// drawEgograph(dummy);
	// drawEgograph(emails);

	// drawGMap(lesmis);

	// drawAnimatedForceDirectedGraph(dummy);
	// drawAnimatedForceDirectedGraph(emails);
	// drawAnimatedForceDirectedGraph(lesmis);

	// drawHeatmapTimeline(dummy);
	// drawHeatmapTimeline(emails);
	// drawHeatmapTimeline(lesmis);

	// drawAnimatedHeatmap(dummy);
	drawAnimatedHeatmap(emails);
	// drawAnimatedHeatmap(lesmis);

}






function drawSVG(): Selection<any, {}, any, {}> {
	let width: number;
	let height: number = width = 1000;
	let svg = select("body").append("svg")
		.attr("width", width)
		.attr("height", height);

	return svg;
}


function drawGestalt(g: DynamicGraph) {
	let svg = drawSVG();
	let gestalt: GestaltStaticGraph = new GestaltStaticGraph(g, svg);

}


function drawEgograph(g: DynamicGraph) {
	let svg = drawSVG();
	let ego: Egograph = new Egograph(g.timesteps[0].nodes[0], g, svg);
}

function drawAnimatedHeatmap(g: DynamicGraph) {
	let svg = drawSVG();
	let ahm = new AnimatedHeatmap(g, svg, ["white", "purple"]);
	ahm.draw(g.timesteps[0]);
}


function drawAnimatedForceDirectedGraph(g: DynamicGraph) {
	let svg = drawSVG();
	let afdg = new AnimatedForceDirectedGraph(g, svg);
	afdg.draw(g.timesteps[0]);
}


function drawGMap(g: DynamicGraph) {
	let svg = drawSVG();
	let fdmg = new VoronoiDiagram(g, svg);
	fdmg.alpha = .5;
	fdmg.radius = 1;
	fdmg.draw(g.timesteps[0]);
}



function drawHeatmapTimeline(g: DynamicGraph) {
	let div = select("body");
	let hmtl = new HeatmapTimeline(g, div, ["white", "purple"]);
	hmtl.width = 1000;
	hmtl.height = 1000;
	hmtl.draw(g.timesteps[0]);
}


json("data/radoslaw/emails.json", function (response: any) {
	emails = new DynamicRadoslawGraph(response);

	json("data/dummy/dummy.json", function (response: any) {
		dummy = new DynamicDrinkGraph(response);

		json("data/miserables/miserables.json", function (response: any) {
			lesmis = new DynamicLesMiserablesGraph(response);

			delayedMain();

		})
	})
})
