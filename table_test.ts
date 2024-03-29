import {column, table} from './table';

interface b
{
	a : number;
	q : string;
	r : string;
	children : b[];
};

let tbl_ele : HTMLTableElement;
let tbl : table<b>;
let to_use : b[] = [
	{a : 2, q : `this`, r : `rat`, children : []},
	{a : 151, q : `meow`, r : `joy`, children : []},
	{a : -1, q : `lel`, r : `mack`, children : [
		{a : 3, q : `sol`, r : `mappa`, children : []},
		{a : 4, q : `lun`, r : `sync`, children : [
			{a : 89, q : `mild`, r : `thirst`, children : []},
		]},
		
	]},
];

function init()
{
	tbl_ele = document.createElement(`table`);
	tbl = new table<b>(tbl_ele);

	tbl.columns = [{
		label : `hello`,
		accessor : (q) => {
			return `${q.a}`;
		},
		comparator : (a, b) => {
			return b._data.a - a._data.a;
		}
	}, {
		label : `world`,
		accessor : (q) => {
			return q.q;
		},
		comparator : (a, b) => {
			return 0;
		}
	}];
	tbl.data = to_use;
	document.body.insertAdjacentElement(`afterbegin`, tbl_ele);
};

window.onload = () => {
	init();
	tbl.paint();
};

