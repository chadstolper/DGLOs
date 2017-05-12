var width;
var height;
var timeStamp1;
var nodeList;
var edgeList;
var canSwitch = true;

d3.json("./dummy.json", function(timeStamps){
	timeStamp1 = timeStamps[0]; //load in first timestep
	nodeList = timeStamp1.nodes; //load in nodes of first timestep

	getChartDimensions(nodeList); // needed?
	console.log(width)
	console.log(height)

	var chart = d3.select("#chart").append("svg") //select chart div
		.attr("width", width)
		.attr("height", height);
	var nodes = chart.selectAll(".node") //create subdiv with data of node list
		.data(nodeList);
	nodes.append("g") //subsubdiv of groups
		.each(function(d){console.log(d)})
		.classed("node", true);

	nodes.enter().append("circle") //create circles
		.attr("cx", function(d) {
			if(d.type == "person") //therefore y axis
			{
				return 55;
			}//therefore x axis
			return 55 + 80 + (80*d.id);
		})
		.attr("cy", function(d) {
			if(d.type == "person")
			{
				return 55 + 80 + (80*d.id);
			}
			return 55;
		})
		.attr("r", 35)
		.attr("fill", "blue");

	nodes.enter().append("text") //create text line 1
		.attr("x",function(d) {
			if(d.type == "person") //therefore name (y axis)
			{
				return 30;
			}
			return 40 + 80 + (80*d.id);
		})
		.attr("y", function(d) {
			if(d.type == "person")
			{
				return 50 + 80 + (80*d.id);
			}
			return 50;
		})
		.text(function(d) { return d.name})
		.attr("font-family", "Arial")
		.attr("font-size", "12px")
		.attr("font-weight", "bold")
		.attr("fill","black");

	nodes.enter().append("text") //create text line 2
		.attr("x",function(d) {
			if(d.type == "person") //therefore name (y axis)
			{
				return 30;
			}
			return 40 + 80 + (80*d.id);
		})
		.attr("y", function(d) {
			if(d.type == "person")
			{
				return 65 + 80 + (80*d.id);
			}
			return 65;
		})
		.text(function(d) {
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
	edgeList = timeStamp1.edges;
	var edges = chart.selectAll(".edge")
		.data(edgeList);
	edges.append("g") //subsubdiv of groups
		.each(function(d){console.log(d)})
		.classed("edge", true);
	edges.enter().append("line")
		.attr("x1", 90)
		.attr("y1", function(d){return 55 + 80 + (d.source*80)})
		.attr("x2", function(d){return 55 + 80 + (d.target*80)})
		.attr("y2", 90)
		.style("stroke", "black")
		.style("stroke-width", function(d) { return d.preference});

		//mouselistener for clicking to switch data views
	d3.select("svg").append("rect")
		.attr("x", 30)
		.attr("y", 30)
		.attr("width", 50)
		.attr("height", 50)
		.attr("fill", "red")
		.on("click", function(d, i){
			console.log("click")
			if(canSwitch)
			{
				d3.selectAll("line").style("stroke-width", function(d) {return d.consumption/10})
				d3.select("rect").attr("fill", "blue")
				canSwitch=false;
			}
			else
			{
				d3.selectAll("line").style("stroke-width", function(d) { return d.preference})
				d3.select("rect").attr("fill", "red")
				canSwitch = true;
			}
		});
	d3.select("svg").append("text")
		.attr("x", 30)
		.attr("y", 50)
		.text("Preference")
		.attr("font-family", "Arial")
		.attr("font-size", "10px")
		.attr("fill","blue");
	d3.select("svg").append("text")
		.attr("x", 30)
		.attr("y", 65)
		.text("Consumption")
		.attr("font-family", "Arial")
		.attr("font-size", "9px")
		.attr("fill","red");
});

function getChartDimensions(d)
{
	var xCount = 1;
	var yCount = 1;
	for(var i = 0; i < d.length; i++) //traverse array of nodes
	{
		var holdNode = d[i]; //hold single node dic
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

	////////////////////////////////////THE I GOT HERE TEST\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
	d3.select("body").append("text").attr("x", 25).attr("y", 25 * count++).text("I Got Here");
	//\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\////////////////////////////////////////////
*/

