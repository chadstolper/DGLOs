// main.ts
// https://blog.mariusschulz.com/2016/06/27/bundling-es2015-modules-with-typescript-and-rollup

//import { square, cube } from "./math";
import * as d3 from "d3-selection"
import { json as d3json } from "d3-request";
import { Graph, Node, Edge } from "./Graph";
import { Person, Drink, DrinkEdge, StaticDrinkGraph } from "./DummyGraph";
import "willCSS.css";

d3json("data/dummy/dummy.json", function (response: any) {
	let graph = new StaticDrinkGraph(response);
	var edgeListLength = graph.edges.length;
	var nodeListLength = graph.nodes.length;


	for(let n in graph.nodes){
		console.log(n);
		alert("update");
	}
})

