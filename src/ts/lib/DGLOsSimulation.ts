
/**
 * Attribute object used for passing collection of options pertaining to simulation mechanics.
 */
export class SimulationAttrOpts {
	private _simulationCollision: boolean;
	private _simulationWeight: boolean;
	private _divisorPT: number;
	private _divisorPX: number;
	private _simulationAlpha: number;
	private _simulationCharge: number;
	private _simulationLinkStrength: number;

	/**
	 * Object holding simulation related information. Changing attributes will change the simulation characteristics as specified.
	 * Leaving the contsructor empty will return default values for all attributes.
	 * @param simulationCollision Default = false; NodeGlyphShapes can clip/overlap.
	 * @param simulationWeight Default = false; Links will default to D3 link.strength values. Links will not pull based on Edge data.
	 * @param divisorPT Default = 2.75; Relative collision radius resizing value for LabelGlyphs with text sized by pt. Higher values = closer collision radius.
	 * @param divisorPX Default = 3.25; Relative collision radius resizing value for LabelGlyphs with text sized by px. Higher values = closer collision radius.
	 * @param alpha Default = 0.3; Starting "energy" for simulation elements.
	 * @param charge Default = -100; Push applied to simulation elements from the center.
	 * @param linkStrength Default = 0.05; strength of Edge pulling between 2 Nodes in the simualtion.
	 */
	constructor(simulationCollision: boolean = false, simulationWeight: boolean = false, divisorPT: number = 2.75, divisorPX: number = 3.25, alpha: number = .3, charge: number = -100, linkStrength: number = .05) {
		this._simulationCollision = simulationCollision;
		this._simulationWeight = simulationWeight;
		this._divisorPT = divisorPT;
		this._divisorPX = divisorPX;
		this._simulationAlpha = alpha;
		this._simulationCharge = charge;
		this._simulationLinkStrength = linkStrength;
	}

	set simulationCollisionEnabled(boo: boolean) {
		this._simulationCollision = boo;
	}
	get simulationCollisionEnabled(): boolean {
		return this._simulationCollision;
	}
	set simulationWeightEnabled(boo: boolean) {
		this._simulationWeight = boo;
	}
	get simulationWeightEnabled(): boolean {
		return this._simulationWeight;
	}
	set divisorPT(num: number) {
		this._divisorPT = num;
	}
	get divisorPT(): number {
		return this._divisorPT;
	}
	set divisorPX(num: number) {
		this._divisorPX = num;
	}
	get divisorPX(): number {
		return this._divisorPX;
	}
	set alpha(num: number) {
		this._simulationAlpha = num;
	}
	get alpha(): number {
		return this._simulationAlpha;
	}
	set charge(num: number) {
		this._simulationCharge = num;
	}
	get charge(): number {
		return this._simulationCharge;
	}
	set linkStrength(num: number) {
		this._simulationLinkStrength = num;
	}
	get linkStrength(): number {
		return this._simulationLinkStrength;
	}
}