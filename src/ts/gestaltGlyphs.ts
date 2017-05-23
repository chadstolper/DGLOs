import * as d3 from "d3-selection";
import { scaleOrdinal, schemeCategory20 } from "d3-scale";
import { Selection } from "d3-selection";
import { DynamicGraph, Graph, Node, Edge } from "./Graph";
import { Person, Drink, DrinkEdge, StaticDrinkGraph, DynamicDrinkGraph } from "./DummyGraph";

const xPadding = 25; //particulars about individual Glyphs and SVG formatting
const yPadding = 10;
const glyphWidth = 50;
const glyphHeight = 30;

export class GestaltStaticGraph { //A2 over 2B, but 9S is pure
	private _timeStamps: number;
	private _width = xPadding; //used to start, not final dimension
	private _height = yPadding; //used to start, not final dimension
	private _graph: DynamicDrinkGraph;
	private _divChart: Selection<any, {}, any, {}>;
	private _color = scaleOrdinal<string | number, string>(schemeCategory20);

	public constructor(graph: DynamicDrinkGraph, divChart: Selection<any, {}, any, {}>) {
		this._timeStamps = graph.timesteps.length;
		this._graph = graph;
		this._divChart = divChart;
		this.initDimensions();
		this.init();
	}

	private init() {
		let SVG = this._divChart.append("svg")
			.attr("width", this._width)
			.attr("height", this._height);
		for (let i = 0; i < this._graph.timesteps.length; i++) {
			this.draw(i, SVG);
		}
	}

	private draw(newStamp: number, newSvg: Selection<any, {}, any, {}>) {
		this.drawEdges(newStamp, newSvg);
		this.drawNodes(newStamp, newSvg);
		// this.drawLabels()
	}

	private drawNodes(curStamp: number, svg: Selection<any, {}, any, {}>) {
		let color = this._color; //because d3 is messing with this again
		let nodes = this._graph.timesteps[curStamp].edges; //use source and target to set x,y
		let glyphs = svg.append("g") //create a new group
			.classed("glyphs" + curStamp, true) //group named glyph with current timestamp
			.selectAll("circle")// create nebulous circles
			.data(nodes) //with this data
			.enter() //and enter each data point in data with a circle
			.append("circle") //create the circle
			.classed("node", true) //called node
			.attr("cx", function (d: Edge): number {
				return (xPadding + (glyphWidth / 2)) + ((glyphWidth + xPadding) * (d.source.id as number - 5)); //75 + (125*id)
			})
			.attr("cy", function (d: Edge): number {
				return (curStamp * yPadding) + (yPadding + (glyphHeight / 2)) + ((glyphHeight + yPadding) * (d.target.id as number)); //35 + (50 * id)
			})
			.attr("r", 3)
			.attr("fill", function (d: Edge): string | number { return color(d.source.id) });
	}

	private drawEdges(curStamp: number, svg: Selection<any, {}, any, {}>) {
		let edges = this._graph.timesteps[curStamp].edges; //use source and target for x,y

		//Create right side of edges per node: preference
		let runes1 = svg.append("g") //runescape anyone?
			.classed("runesR" + curStamp, true)
			.selectAll("line")
			.data(edges)
			.enter() //see last for notes
			.append("line")
			.classed("rune", true)
			.attr("x1", function (d: Edge): number {
				return (xPadding + (glyphWidth / 2)) + ((glyphWidth + xPadding) * (d.source.id as number - 5)); //75 + (125*id)
			})
			.attr("y1", function (d: Edge): number {
				return (curStamp * yPadding) + (yPadding + (glyphHeight / 2)) + ((glyphHeight + yPadding) * (d.target.id as number)); //30 + (40 * id)
			})
			.attr("x2", function (d: Edge): number {
				let origin = (xPadding + (glyphWidth / 2)) + ((glyphWidth + xPadding) * (d.source.id as number - 5)); //75 + (125*id)
				return origin + (glyphWidth / 2); //length of the edge from node
			})
			.attr("y2", function (d: any): number {
				let origin = (yPadding + (glyphHeight / 2)) + ((glyphHeight + yPadding) * (d.target.id as number)); //30 + (40 * id)
				origin = (curStamp * yPadding) + (origin + d.preference * -10); //change angle from origin
				return origin;
			})
			.style("stroke", "black")
			.style("stroke-width", "2px")
			.style("stroke-linecap", "round");

		//create left side of edges per node : consumption
		let runes2 = svg.append("g") //runescape anyone?
			.classed("runesL" + curStamp, true)
			.selectAll("line")
			.data(edges)
			.enter() //see last for notes
			.append("line")
			.classed("rune", true)
			.attr("x1", function (d: Edge): number {
				return (xPadding + (glyphWidth / 2)) + ((glyphWidth + xPadding) * (d.source.id as number - 5)); //75 + (125*id)
			})
			.attr("y1", function (d: Edge): number {
				return (curStamp * yPadding) + (yPadding + (glyphHeight / 2)) + ((glyphHeight + yPadding) * (d.target.id as number)); //30 + (40 * id)
			})
			.attr("x2", function (d: Edge): number {
				let origin = (xPadding + (glyphWidth / 2)) + ((glyphWidth + xPadding) * (d.source.id as number - 5)); //75 + (125*id)
				return origin - (glyphWidth / 2); //length of the edge from node
			})
			.attr("y2", function (d: any): number {
				let origin = (yPadding + (glyphHeight / 2)) + ((glyphHeight + yPadding) * (d.target.id as number)); //30 + (40 * id)
				origin = (curStamp * yPadding) + (origin + d.consumption * -1); //change angle from origin
				return origin;
			})
			.style("stroke", "black")
			.style("stroke-width", "2px")
			.style("stroke-linecap", "round");
	}

	private initDimensions() {
		let data = this._graph.timesteps[0].nodes;
		for (let i = 0; i < data.length; i++) {
			//	for (n in data) { //why this doesnt work? who knows...
			let n = data[i];
			if (n.type === "Person") {
				this._width += glyphWidth + xPadding;
			}
			if (n.type === "Drink") {
				this._height += glyphHeight + yPadding;
			}
		}
		this._height += 100;
		// console.log("Dimensions set to: " + this.width + ", " + this.height);
	}
}