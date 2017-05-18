import * as d3 from "d3-selection";
import { Selection } from "d3-selection";
import { json as d3json } from "d3-request";
import { DynamicGraph, Graph, Node, Edge } from "../Graph";
import { Person, Drink, DrinkEdge, StaticDrinkGraph, DynamicDrinkGraph } from "../DummyGraph";

d3json("data/dummy/dummy.json", function (response: any) {

	let graph: DynamicGraph = new DynamicDrinkGraph(response);

	console.log(graph.timesteps[0].edges[0].id);
});


