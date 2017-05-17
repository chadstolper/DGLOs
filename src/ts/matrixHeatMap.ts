/* Assumptions:
	-A dynamic graph is an array of graphs
	-A graph contains an array of nodes and an array of edges
	-A node has an id
	-An edge has a source, a target, and a weight
*/

import * as d3 from "d3-selection";
import { json as d3json } from "d3-request";
import { Graph, Node, Edge } from "./Graph";
import { Person, Drink, DrinkEdge, StaticDrinkGraph /*, dyanmicDrinkGraph*/ } from "./DummyGraph";

d3json("data/dummy/dummy.json", function (response: any){
	

});