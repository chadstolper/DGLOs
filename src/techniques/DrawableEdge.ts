
import { Node, Edge } from "./Graph";

export class DrawableNode extends Node {
	protected _origID: string | number;
	protected _timestamp: number;

	get origID(): string | number {
		return this._origID;
	}

	set origID(id: string | number) {
		this._origID = id;
	}

	set timestamp(timestamp: number) {
		this._timestamp = timestamp;
	}

	get timestamp(): number {
		return this._timestamp;
	}
}

export class DrawableEdge extends Edge {
	protected _origSource: DrawableNode;
	protected _origTarget: DrawableNode;

	get origSource(): DrawableNode {
		return this._origSource;
	}

	set origSource(n: DrawableNode) {
		this._origSource = n;
	}

	get origTarget(): DrawableNode {
		return this._origTarget;
	}

	set origTarget(n: DrawableNode) {
		this._origTarget = n;
	}

	get source(): DrawableNode {
		return super.source as DrawableNode;
	}

	set source(s: DrawableNode) {
		super.source = s;
	}

	get target(): DrawableNode {
		return super.target as DrawableNode;
	}
	set target(t: DrawableNode) {
		super.target = t;
	}


}