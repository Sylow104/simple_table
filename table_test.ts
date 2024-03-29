import {column, table} from './table';

interface b
{
	a : number;
	q : string;
	r : string;
};

let tbl_ele : HTMLTableElement;
let tbl : table<b>;
let to_use : b[] = [
	{a : 2, q : `this`, r : `rat`},
	{a : 151, q : `meow`, r : `joy`},
	{a : -1, q : `lel`, r : `mack`}
];

function init()
{
	tbl_ele = document.createElement(`table`);
	tbl = new table<b>(tbl_ele);

	tbl.add_column({
		label : `hello`,
		accessor : (q) => {
			return `${q.a}`;
		},
		comparator : (a, b) => {
			return 0;
		}
	});

	tbl.add_column({
		label : `world`,
		accessor : (q) => {
			return q.q;
		},
		comparator : (a, b) => {
			return 0;
		}
	});
	tbl.data = to_use;
	document.body.insertAdjacentElement(`afterbegin`, tbl_ele);
};

window.onload = () => {
	init();
	tbl.paint();
};

