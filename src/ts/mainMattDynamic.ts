import * as d3 from "d3";
import { Selection } from "d3-selection";
//import {ForceLink} from "d3-force";
import { scaleOrdinal, scaleLinear, schemeCategory10 } from "d3-scale";
import { json as d3json } from "d3-request";
import { Graph, Node, Edge } from "./Graph";
import { Person, Drink, DrinkEdge, DynamicDrinkGraph, StaticDrinkGraph } from "./DummyGraph";

let time = 0;
let width = 500;
let height = 500;
let simulation = d3.forceSimulation() //init sim for chart?
    .force("link", d3.forceLink().id(function(d: Node): string { return "" + d.id })) //pull applied to link lengths
    .force("charge", d3.forceManyBody()) //push applied to all things from center
    .force("center", d3.forceCenter(width / 2, height / 2)); //define center
let color = d3.scaleOrdinal(d3.schemeCategory20); //random color picker.exe
var chart: Selection<any, {}, any, {}>;
var link: Selection<any, {}, any, {}>, node: Selection<any, {}, any, {}>; //groups for "specific"
var links: Selection<any, {}, any, {}>, nodes: Selection<any, {}, any, {}>; //groups for all

d3.json("./data/dummy/dummy.json", function(response) {
    let dGraph: DynamicDrinkGraph = new DynamicDrinkGraph(response);
    let sGraph: StaticDrinkGraph = dGraph.timesteps[time]
    let nodeList: Node[] = sGraph.nodes;
    let edgeList: DrinkEdge[] = sGraph.edges as DrinkEdge[]; //tis most edgy

    let chart = d3.select("#chart").append("svg")
        .attr("width", width)
        .attr("height", height)
        .on("click", function(d, i) { mouseClicked() });

    //CREATE EDGE LINES
    links = chart.append("g")
        .classed("links", true);
    drawLinks(edgeList);
    console.log("got past lines");

    //CREATE NODE CIRCLES
    nodes = chart.append("g")
        .classed("node", true);
    drawNodes(nodeList);
    console.log("got past nodes");

    simulation.nodes(nodeList) //call for sim tick (and apply force to nodes?)
        .on("tick", ticked);

    let lforce: d3.ForceLink<Node, DrinkEdge> = simulation.force("link") as d3.ForceLink<Node, DrinkEdge>; //bug fix
    lforce.links(edgeList); //begin force application to lines?

    function ticked() {
        console.log("ticking");
        link //as in the lines representing links
            .attr("x1", function(d: DrinkEdge) { return d.source.x; })
            .attr("y1", function(d: DrinkEdge) { return d.source.y; })
            .attr("x2", function(d: DrinkEdge) { return d.target.x; })
            .attr("y2", function(d: DrinkEdge) { return d.target.y; });
        node
            .attr("cx", function(d: Node) { console.log("Coordinates= ", d.x, ":", d.y); return d.x; })
            .attr("cy", function(d: Node) { return d.y; });
    }

    function mouseClicked() {
        console.log("click");
        time = (time + 1) % 3;
        console.log("current timestamp = " + time);
        let newTimeStamp = dGraph.timesteps[time];
        let newEdges: DrinkEdge[] = newTimeStamp.edges as DrinkEdge[]; //brand new pack of razers
        let newNodes: Node[] = newTimeStamp.nodes as Node[];
        drawLinks(newEdges);
        drawNodes(newNodes)
        ticked();
    }

    function drawLinks(d: DrinkEdge[]) {
        console.log("drawing Links");
        link = links.selectAll("line")
            .data(d, function(d: DrinkEdge): any { return "" + d.id; }); //animate existing, dont create new line
        let linkEnter = link
            .enter().append("line"); //create a new line for each edge in edgelist (subdivs defined)
        console.log(linkEnter);
        link.merge(linkEnter).transition()
            .attr("stroke", "black")
            .attr("stroke-width", function(d: DrinkEdge): string { return "" + d.preference; });
    }

    function drawNodes(d: Node[]) {
        console.log("drawing nodes");
        node = nodes.selectAll("circle")
            .data(d, function(d: Node): any { return "" + d.id });
        let nodeEnter = node
            .enter().append("circle");
        console.log(nodeEnter);
        node.merge(nodeEnter).transition()
            .attr("r", 10)
            .attr("fill", function(d: Node): any { return color("" + d.id); });

    }
});