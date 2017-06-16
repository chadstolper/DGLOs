
export class Coordinate {
	private _X: number;
	private _Y: number;

	constructor(x: number, y: number) {
		this._X = x;
		this._Y = y;
	}

	get x(): number {
		return this._X;
	}

	get y(): number {
		return this._Y;
	}
}

export class CoordinateGroup {
	private _group: Array<Coordinate>

	constructor(group: Array<Coordinate>) {
		this._group = group;
	}

	get group(): Array<Coordinate> {
		return this._group;
	}
}