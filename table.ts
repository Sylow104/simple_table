// considerations
// - accessors to units that need viewing
// - sortation by columns
// - tree mode __ADVANCED__
// - pagnation
// - 

export interface column<T>
{
	label : string;
	accessor : ((obj : T) => any);
	comparator? : ((a : row<T>, b : row<T>) => number);
	styler? : ((a : T, _in : HTMLTableCellElement) => void);
	group_by? : any;
	is_ascending? : boolean;
};

// https://stackoverflow.com/questions/55446744/function-to-group-numbers-of-similar-range-together
// for grouping numbers TODO

// we could not use accessor functions for the data inside
// but to be on the safe side, we will use them
// there might be considerations for speeding things up with
// public _data, instead of accessor to _data
class row<T>
{
	constructor(_a : T, children_accessor? : (a : T) => T[])
	{
		this._data = _a;
		// generate inner html row
		this._row = document.createElement(`tr`);
		
		if (children_accessor) {
			this.build_children(children_accessor);
		};
	};

	set fields(columns : column<T>[])
	{
		this._row.innerHTML = ``;
		let cell : HTMLTableCellElement;
		columns.forEach((v, i, a) => {
			cell = document.createElement(`td`);
			cell.innerHTML = `${v.accessor(this._data)}`;
			if (v.styler) {
				v.styler(this._data, cell);
			};

			this._row.appendChild(cell);
		});
	}

	access(accessor : (a : T) => any) : any
	{
		return accessor(this._data);
	};

	get row() : HTMLTableRowElement
	{
		/*
		let to_ret_children : HTMLTableRowElement[] = [];
		if (this._tree_mode) {
			to_ret_children.push(...this._children.map((v, i, a) => {return v.row}).flat());
		};
		return [this._row, ...to_ret_children];
		*/
		return this._row;
	};

	get id()
	{
		return this._row.id ?? "";
	};

	toggle_visibility()
	{
		;
	};


	private build_children(accessor : (a : T) => T[])
	{
		let entry : row<T>;
		this._children = accessor(this._data).map((v, i, a) =>
		{
			entry = new row<T>(v);
			entry.build_children(accessor);
			return entry;
		});
	};

	private _tree_mode : boolean;
	private _children : row<T>[];
	readonly _data : T;
	private _row : HTMLTableRowElement;
};

export class table<T>
{
	// maybe use div element here instead
	constructor(main : HTMLDivElement, tree_accessor? : ((q : T) => T[]))
	{
		this._main = main;
		this._main.innerHTML = "";

		this._options = document.createElement(`div`);
		this._table = document.createElement(`table`);
		this._body = document.createElement(`tbody`);
		this._header = document.createElement(`thead`);

		this._table.insertAdjacentElement(`beforeend`, this._header);
		this._table.insertAdjacentElement(`beforeend`, this._body);
		this._main.insertAdjacentElement(`afterbegin`, this._options);
		this._main.insertAdjacentElement(`afterbegin`, this._table);
		this._tree_accessor = tree_accessor;
	};

	set columns(info : column<T>[])
	{
		this._columns = [];
		this._columns.push(...info);
	};

	set data(src : T[])
	{
		this._rows = [];
		let new_row : row<T>;
		src.forEach((v, i, a) => {
			new_row = new row<T>(v);
			new_row.fields = this._columns;
			this._rows.push(new_row);
		});
	};

	paint()
	{
		this.paint_header();
		this.paint_body();
	};

	private paint_header()
	{
		// ask if we need to repaint the headers
		let row = this._header.querySelector(`tr`);
		if (!row) {
			row = document.createElement(`tr`);
			this._header.insertAdjacentElement(`afterbegin`, row);
		};

		row.innerHTML = "";
		let cell : HTMLTableCellElement;
		this._columns.forEach((v, i, a) => {
			if (!v.is_ascending) {
				v.is_ascending = false;
			};
			cell = document.createElement(`th`);
			cell.innerHTML = v.label;
			// we may need to add a label to make a drop down menu
			// OR we will have to dynamically make a list of common 
			// prefixes//domain ranges in the summary area
			cell.onclick = () => {
				//alert(`testing sort with field: ${v.label}`);
				if (!v.is_ascending) {
					this._rows.sort(v.comparator);
				} else {
					this._rows.sort(v.comparator).reverse();
				};
				v.is_ascending = !v.is_ascending;
				this.paint_body();
			};
			row.insertAdjacentElement(`beforeend`, cell);
		});
	};

	private paint_body() // flat style
	{
		
		this._body.innerHTML = "";
		this._rows.forEach((v, i, a) => {
			this._body.insertAdjacentElement(`beforeend`, v.row);
		});
		
		// add section for pagnation

	};

	private paint_body_tree() // tree style
	{
		/*
		if (!this._tree_accessor) {
			this.paint_body();
			return;
		}

		this._body.innerHTML = "";
		let row : HTMLTableRowElement;
		let cell : HTMLTableCellElement;
		this._data.forEach((v, i, a) => {
			// ditto for properties as for flat style
			;
		});
		*/
	};

	private build_data()
	{
		// filter data given
		// sort table as needed with given filter
		// pagnate based on given number of entries
		// use this._for_display as array to build off
		// if none of the properties above is active, use the current
		// this._data
		;
	};
	// views per page, which one is active

	// for pagnation, maybe multiple <tbody>'s will work
	// display one, dont display the others
	// on the footer of the table?
	// left ## of ## rows, middle page ## of ##, right: sequence and current position
	private _options : HTMLDivElement;
	private _rows : row<T>[];
	private _tree_accessor? : ((ob : T) => any);
	private _main : HTMLDivElement;
	private _table : HTMLTableElement;
	private _header : HTMLTableSectionElement;
	private _body : HTMLTableSectionElement;
	private _cell_style : string;
	private _columns : column<T>[];
	private _max_per_page : number;
};