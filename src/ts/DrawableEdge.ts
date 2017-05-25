
import { Node, Edge } from "./Graph";

export class DrawableEdge extends Edge {
	protected _origSource: Node;
	protected _origTarget: Node;

	get origSource(): Node {
		return this._origSource;
	}

	set origSource(n: Node) {
		this._origSource = n;
	}

	get origTarget(): Node {
		return this._origTarget;
	}

	set origTarget(n: Node) {
		this._origTarget = n;
	}
}