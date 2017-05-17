import * as d3 from "d3";
import { Selection } from "d3-selection";
import { scaleOrdinal, scaleLinear, schemeCategory10 } from "d3-scale";
import { json as d3json } from "d3-request";
import { Graph, Node, Edge } from "./Graph";
import { Person, Drink, DrinkEdge, DynamicDrinkGraph, StaticDrinkGraph } from "./DummyGraph";

let time = 0;
let width = 500;
let height = 500;
let simulation = d3.forceSimulation() //init sim for chart?
	.force("link", d3.forceLink().id(function(d: Node) : string {return ""+ d.id})) //pull applied to link lengths
	.force("charge", d3.forceManyBody()) //push applied to all things from center
	.force("center", d3.forceCenter(width/2, height/2)); //define center
let color = d3.scaleOrdinal(d3.schemeCategory20); //random color picker.exe
 
d3.json("./data/dummy/dummy.json", function(response)
{
	let dGraph : DynamicDrinkGraph = new DynamicDrinkGraph(response);
	let sGraph : StaticDrinkGraph  = dGraph.timesteps[time]
	let nodeList : Node[] = sGraph.nodes;
	let edgeList : DrinkEdge[] = sGraph.edges as DrinkEdge[]; //tis most edgy

	let chart = d3.select("#chart").append("svg")
		.attr("width", width)
		.attr("height", height)
		.on("click", function (d,i){mouseClicked()});

	//CREATE EDGE LINES
	let link = chart.append("g") //make a group of links
			.classed("links", true)
		.selectAll("line") //make subdiv of line (nebulous subdiv)
		.data(edgeList) //using this data
		.enter().append("line") //create a new line for each edge in edgelist (subdivs defined)
			.attr("stroke", "black")
			.attr("stroke-width", function(d: DrinkEdge) : string { return ""+d.preference*1;});

		console.log("got past lines");

	//CREATE NODE CIRCLES
	let node = chart.append("g")
      		.classed("node", true)
    	.selectAll("circle")
   		.data(nodeList)
    	.enter().append("circle")
      		.attr("r", 10)
      		.attr("fill", function(d) { return color(""+d.id); });

			console.log("got past nodes");

	simulation.nodes(nodeList) //call for sim tick (and apply force to nodes?)
		.on("tick", ticked);

	simulation.force("link")
		.initialize(edgeList); //begin force application to lines?

	function ticked()
	{
		console.log("ticking");
		link //as in the lines representing links
			.attr("x1", function(d : DrinkEdge) { return d.source.x; })
        	.attr("y1", function(d : DrinkEdge) { return d.source.y; })
	        .attr("x2", function(d : DrinkEdge) { return d.target.x; })
    	    .attr("y2", function(d : DrinkEdge) { return d.target.y; });
		node
			.attr("cx", function(d: Node) { return d.x; })
			.attr("cy", function(d: Node) { return d.y; });
	}

	function mouseClicked()
	{
		console.log("click");
		time++;
		if(time == 3)
		{
			time = 0;
		}
		let newTimeStamp = dGraph.timesteps[time];
		let newNodes = newTimeStamp.nodes;
		let newEdges = newTimeStamp.edges; //brand new pack of razers

		//code for making things new...yeah...stuff
	}
});