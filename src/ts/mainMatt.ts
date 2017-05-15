import * as d3 from "d3"

let width = 0;
let height = 0;
let timeStamp;
let stamp = 0
let nodeList;
let edgeList;
let canSwitch = true;

d3.json("./data/dummy/dummy.json", function(timeStamps){
	timeStamp = timeStamps[stamp]; //load in first timestep
	nodeList = timeStamp.nodes; //load in nodes of first timestep

	getChartDimensions(nodeList); // needed?
	console.log(width)
	console.log(height)

	let chart = d3.select("#chart").append("svg") //select chart div
		.attr("width", width)
		.attr("height", height)
		.on("click", function(d, i): any {
			mouseClickedEvent(timeStamps);
		});
	let nodes = chart.selectAll(".node") //create subdiv with data of node list
		.data(nodeList);
	nodes.append("g") //subsubdiv of groups
		.each(function(d : Node): any {console.log(d)})
		.classed("node", true);

	let hold = 0;
	nodes.enter().append("circle") //create circles
		.classed("people", true)
		.attr("cx", null)
		.attr("cy", null)
		.attr("r", 35)
		.attr("fill", "blue");

	/*	.attr("cx", function(d:any): any{
			if(d.type == "person") //therefore y axis
			{
				return 55;
			}//therefore x axis
			hold++;
			return 55 + 80 + (80*d.id);
		})
		.attr("cy", function(d:any): any {
			if(d.type == "person")
			{
				return 55 + 80 + (80*(d.id-5));
			}
			hold++;
			return 55;
		})
		.attr("r", 35)
		.attr("fill", "blue"); 
*/
	nodes.enter().append("text") //create text line 1
		.classed("title", true)
		.attr("x",function(d:any): any {
			if(d.type == "person") //therefore name (y axis)
			{
				return 30;
			}
			return 40 + 80 + (80*d.id);
		})
		.attr("y", function(d:any): any {
			if(d.type == "person")
			{
				return 50 + 80 + (80*d.id);
			}
			return 50;
		})
		.text(function(d:any): string { return d.name})
		.attr("font-family", "Arial")
		.attr("font-size", "12px")
		.attr("font-weight", "bold")
		.attr("fill","black");

	nodes.enter().append("text") //create text line 2
		.classed("attribute", true)
		.attr("x",function(d:any): any {
			if(d.type == "person") //therefore name (y axis)
			{
				return 30;
			}
			return 40 + 80 + (80*d.id);
		})
		.attr("y", function(d:any): any {
			if(d.type == "person")
			{
				return 65 + 80 + (80*d.id);
			}
			return 65;
		})
		.text(function(d:any): string {
			if(d.type == "person")
			{
				return d.role;
			}
			return d.price;
		})
		.attr("font-family", "Arial")
		.attr("font-size", "10px")
		.attr("fill","black");

		//create edges (be simple, use lines)
	edgeList = timeStamp.edges;
	let edges = chart.selectAll(".edge")
		.data(edgeList);
	edges.append("g") //subsubdiv of groups
		.each(function(d: Node): any {console.log(d)})
		.classed("edge", true);
	edges.enter().append("line")
		.attr("x1", 90)
		.attr("y1", function(d:any): any {return 55 + 80 + (d.source*80)})
		.attr("x2", function(d:any): any {return 55 + 80 + (d.target*80)})
		.attr("y2", 90)
		.style("stroke", "black")
		.style("stroke-width", function(d:any): any { return d.preference});
});

function mouseClickedEvent(timeStamps: any)
{
	console.log("click");
	stamp++;
	if(stamp == timeStamps.length-1)
	{
		stamp = 0;
	}
	timeStamp = timeStamps[stamp];
	nodeList = timeStamp.nodes;
	edgeList = timeStamp.edges;
	d3.selectAll("text.attribute").transition().text(function(d: any): string {
		if(d.type == "person")
		{
			return d.role;
		}
		return d.price;
	})
	d3.selectAll("line").transition().style("stroke-width", function(d:any): any  { 
		return d.preference})
}

function getChartDimensions(d:any)
{
	let xCount = 1;
	let yCount = 1;
	for(let i = 0; i < d.length; i++) //traverse array of nodes
	{
		let holdNode = d[i]; //hold single node dic
		if(holdNode["price"] == null) //therefore is a person
		{
			yCount++;
		}
		else	//therefore is a product
		{
			xCount++;
		}
	}
	width = xCount * 80 + 40; //# of elements, size of visual + 10, padding 50/50 split
	height = yCount * 80 + 40;
}

/* where code goes to die
let buttons = d3.select("#buttons").append("svg")
	.attr("width", 500)
	.attr("height", 100);
let buttonGroup = buttons.selectAll(".switch");
//buttonGroup.append("g")
//	.classed("button", true)
buttonGroup.append("rect")
		.attr("x", 30)
		.attr("y", 30)
		.attr("width", 50)
		.attr("height", 50)
		.attr("fill", "red");
.append("text")
		.attr("x", 30)
		.attr("y", 50)
		.text("Preference")
		.attr("font-family", "Arial")
		.attr("font-size", "10px")
		.attr("fill","blue")
		.append("text")
		.attr("x", 30)
		.attr("y", 65)
		.text("Consumption")
		.attr("font-family", "Arial")
		.attr("font-size", "9px")
		.attr("fill","red")
		.on("click", function(d, i): any{
			console.log("click")
			if(canSwitch)
			{
				d3.selectAll("line").transition().style("stroke-width", function(d:any): any {return d.consumption/10})
				d3.select("rect").attr("fill", "blue")
				canSwitch=false;
			}
			else
			{
				d3.selectAll("line").transition().style("stroke-width", function(d:any): any  { return d.preference})
				d3.select("rect").attr("fill", "red")
				canSwitch = true;
			}
		});


	////////////////////////////////////THE I GOT HERE TEST\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
	d3.select("body").append("text").attr("x", 25).attr("y", 25 * count++).text("I Got Here");
	//\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\////////////////////////////////////////////
*/

