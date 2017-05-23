import { ForceDirectedGraph } from "./ForceDirectedGraph";
import { DynamicGraph, Graph, Node, Edge } from "./Graph";
import { Selection } from "d3-selection";

export class AnimatedForceDirectedGraph extends ForceDirectedGraph {
	private time = 0;

	constructor(graph: DynamicGraph, chart: Selection<any, {}, any, {}>) {
		super(graph, chart);
	}

	protected initSVG() {
		super.initSVG();
		//console.log("calling subclass");
		this.chart.on("click", this.mouseClicked(this));
	}

	private mouseClicked(self: AnimatedForceDirectedGraph) { //mouselistener, update timestep of graph
		return function (d: any, i: any): void {//wrapped for d3
			let curGraph: Graph = self.graph.timesteps[self.time];
			self.time = (self.time + 1) % self.graph.timesteps.length;
			let newGraph: Graph = self.graph.timesteps[self.time];

			self.communicateNodePositions(curGraph, newGraph);

			self.draw(newGraph);
		}
	}

	private communicateNodePositions(from: Graph, to: Graph) { //pass previous node positions to next generation
		for (let n of from.nodes) {
			let n_prime: Node = to.nodes.find(function (d: Node) { return d.id === n.id; });
			n_prime.x = n.x;
			n_prime.y = n.y;
			n_prime.vx = n.vx;
			n_prime.vy = n.vy;
		}
	}
}