# DGLOs: A Dynamic Graph Visualization Library

## To set up workspace:
- install [yarn](https://yarnpkg.com) (if haven't already)
- open terminal
- `cd` to root directory of the repo
- `yarn install` to install dependencies
- Copy the gruntfile-pushed.js to a new file called gruntfile.js
- Put your main typescript (.ts) file in `src/ts/main`
- Set the mainfile variable in your gruntfile.js to the the filename without the .ts extension
- If you are using Visual Studio Code: cmd/ctrl-shift-b to start the webserver and autobuilder and open index.html

## Examples
- Specifying techniques using dGLOs examples be found in `src/ts/specs` directory.
- Examples of running these specifications can be found in the `src/ts/main` directory.


## While developing:
- `yarn add _____` to install dependencies
- `yarn add _____ -dev` to install developer tools
- `grunt gen_docs` to re-generate documentation

# API Reference
- Drawing (Creating Element Selections)
	- [drawNodeGlyphs()](#drawNodes)
	- [drawEdgeGlyphs()](#drawEdges)
	- [drawRegions()](#drawRegions)
	- [drawTimesteps()](#drawTimesteps)
	- [removeNodes()](#removeNodes)
	- [removeEdges()](#removeEdges)
	- [removeRegions()](#removeRegions)
	- [removeTimesteps()](#removeTimesteps)
- Positioning (Visualization Handling)
	- [positionNodesAndEdgesForceDirected()](#positionFD)
	- [positionNodesMatrix()](#positionNodesM)
	- [positionEdgesMatrix()](#positionEdgesM)
	- [positionNodesGestalt()](#positionNodesG)
	- [positionEdgesGestalt()](#positionEdgesG)
	- [fixCentralNodePositions()](#fixCentralNodePositions)
- Tranformation and Data Traversal
	- [transformNodeGlyphsTo](#transformNodes)
	- [transformEdgeGlyphsTo](#transformEdges)
	- [transformGroupGlyphsTo](#transformGroups)
	- [enableStepping](#enableStepping)
	- [disableStepping](#disableStepping)
- Attributes and Visualization Setting
	- [setAttributes()](#setAttrOpts)
	- [setRegionAttrs()](#setRAttrOpts)
	- [setSimulationAttrs()](#setSimAttrOpts)
	- [setCenterNode()](#setCenterNode)
- DGLO Attribute Objects
	- [SVGAttrOpts](#SVGAttrOpts)
	- [SimulationAttrOpts](#SimAttrOpts)


## Drawing:
### <a name="drawNodes"></a>drawNodeGlyphs():
Creates a parent `<g>` tag in the SVG holding all NodeGlyphShape types. Those types are then given each an individual `<g>` tag for their shape. A `Selection` of the shape element's location are stored in the `NodeGlyphMap<svgPosition: number, Map<NodeGlyphShape, Selection<any, {}, any, {}>>` map where `svgPosition` is the current SVG being drawn in (see drawTimesteps()), `NodeGlyphShape` is the shape needing to be drawn which returns the corresponding `Selection`.

The `<SVG>` has an instance of each NodeGlyphShape with `attr("display", "none")` applied.

Does not handle the visual drawing, see [positionNodesAndEdgesForceDirected()](#positionFD), position<[Nodes](#positionNodesM), [Edges](#positionEdgesM)>Matrix(), or position<[Nodes](#positionNodesG), [Edges](#positionEdgesG)>Gestalt().

### <a name="drawEdges"></a>drawEdgeGlyphs():
Creates a parent `<g>` tag in the SVG holding all EdgeGlyphShape types. Those types are then given each an individual `<g>` tag for their shape. A `Selection` of the shape element's location are stored in the `EdgeGlyphMap<svgPosition: number, Map<EdgeGlyphShape, Selection<any, {}, any, {}>>` map where `svgPosition` is the current SVG being drawn in (see drawTimesteps()), `EdgeGlyphShape` is the shape needing to be drawn which returns the corresponding `Selection`.

The `<SVG>` has an instance of each EdgeGlyphShape with `attr("display", "none")` applied.

Does not handle the visual drawing, see [positionNodesAndEdgesForceDirected()](#positionFD), position<[Nodes](#positionNodesM), [Edges](#positionEdgesM)>Matrix(), or position<[Nodes](#positionNodesG), [Edges](#positionEdgesG)>Gestalt().

### <a name="drawRegions"></a>drawRegions():
Creates a parent `<g>` tag in the SVG holding all GroupGlyph types. Those types are then given each an individual `<g>` tag for their shape. A `Selection` of the shape element's location are stored in the `GroupGlyphMap<svgPosition: number, Map<GroupGlyph, Selection<any, {}, any, {}>>` map where `svgPosition` is the current SVG being drawn in (see drawTimesteps()), `GroupGlyph` is the shape needing to be drawn which returns the corresponding `Selection`.

The `<SVG>` has an instance of each GroupGlyph with `attr("display", "none")` applied.

Does not handle the visual drawing, see [positionNodesAndEdgesForceDirected()](#positionFD), position<[Nodes](#positionNodesM), [Edges](#positionEdgesM)>Matrix(), or position<[Nodes](#positionNodesG), [Edges](#positionEdgesG)>Gestalt().

### <a name="drawTimesteps"></a>drawTimesteps():
Creates multiple new `<SVG>` tags at the draw location per timestep in the data. Each of the new SVG's are classed `"SVG_n"` where `n` is the timestep index + 1. Each of the SVGs are given parent and child `<g>` tags for Node, Edge, and (if enabled) Group shapes.

All element `<g>` are added to their Maps at that `svgPosition` index.

### <a name="removeNodes"></a>removeNodeGlyphs():
Removes all child `<g>` tags of the NodeGlyphShapes at all timesteps. The `<NodeG>` parent tag is left under the `<SVG>`.

### <a name="removeEdges"></a>removeEdgeGlyphs():
Removes all child `<g>` tags of the EdgeGlyphShapes at all timesteps. The `<EdgeG>` parent tag is left under the `<SVG>`.

### <a name="removeRegions"></a>removeRegions():
Removes all child `<g>` tags of the GroupGlyphs at all timesteps. The `<GroupG>` parent tag is left under the `<SVG>`.

### <a name="removeTimesteps"></a>removeTimesteps(delay: number):
Transition removes all SVGs not at the first timestep in the data. The `delay: number` parameter refers to the transition duration and staggering of SVG transitions and removal in miliseconds. `delay` defaults to 

`removeTimesteps(delay: number = 0): void { }`

## Positioning (and Visually Drawing Elements):
### <a name="positionFD"></a>positionNodesAndEdgesForceDirected(setRunning: boolean):
Starts a force-directed simulation for positioning Nodes and Edges. The simulation runs based on a compilation of all data at all timesteps, and then assigns the Nodes and Edges their positioning based on the simulation and relative to other Node data which might not be present in the same timestep. The simulation calls a recurring internal `Tick()`.

`setRunning = true` initializes simulation. If the simulation already exists assigns data for the simulation using all data Nodes and Edges, and restarts simulation with alpha.

`setRunning = false` stops the simulation internal tick. Returns the simulation at that point.

The internal `Tick()` handles the visual drawing of the Nodes and Edges at the current timestep or (if enabled) across multiple SVG elements.

### <a name="positionNodesM"></a>positionNodesMatrix():
Positions all Nodes according to the matrix visualization. Nodes are set to labels, duplicated, and places along the top and left side of the grid. The size of the grid and label positioning is handled internally and dynamically scaled to the SVG dimensions.

### <a name="positionEdgeM"></a>posistionEdgesMatrix():
Positions all Edges according the the matrix visualization. Edges are set to rectangle shapes and placed inside a grid representing a connection between two Nodes. Grid is dynamically sized based on SVG dimemnsions.

### <a name="positionNodesG"></a>positionNodesGestalt():

### <a name="positionEdgesG"></a>positionEdgesGestalt():

### <a name="fixCentralNodePositions"></a>fixCentralNodePositions():
Assigns the central Nodes a fixed position

## Transformation and Data Traversal:
### <a name="transformNodes"></a>transformNodeGlyphTo(NodeGlyphShape):

### <a name="transformEdges"></a>transformEdgeGlyphTo(EdgeGlyphShape):

### <a name="transformGroups"></a>transformGroupGlyphTo(GroupGlyph):

### <a name="enableStepping"></a>enableStepping():

### <a name="disableStepping"></a>disableStepping():

## Attributes and Visualization Settings:
### <a name="setAttrOpts"></a>setAttributes(SVGAttrOpts):
Sets different data visualization attributes such as color, width, height, opacity, font, etc. This method is entirely optional. An internal default of `SVGAttrOpts` is stored within the library, this methods manipulates that.

See [SVGAttrOpts()](#attrOpts).

### <a name="setRAttrOpts"></a>setRegionGlyphAttrs(SVGAttrOpts):
`setRegionGlyphAttrs()` is similar to `setAttributes()` only it is specific to GMap visualization. Certain attributes are set to match with the GMap visualization.

### <a name="setSimAttrOpts"></a>setSimulationAttrs(SimulationAttrOpts):
Sets different simulation calculation attributes for different effects and data visualization. This method is entirely optional. An internal default of `SimulationAttrOpts` is already stored within the library for the simulation, this method manipulates that. 

See [SimulationAttrOpts()](#SimAttrOpts).

### <a name="setCenterNode"></a>setCenterNode(string):
Takes a string of a Node ID to act as the initial centerNode in EgoGraph Visualization. This value is partially arbitrary as it only refers to the first center data selection. This method also handles calculations for finding neighboring Nodes and Edges.

### <a name="enableEEC"></a>enableEnterExitColoring():
### positionNodesMatrix():
positionNodesMatrix create two sets of the current node shape and positions them along the x and y axes.

### posistionEdgesMatrix():
positionEdgesMatrix preforms the calculations necessary to position edges in a matrix fashion.

### positionNodesGestalt():
THIS NEEDS TO BE REMOVED

### positionEdgesGestalt():
postionEdgesGestalt preforms the calculations necessary to create a Gestalt Glyph Graph.

### fixCentralNodePositions(fixed: boolean):
`fixCentralNodePositions` takes a boolean to decide whether or not to enable central nodes. 
`fixed = true` will enable center nodes. This allows the user to create an Egograph.
`fixed = false` will disable central nodes. This is the default state of central nodes, and you will likely
be in this state for most of your time with this library.

## Attributes and Visualization Settings:
### setAttributes(SVGAttrOpts):
Sets different data visualization attributes such as color, width, height, opacity, font, etc. This method is entirely optional. An internal default of `SVGAttrOpts` is stored within the library, this methods manipulates that.

See SVGAttrOpts().

### setRegionGlyphAttrs(SVGAttrOpts):
`setRegionGlyphAttrs()` is similar to `setAttributes()` only it is specific to GMap visualization. Certain attributes are set to match with the GMap visualization.

### setSimulationAttrs(SimulationAttrOpts):
Sets different simulation calculation attributes for different effects and data visualization. This method is entirely optional. An internal default of `SimulationAttrOpts` is already stored within the library for the simulation, this method manipulates that. 

See SimulationAttrOpts().

### SVGAttrOpts():

### SimulationAttrOpts():
An object holding various force-directed simulation calculation related information. Constructing a `new SimulationAttrOpts()` with no parameters defaults all values.

`SimulationAttrOpts(collision: boolean, weight: boolean, PTdivisor: number, PXdivisor: number, alpha: number, charge: number, linkStrength: number)`
- `collision`: Enables or disables Node collision based on radius. Collision radius dependant on either circleGlyphShape radius or LabelGlyphShape text width. Default = `false`.
- `weight`: Enables or disables Edge pull based on `function(d: Edge): number { return d.weight * linkStrength; }`. Only useful if you know the data has different edge weights between Nodes. Default = `false`;
- pt
- px
- `alpha`: Initial energy of simulation. Higher value means rapid expansion, lower value means stagnated expansion. Default = 0.3.
- `charge`: General pushing force of the simulation on Nodes. Default = -100.
- `linkStrength`: Multiplier used when `weight = true` to calculated the pull between two Nodes where and Edge exisits. Default = 0.05

### setCenterNode():

## DGLOs Attribute Objects
### <a name="SVGAttrOpts"></a>SVGAttrOpts():
An object holding various Node, Edge, and (if enabled) region visualization attribute options. Constructing a new `SVGAttrOpts()` creates an object with default values for basic visuals. A default instance is already stored in the library.

Attribute Options:
- `attrOpts.fill` : Fill color for Nodes as a string. Default color is #FFFFFF. Unique options:
	- `"id"` : The fill color is based on the Node's id value.
	- `"label"` : The fill color is based on the Node's label content if any.
	- `"type"` : The fill color is based on the Node's type, group or other data value.
	- `"enterExit"` : The fill color is based on the the direction of the data in relation to different timesteps. Nodes and Edges are colored based on their data entering and exiting. All Nodes and Edges considered entering in first timestep. All Nodes and Edges considered exiting in the last timestep.
		- Green: Data entering and present in the next timestep.
		- Red: Data present in the previous timestep and exiting.
		- Yellow: Data entering and exiting in the same timestep.
		- Blue: Data present in the current, previous, and next timestep.
- `attrOpts.stroke` : Color for Node borders as a string. Default is #000000.
- `attrOpts.stroke_edge` : Color for Edges as a string. Either acting as a fill or stroke depending on the visualization. Default is #000000.
- `attrOpts.stroke_width` : Node border width/thickness as a number. Default is 2.
- `attrOpts.stroke_width_edge` :  Edge border width/thickness as a number. Default is 1. Unique options:
	- `"weight"` : The edge thickness is based on the Edge's weight data. Usefull if the weights are known to be different. See [SimulationAttrOpts.weight](#SimAttrOpts).
- `attrOpts.radius` : Node radius as a number. Default is 10.
- `attrOpts.width` : Either Node or Edge width as a number. Usually used to pass SVG width for visualization calculations.
- `attrOpts.height` : Either Node or Edge height as a number. Usually used to pass SVG height for visualization calculations.
- `attrOpts.opacity` : Opacity as a number where `0 < x < 100`. Default is 100.
- `attrOpts.font` : Font of used for any text display. Default is "sans serif".
- `attrOpts.font_size` : Size of font in either px or pt. Default is "12px".

### <a name="SimAttrOpts"></a>SimulationAttrOpts():
An object holding various force-directed simulation calculation related information. Constructing a `new SimulationAttrOpts()` with no parameters defaults all values.

`SimulationAttrOpts(collision: boolean, weight: boolean, PTdivisor: number, PXdivisor: number, alpha: number, charge: number, linkStrength: number)`
- `collision`: Enables or disables Node collision based on radius. Collision radius dependant on either circleGlyphShape radius or LabelGlyphShape text width. Default = `false`.
- `weight`: Enables or disables Edge pull based on `function(d: Edge): number { return d.weight * linkStrength; }`. Only useful if you know the data has different edge weights between Nodes. Default = `false`;
- pt
- px
- `alpha`: Initial energy of simulation. Higher value means rapid expansion, lower value means stagnated expansion. Default = 0.3.
- `charge`: General pushing force of the simulation on Nodes. Default = -100.
- `linkStrength`: Multiplier used when `weight = true` to calculated the pull between two Nodes where and Edge exisits. Default = 0.05

## Transformation and Data Traversal:
### transformNodeGlyphTo(NodeGlyphShape):

### transformEdgeGlyphTo(EdgeGlyphShape):

`transformEdgeGlyphTo` takes an `EdgeGlyphShape` object. We have built three `EdgeGlyphShape` classes that come with the library:
- `SourceTargetLineGlyphShape`
- `GestaltGlyphShape`
- `RectGlyphShape`

`transformEdgeGlyphTo` does just that; It transforms the all of the edges on the screen into the type of edge passed to the function.

_This area is a work in progress. We are using the flubber library to create smooth trnasitions between the shapes. It has been 
implemented in some but not all of the shapes. Expect updates to come!_

### transformGroupGlyphTo(GroupGlyph):

### enableStepping():

`enableStepping` allows the user to traverse through timesteps by appending forward and backward buttons to the page. When clicked,
these buttons will cause the page to display the next (or previous) graph in the dynamic graph timeline.

### disableStepping():
`disableStepping` removes the foward and backward buttons added to the page by `enableStepping`. `disableStepping` does nothing
if those buttons are not on the page.

## DGLOs Shape Classes
DGLOs has five shape classes. Each are used to display data in different ways.
### Node Shapes:
All nodes implement the NodeGlyphInterface. Thus, they require:
- init()
- initDraw()
- updateDraw()
- transformTo()
- draw()
#### CircleGlyphShape:
The `circleGlyphShape` class preforms all of the logic required to display nodes as circles. They are SVG paths so that they are
compatible with the flubber library.  
#### LabelGlyphShape
The `labelGlyphShape` class preforms all of the logic required to display nodes as SVG text elements. The text displayed is the `label` property
of the node. 
### Edge Shapes:
All edges implement the EdgeGlyphInterface. Thus, they require:
- init()
- initDraw()
- updateDraw()
- transformTo()
- draw()
#### RectGlyphShape
We have used the `rectGlyphShape` in order to create matrices. Much of `rectGlyphShape` logic makes the assumption that they will be used in conjunction
with the function `positionEdgesMatrix`.
#### GestaltGlyphShape

#### SourceTargetLineGlyphShape
`soruceTargetLineGlyphShape` handles all of the logic required to display edges as STLines.

//so attropts, simattropts, all the shapes, etc.
