// main.ts
import * as d3 from "d3";
import { Graph, Node, Edge } from "./Graph";
import { Person, Drink, DrinkEdge, dummyJsonToGraph } from "./dummy_graph";


let colorscale = d3.scaleOrdinal(d3.schemeCategory10);

let chart = d3.select("body").append("svg")
	.attr("width", 500)
	.attr("height", 500);

d3.json("dummy.json", function(response){

	let rawNodeData:Array<any> = response[0].nodes;
	let rawEdgeData:Array<any> = response[0].edges;
	let nodeData:Graph = dummyJsonToGraph(rawNodeData, rawEdgeData);

	let nodes = chart.selectAll(".node")
		.data(nodeData.nodes) //calls the getter
	
	nodes.enter().append("g")
		.classed("node",true)
	
	nodes.style("fill",function(d:Node){
		//we are letting TS check that d is the right type
		//and warn us if it is ever not
		return colorscale(d.type)
	})

	
})


