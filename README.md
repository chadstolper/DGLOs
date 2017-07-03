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
- Positioning (Visual Drawing Handling)
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
	- [enableEnterExitColoring()](#enableEEC)
	- [disableEnterExitColoring()](#disableEEC)
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

### <a name="positionEdgeM"></a>posistionEdgesMatrix():

### <a name="positionNodesG"></a>positionNodesGestalt():

### <a name="positionEdgesG"></a>positionEdgesGestalt():

### <a name="fixCentralNodePositions"></a>fixCentralNodePositions():

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

### <a name="setCenterNode"></a>setCenterNode():

### <a name="enableEEC"></a>enableEnterExitColoring():
When displaying data, the data will be colored based on the direction of the data. The color of the Node and Edge will change depending on if the data is present in the previous or next timestep. There are 4 states the data can be.
- Green: Data is entering and is present in the next timestep.
- Red: Data was in the previous timestep and is exiting.
- Yellow: Data is entering but is also not present in the next timestep and exiting.
- Blue: Data was in the previous timestep and is in the next timestep; Staying.

The first timestep all data is considered entering data. The last timestep all data is considered exiting.

### <a name="disableEEC"></a>disableEnterExitColoring():
Disables shading based on data direction. Coloring returns to attributes defined in `SVGAttrOpts`.

## DGLOs Attribute Objects
### <a name="SVGAttrOpts"></a>SVGAttrOpts():

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