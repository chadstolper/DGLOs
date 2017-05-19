import * as d3 from "d3";
import * as d3force from "d3-force";
import { Simulation } from "d3-force";
import { Selection } from "d3-selection";
// import * as d3transition from "d3-transition";
//import {ForceLink} from "d3-force";
import { json } from "d3-request";
import { scaleOrdinal, schemeCategory20 } from "d3-scale";
import { Graph, Node, Edge } from "./Graph";
import { DynamicDrinkGraph } from "./DummyGraph";

let time = 0;
let width = 500;
let height = 500;

let simulation: Simulation<{}, undefined>;
let color = scaleOrdinal<string | number, string>(schemeCategory20); //random color picker.exe
let chart: Selection<any, {}, any, {}>;
let linkGlyphs: Selection<any, {}, any, {}>, nodeGlyphs: Selection<any, {}, any, {}>; //groups for "specific"
let linksG: Selection<any, {}, any, {}>, nodesG: Selection<any, {}, any, {}>; //groups for all

<<<<<<< HEAD
json("./data/dummy/dummy.json", function(response) {

    let dGraph: DynamicDrinkGraph = new DynamicDrinkGraph(response);
    initSVG();
    draw(dGraph.timesteps[time]);
    initSimulation();



    function initSimulation() {
        simulation = d3force.forceSimulation() //init sim for chart?
            .force("link", d3force.forceLink().id(function(d: Node): string { return "" + d.id })) //pull applied to link lengths
            .force("charge", d3force.forceManyBody()) //push applied to all things from center
            .force("center", d3force.forceCenter(width / 2, height / 2)) //define center
            .on("tick", ticked);
    }

    function initSVG() {
        chart = d3.select("#chart").append("svg")
            .attr("width", width)
            .attr("height", height)
            .on("click", mouseClicked);

        linksG = chart.append("g")
            .classed("links", true);

        nodesG = chart.append("g")
            .classed("node", true);
    }

    function ticked() {
        console.log("ticking...");
        if (linkGlyphs !== undefined) {
            //console.log(linkGlyphs);
            linkGlyphs //as in the lines representing links
                .attr("x1", function(d: Edge) { return d.source.x; })
                .attr("y1", function(d: Edge) { return d.source.y; })
                .attr("x2", function(d: Edge) { return d.target.x; })
                .attr("y2", function(d: Edge) { return d.target.y; });
        } else {
            console.log("No links!")
        }
        if (nodeGlyphs !== undefined) {
            //console.log(nodeGlyphs);
            nodeGlyphs
                .attr("cx", function(d: Node) {
                    // console.log(d);
                    return d.x;
                })
                .attr("cy", function(d: Node) { return d.y; });
        } else {
            console.log("No nodes!")
        }
    }

    function draw(graph: Graph): void {


        drawLinks(graph.edges);
        drawNodes(graph.nodes);

        if (simulation !== undefined) {
            simulation.nodes(graph.nodes); //call for sim tick (and apply force to nodes?)
            (simulation.force("link") as d3force.ForceLink<Node, Edge>).links(graph.edges)
                .strength(function(d: Edge): number { return d.weight * -.01 });
        }
    }

    function mouseClicked() {
        let curGraph: Graph = dGraph.timesteps[time];
        time = (time + 1) % 3;
        let newGraph: Graph = dGraph.timesteps[time];

        communicateNodePositions(curGraph, newGraph);
        draw(newGraph);
    }

    function communicateNodePositions(from: Graph, to: Graph) {
        for (let n of from.nodes) {
            let n_prime: Node = to.nodes.find(function(d) { return d.id === n.id; });
            n_prime.x = n.x;
            n_prime.y = n.y;
            n_prime.vx = n.vx;
            n_prime.vy = n.vy;
        }
    }

    function drawLinks(edges: Edge[]) {
        linkGlyphs = linksG.selectAll("line")
            .data(edges, function(d: Edge): string { return "" + d.id; }); //animate existing, dont create new line
        let linkEnter = linkGlyphs.enter().append("line"); //create a new line for each edge in edgelist (subdivs defined)
        linkGlyphs.merge(linkEnter).transition()
            .attr("stroke", "black")
            .attr("stroke-width", function(d: Edge): number { return d.weight; });
    }

    function drawNodes(nodes: Node[]) {
        nodeGlyphs = nodesG.selectAll("circle")
            .data(nodes, function(d: Node): string { return "" + d.id });
        let nodeEnter = nodeGlyphs.enter().append("circle");
        nodeGlyphs.merge(nodeEnter)
            .attr("r", 10)
            .attr("fill", function(d: Node): string { return color(d.id); });
    }
=======
json("./data/dummy/dummy.json", function (response) {

	let dGraph: DynamicDrinkGraph = new DynamicDrinkGraph(response);
	initSVG();
	draw(dGraph.timesteps[time]);
	//initSimulation();



	function initSimulation() {
		simulation = d3force.forceSimulation() //init sim for chart?
			.force("link", d3force.forceLink().id(function (d: Node): string { return "" + d.id })) //pull applied to link lengths
			.force("charge", d3force.forceManyBody()) //push applied to all things from center
			.force("center", d3force.forceCenter(width / 2, height / 2)) //define center
			.on("tick", ticked);
	}

	function initSVG() {
		chart = d3.select("#chart").append("svg")
			.attr("width", width)
			.attr("height", height)
			.on("click", mouseClicked);

		linksG = chart.append("g")
			.classed("links", true);

		nodesG = chart.append("g")
			.classed("node", true);
	}

	function ticked() {
		console.log("ticking...");
		if (linkGlyphs !== undefined) {
			linkGlyphs //as in the lines representing links
				.attr("x1", function (d: Edge) { return d.source.x; })
				.attr("y1", function (d: Edge) { return d.source.y; })
				.attr("x2", function (d: Edge) { return d.target.x; })
				.attr("y2", function (d: Edge) { return d.target.y; });
		} else {
			console.log("No links!");
		}
		if (nodeGlyphs !== undefined) {
			nodeGlyphs
				.attr("cx", function (d: Node) {
					return d.x;
				})
				.attr("cy", function (d: Node) { return d.y; });
		} else {
			console.log("No nodes!");
		}
	}

	function draw(graph: Graph): void {
		if (simulation !== undefined) {
			simulation.nodes(graph.nodes); //call for sim tick (and apply force to nodes?)
			(simulation.force("link") as d3force.ForceLink<Node, Edge>).links(graph.edges);
		}


		drawLinks(graph.edges);
		drawNodes(graph.nodes);

		if (simulation === undefined) {
			initSimulation();
		}
	}

	function mouseClicked() {
		let curGraph: Graph = dGraph.timesteps[time];
		time = (time + 1) % 3;
		let newGraph: Graph = dGraph.timesteps[time];

		communicateNodePositions(curGraph, newGraph);

		draw(newGraph);
	}

	function communicateNodePositions(from: Graph, to: Graph) {
		for (let n of from.nodes) {
			let n_prime: Node = to.nodes.find(function (d: Node) { return d.id === n.id; });
			n_prime.x = n.x;
			n_prime.y = n.y;
			n_prime.vx = n.vx;
			n_prime.vy = n.vy;
		}
	}

	function drawLinks(edges: Edge[]) {
		linkGlyphs = linksG.selectAll("line")
			.data(edges, function (d: Edge): string { return "" + d.id; }); //animate existing, dont create new line
		let linkEnter = linkGlyphs.enter().append("line"); //create a new line for each edge in edgelist (subdivs defined)
		linkGlyphs = linkGlyphs.merge(linkEnter)
		linkGlyphs.transition()
			.attr("stroke", "black")
			.attr("stroke-width", function (d: Edge): number { return d.weight; });
	}

	function drawNodes(nodes: Node[]) {
		nodeGlyphs = nodesG.selectAll("circle")
			.data(nodes, function (d: Node): string { return "" + d.id });
		let nodeEnter = nodeGlyphs.enter().append("circle");
		nodeGlyphs = nodeGlyphs.merge(nodeEnter)
		nodeGlyphs
			.attr("id", function (d: any): string | number { return d.name; })
			.attr("r", 10)
			.attr("fill", function (d: Node): string { return color(d.id); });
	}
>>>>>>> b7b919d13a2a87f08d6c48ba19f1be06236040ee
});