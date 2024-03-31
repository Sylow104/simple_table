import {column, table} from './table';

interface b
{
	a : number;
	q : string;
	r : string;
	children : b[];
};

let tbl_ele : HTMLDivElement;
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
	{a : 1666, q : `this`, r : `rat`, children : []},
	{a : 2049, q : `crack`, r : `sad`, children : []},
	{a : 901, q : `wide`, r : `usher`, children : []},
	{a : 578, q : `interest`, r : `pen`, children : []},
	{a : 45, q : `rest`, r : `long`, children : []},
	{a : -1, q : `blood`, r : `coffee`, children : []},
	{a : 10.49, q : `clang`, r : `gear`, children : []},
	{a : 151, q : `snake`, r : `trap`, children : []},
	{a : 3, q : `early`, r : `night`, children : []},
	{a : 64, q : `understand`, r : `tropical`, children : []},
	{a : 731.09, q : `jingle`, r : `gong`, children : []},
	{a : 151, q : `young`, r : `warp`, children : []},

	{a : 46, q : `rest`, r : `long`, children : []},
	{a : -14, q : `blood`, r : `coffee`, children : []},
	{a : 12.49, q : `clang`, r : `gear`, children : []},
	{a : 159, q : `snake`, r : `trap`, children : []},
	{a : 8, q : `early`, r : `night`, children : []},
	{a : 65, q : `understand`, r : `tropical`, children : []},
	{a : 22.4, q : `jingle`, r : `gong`, children : []},
	{a : 0.442, q : `young`, r : `warp`, children : []},
];

function init()
{
	tbl_ele = document.createElement(`div`);
	tbl = new table<b>(tbl_ele);

	tbl.columns = [{
		label : `hello`,
		accessor : (q) => {
			return `${q.a}`;
		},
		comparator : (a, b) => {
			return a._data.a - b._data.a;
		}
	}, {
		label : `world`,
		accessor : (q) => {
			return q.q;
		},
		comparator : (a, b) => {
			return a._data.q.localeCompare(b._data.q);
		}
	}];
	tbl.data = to_use;
	document.body.insertAdjacentElement(`afterbegin`, tbl_ele);
};

window.onload = () => {
	init();
	tbl.paint();
};

