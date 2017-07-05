import { Selection } from "d3-selection";
import { Node, Edge, DynamicGraph, MetaNode, MetaEdge } from "../model/dynamicgraph";
import * as d3force from "d3-force";
import { Simulation } from "d3-force";
import { NodeGlyphShape } from "./NodeGlyphInterface";
import { EdgeGlyphShape } from "./EdgeGlyphInterface";
import { GroupGlyph } from "./GroupGlyphInterface";
import { DGLOsSVGCombined } from "./DGLOsSVGCombined";
import { SVGAttrOpts } from "./DGLOsSVG";
import { SimulationAttrOpts } from "./DGLOsSimulation";

export class DGLOsMatt extends DGLOsSVGCombined {

}