// function graphUpdate(graph: StaticDrinkGraph, _width: number, _height: number) {

// 	let arraySize = graph.nodes.length;
// 	var svg = d3.selectAll("body").append("svg")
// 		.attr("width", _width)
// 		.attr("height", _height)

// 	/* this color scale determines the coloring of the matrix heatmap.
// 	The domain is from the lightest edge in the set of edges to the
// 	heaviest edge in the set of edges. The range is defaultColorDomain,
// 	which can be changed */
// 	let colorMap = d3Scale.scaleLinear<string>()
// 		.domain(getColorDomain(graph.edges))
// 		.range(defaultColorDomain);

// 	let slots = svg.selectAll("g")
// 		.data(graph.edges).enter()
// 		.append("rect")
// 		.attr("x", function (d) {
// 			return (+d.source.id / graph.nodes.length) * 100 + "%";
// 		})
// 		.attr("y", function (d) {
// 			return (+d.target.id / graph.nodes.length) * 100 + "%";
// 		})
// 		.attr("width", _width / arraySize)
// 		.attr("height", _height / arraySize)
// 		.attr("fill", function (d) {
// 			return colorMap(d.weight);
// 		})
// 		.attr("stroke", "black")
// 		.attr("id", function (d) {
// 			return d.id;
// 		})

// }

// function matrixHeatMapTimeLine() {
// 	for (var i = 0; i < numTimeSteps; i++) {
// 		graphUpdate(curGraph, width, height);
// 		timeStepForward();
// 	}
// }
