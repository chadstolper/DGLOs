// main.ts
// https://blog.mariusschulz.com/2016/06/27/bundling-es2015-modules-with-typescript-and-rollup
//import { square, cube } from "./math";

import * as d3 from "d3-selection"
import { json as d3json } from "d3-request";
import { Graph, Node, Edge } from "./Graph";
import { Person, Drink, DrinkEdge, StaticDrinkGraph } from "./DummyGraph";
import "willCSS.css";

d3json("data/dummy/dummy.json", function (response: any) {
	let graph:StaticDrinkGraph = new StaticDrinkGraph(response);
	var edgeListLength = graph.edges.length;
	var nodeListLength = graph.nodes.length;

	let width = 650;
	let height = 650;
	let xAxis = 10;
	let yAxis = 10;
	let numPeople = 0;
	let numDrinks = 0; 

	//a loop to count the number of drinks and the number of people.
	//these numbers are neccessary to calculate the spacing of nodes
	//along their respective axis.
	for(let n of graph.nodes){
		if(n.type == "Person"){
			numPeople += 1;
		} else {
			numDrinks += 1;
		}
	}

	console.log("Number of people: " + numPeople);
	console.log("Number of drinks: " + numDrinks);

	//create an SVG element of width and height
	let svg = d3.select("#dGraph").append("svg")
	svg.attr("width", width)
		.attr("height", height);


	let curPerson = 1;
	let curDrink = 1;

	let nodes = svg.selectAll("nodes")
		.data(graph.nodes);
	nodes.enter().append("circle")
		.attr("cx", function (d) {
			if(d.type == "Person"){
				// the objectg is a person, therefore should be evenly
				// spaced along the xAxis
				let solution = ((((curPerson) / numPeople)*100) -5) + "%";
				curPerson += 1;
				return solution;
			} else {
				// the object is a drink, and should have a fixed
				// x position, i.e. the yAxis
				return yAxis;
			}
		})
		.attr("cy", function(d){
			if(d.type == "Person"){
				//The object is a person, so should have a fixed
				//y position, namely the xAxis
				return xAxis
			} else {
				//the object is a drink, so should be evenly spaced along
				// the yAxis
				let solution = (((curDrink / numDrinks) * 100) -5) + "%";
				curDrink += 1;
				return solution;
			}
		})
		.attr("r", 10)
		.attr("fill", "red")
		.attr("id", function(d){
			return d.id;
		})


	//sources are people, targets are drinks 
	let edges = svg.selectAll("edges")
		.data(graph.edges)
	edges.enter().append("line")
		.attr("x1", function (d) {
			if(d.target.id > 5){
				return 500;
			} else {
				return yAxis;
			}
		})
		.attr("y1", function (d) {
			if(d.target.id > 5){
				return 50; // 
			} else {
				return 30;
			}
		})
		.attr("x2", function (d) {
			return d.target.id *50;
		})
		.attr("y2", function (d) {
			return d.target.id * 50;
		})
		.attr("stroke", "black")
		.attr("stroke-width", 2);

})

