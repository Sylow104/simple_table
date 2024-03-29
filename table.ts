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
	comparator? : ((a : T, b : T) => number);
	styler? : ((a : T, _in : HTMLTableCellElement) => void);
	// add sort function?
	// add filter function?
};

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
	private _data : T;
	private _row : HTMLTableRowElement;
};

export class table<T>
{
	// maybe use div element here instead
	constructor(main : HTMLTableElement, tree_accessor? : ((q : T) => T[]))
	{
		this._main = main;
		this._main.innerHTML = "";
		this._body = document.createElement(`tbody`);
		this._header = document.createElement(`thead`);
		this._main.insertAdjacentElement(`afterbegin`, this._body);
		this._main.insertAdjacentElement(`afterbegin`, this._header);
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
			cell = document.createElement(`th`);
			cell.innerHTML = v.label;
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
		// add section for sortation with header

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

	private _rows : row<T>[];
	private _tree_accessor? : ((ob : T) => any);
	private _main : HTMLTableElement;
	private _header : HTMLTableSectionElement;
	private _body : HTMLTableSectionElement;
	private _cell_style : string;
	private _columns : column<T>[];
	private _max_per_page : number;
};