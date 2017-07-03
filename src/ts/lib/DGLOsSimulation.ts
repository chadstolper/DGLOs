
/**
 * Attribute object used for passing collection of options pertaining to simulation mechanics.
 */
export class SimulationAttrOpts {
	private _simulationCollision: boolean = false;
	private _simulationWeight: boolean = false;
	private _divisorPT: number = 2.75;
	private _divisorPX: number = 3.25;
	private _simulationAlpha: number = 0.3;
	private _simulationCharge: number = -100;
	private _simulationLinkStrength: number = .05;

	/**
	 * Object holding simulation related information. Changing attributes will change the simulation characteristics as specified.
	 * Leaving the contsructor empty will return default values for all attributes.
	 * 
	 * Defaults as follows:
	 * - Collision: false. Nodes do not collide and can overlap
	 * - Weight: false. Edge pull uniform.
	 * - DivisorPT: 2.75
	 * - DivisorPX: 3.25
	 * - Alpha: 0.3
	 * - Charge: -100
	 * - LinkStrength: .05
	 */
	constructor() { }

	/**
	 * Enable or disable node collision mechanics. When enabled, nodes will no overlap. If the current NodeGlyphShape is a label, collision based on text width. Default false.
	 */
	set simulationCollisionEnabled(boo: boolean) {
		this._simulationCollision = boo;
	}
	get simulationCollisionEnabled(): boolean {
		return this._simulationCollision;
	}
	/**
	 * Enable or disable edge pull between nodes based on edge data weight * LinkStrength. Default false.
	 */
	set simulationWeightEnabled(boo: boolean) {
		this._simulationWeight = boo;
	}
	get simulationWeightEnabled(): boolean {
		return this._simulationWeight;
	}
	/**
	 * Define text collision tightness for font-size "##pt". Used when collision = true. Default  2.75.
	 */
	set divisorPT(num: number) {
		this._divisorPT = num;
	}
	get divisorPT(): number {
		return this._divisorPT;
	}
	/**
	 * Define text collision tightness for font-size "##px". Used when collision = true. Default 3.25.
	 */
	set divisorPX(num: number) {
		this._divisorPX = num;
	}
	get divisorPX(): number {
		return this._divisorPX;
	}
	/**
	 * Initial simulation energy. Higher value means more energetic start and vice versa. Default 0.3.
	 */
	set alpha(num: number) {
		this._simulationAlpha = num;
	}
	get alpha(): number {
		return this._simulationAlpha;
	}
	/**
	 * Constant simulation center push on all nodes and edges. Lower values means further push. Default -100.
	 */
	set charge(num: number) {
		this._simulationCharge = num;
	}
	get charge(): number {
		return this._simulationCharge;
	}
	/**
	 * Data.weight divisor. Used when weight = true. Defines strength between two Nodes along Edge. Default 0.05.
	 */
	set linkStrength(num: number) {
		this._simulationLinkStrength = num;
	}
	get linkStrength(): number {
		return this._simulationLinkStrength;
	}
}