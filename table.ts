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
	comparator? : ((a : any, b : any) => number);
	// add sort function?
	// add filter function?
};

export class table<T>
{
	// maybe use div element here instead
	constructor(main : HTMLTableElement)
	{
		this._main = main;
		this._main.innerHTML = "";
		this._body = document.createElement(`tbody`);
		this._header = document.createElement(`thead`);
		this._main.insertAdjacentElement(`afterbegin`, this._body);
		this._main.insertAdjacentElement(`afterbegin`, this._header);
		this._columns = [];
	};

	add_column<U>(info : column<T>)
	{
		this._columns.push(info);
	};

	set style(src : CSSStyleDeclaration)
	{
		this._style = src;
	};

	set cell_style(src : CSSStyleDeclaration)
	{
		this._cell_style = src;
	};

	set data(src : T[] | Map<string, T>)
	{
		this._data = src;
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

	private paint_body()
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

				row.insertAdjacentElement(`beforeend`, cell);
			});

			this._body.insertAdjacentElement(`beforeend`, row);
		});
		// add section for pagnation
		// add section for sortation with header
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

	private _for_display : T[] | Map<string, T>;
	private _main : HTMLTableElement;
	private _header : HTMLTableSectionElement;
	private _body : HTMLTableSectionElement;
	private _style : CSSStyleDeclaration;
	private _cell_style : CSSStyleDeclaration;
	private _columns : column<T>[];
	private _data : T[] | Map<string, T>;
	private _max_per_page : number;
};