import * as d3 from "d3-selection";
import * as d3Scale from "d3-scale";
import * as d3Array from "d3-array";


export class Dummy {
	private _weight: number;

	constructor(weight: number){
		this._weight = weight;
	}

	get weight(): number {
		return this._weight;
	}
}

export class DummyList {
	private _list: Array<Dummy>;
	
	constructor(list: Array<any>){
		this._list = new Array<Dummy>();
		for(let val of list){
			this._list.push(new Dummy(val.weight));
		}
	}

	get list(): Array<Dummy> {
		return this._list;
	}
}


let arr = [{ weight: 20 }, { weight: 10 }, { weight: 0 }];
let dummy_arr = new DummyList(arr);

var svg = d3.selectAll("body").append("svg")

function getColorDomain(local_arr: Array<Dummy>) {
	return d3Array.extent(local_arr, function (d: Dummy): number {
		return d.weight;
	});
}

function update(local_list: DummyList)/*:return type*/ {
	let defaultColorRange = ["white", "gold"];
	let arraySize = local_list.list.length;
	let colorDomain = getColorDomain(local_list.list);

	let colorMap = d3Scale.scaleLinear<string>()
		.domain(colorDomain)
		.range(defaultColorRange);
}
