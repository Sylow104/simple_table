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
	constructor(_a : T, id_accessor? : (a : T) => string)
	{
		this._data = _a;
		// generate inner html row
		this._row = document.createElement(`tr`);
		if (id_accessor) {
			this._row.id = id_accessor(this._data);
		};
	};

	// add either inline css or class css TODO
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
		return this._row;
	};

	get id()
	{
		return this._row.id ?? "";
	};

	private _data : T;
	private _row : HTMLTableRowElement;
};

// if we convert map to an array, then sorting is easier
class data_store<T>
{
	constructor()
	{
		;
	};

	set data(_in : T[])
	{
		// generates the corresponding rows;
		this._data.push(..._in);
	};

	clear_data()
	{
		this._data = [];
	};

	clear_filter()
	{
		this._data = [];
	};

	set columns(_in : column<T>[])
	{
		//
		return;
	};

	// filter data by given requirements
	// sort data by keys given
	// both functions must return true or throw error otherwise

	// if pred returns true, include
	// else exclude
	filter(predicate : (v : T, i : number, a : T[]) => boolean)
	{
		this._prep = this._prep.filter(predicate);
	};

	// reverse of filter
	unfilter(predicate : (v : T, i : number, a : T[]) => boolean)
	{
		
	};

	set sort(func : ((a : T, b : T) => number))
	{
		this._prep.push(...this._data);
		this._prep.sort(func);
	};

	*rows() : any
	{
		yield 0;
	};

	private a : string;
	private _data : T[] = [];
	private _prep : T[] = [];
	private _columns : column<T>[] = [];
};



export class table<T>
{
	// maybe use div element here instead
	constructor(main : HTMLTableElement, tree_accessor? : ((q : T) => _arr<T>))
	{
		this._main = main;
		this._main.innerHTML = "";
		this._body = document.createElement(`tbody`);
		this._header = document.createElement(`thead`);
		this._main.insertAdjacentElement(`afterbegin`, this._body);
		this._main.insertAdjacentElement(`afterbegin`, this._header);
		this._columns = [];
		this._tree_accessor = tree_accessor;
	};

	add_column(info : column<T>)
	{
		this._columns.push(info);
	};

	set style(src : string)
	{
		this._style = src;
	};

	set cell_style(src : string)
	{
		this._cell_style = src;
	};

	set data(src : _arr<T>)
	{
		this._data = src;
	};

	paint()
	{
		this._main.style.cssText = this._style;
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
		let row : HTMLTableRowElement;
		let cell : HTMLTableCellElement;
		this._data.forEach((v, i, a) => {
			// add row ids corresponding to keys needed
			// filtration based on what's typed in each key
			row = document.createElement(`tr`);
			this._columns.forEach((u, j, b) => {
				cell = document.createElement(`td`);
				let to_input = u.accessor(v);
				cell.innerHTML = `${to_input}`;
				cell.style.cssText = this._cell_style;

				row.insertAdjacentElement(`beforeend`, cell);
			});

			this._body.insertAdjacentElement(`beforeend`, row);
		});
		// add section for pagnation
		// add section for sortation with header
	};

	private paint_body_tree() // tree style
	{
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

	private _tree_accessor : ((ob : T) => _arr<T>);
	private _for_display : _arr<T>;
	private _main : HTMLTableElement;
	private _header : HTMLTableSectionElement;
	private _body : HTMLTableSectionElement;
	private _style : string;
	private _cell_style : string;
	private _columns : column<T>[];
	private _data : _arr<T>;
	private _max_per_page : number;
};