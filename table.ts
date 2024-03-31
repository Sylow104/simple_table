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
		return this._row;
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

class filter<T>
{
	constructor(cols : column<T>[])
	{
		;
	};
};

enum sort_state
{
	INERT = "=",
	ASCENDING = "^",
	DESCENDING = "_"
};

class sort_th<T>
{
	constructor(label : string)
	{
		this._cell = document.createElement(`th`);
		this._notification = document.createElement(`a`);
		
		// styling
		this._notification.style.userSelect = `none`;

		this._cell.innerHTML += `${label}`;
		this._cell.insertAdjacentElement(`beforeend`, this._notification);

		this._notification.onclick = () => {
			this.cycle();
		};
		this.notification_change();
	};

	get th() : HTMLTableCellElement
	{
		return this._cell;
	};

	get state() : sort_state
	{
		return this._state;
	};

	set onclick(cbf : (state : sort_state) => any)
	{
		this._notification.onclick = () => {
			this.cycle();
			cbf(this._state);
		};
	};

	private cycle()
	{
		switch (this._state) {
			default:
			case sort_state.INERT:
				this._state = sort_state.ASCENDING;
				break;
			case sort_state.ASCENDING:
				this._state = sort_state.DESCENDING;
				break;
			case sort_state.DESCENDING:
				this._state = sort_state.INERT;
				break;
		};
		this.notification_change();
	};

	private notification_change()
	{
		this._notification.innerHTML = `${this._state}`;
	};

	//private _rows : row<T>[];
	private _cell : HTMLTableCellElement;
	private _notification : HTMLAnchorElement;
	private _state : sort_state = sort_state.INERT;
};

// preloads the tables into the <table> tag
// toggle them by onclick event from the page selector based on the pagnation
class view<T>
{
	constructor(main : HTMLTableElement, avail_sizes : number[] = [10, 20, 50, 100])
	{
		this._main = main;
		this._colgroups = document.createElement(`colgroup`);
		this._header = document.createElement(`thead`);
		this._footer = document.createElement(`tfoot`);

		this._main.insertAdjacentElement(`beforeend`,this._colgroups);
		this._main.insertAdjacentElement(`beforeend`, this._header);
		this._main.insertAdjacentElement(`beforeend`, this._footer);
		this._sizes = avail_sizes;
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

	set columns(info : column<T>[])
	{
		this._columns = [];
		this._columns.push(...info);
	};

	set size(input : number)
	{
		this._current_size = input;
	};

	rebuild()
	{
		this.build_header();
		this.build_bodies();
		this.build_footer();
	};

	private build_header()
	{
		/*
		let row = this._header.querySelector(`tr`);
		if (!row) {
			row = document.createElement(`tr`);
			this._header.insertAdjacentElement(`afterbegin`, row);
		};
		*/

		this._header.innerHTML = "";
		this._colgroups.innerHTML = "";
		let col : HTMLTableColElement;
		let sort_header : sort_th<T>;
		this._columns.forEach((v, i, a) => {
			sort_header = new sort_th<T>(v.label);
			sort_header.onclick = (st) => {
				switch (st) {
					case sort_state.ASCENDING:
						this._rows = this._rows.sort(v.comparator);
						break;
					case sort_state.DESCENDING:
						this._rows = this._rows.sort(v.comparator).reverse();
						break;
					default:
						break;
				}
				this.build_bodies();
				//this.build_footer();
			};
			this._header.insertAdjacentElement(`beforeend`, sort_header.th);

			
			col = document.createElement(`col`);
			this._colgroups.insertAdjacentElement(`beforeend`, col);
			
		});
	};

	// what if we already load the rows into the DOM, tagged with pages
	// then when calling a page, hides the other rows but the ones tagged with the
	// called page
	// use default value of 10 results per page
	private build_bodies()
	{
		// first clear out all tbodys
		this._bodies = [];
		this._main.querySelectorAll(`tbody`).forEach((v, i, a) => {
			this._main.removeChild(v);
		});

		//let size = this._sizes[index];
		let to_push : HTMLTableSectionElement;
		this._rows.forEach((v, i, a) => {
			if (i % this._current_size === 0) {
				to_push = document.createElement(`tbody`);
				this._bodies.push(to_push);
			}

			to_push.insertAdjacentElement(`beforeend`, v.row);
		});

		// paint the bodies

		this._bodies.forEach((v, i, a) => {
			v.style.display = "none";
			this._footer.insertAdjacentElement(`beforebegin`, v);
		});

		// keep current table position even if it we switch
		this.switch_view(this._bodies[this._last_index]);
	};

	private build_footer()
	{
		//let num_pages = this._bodies.length;
		//let num_rows = this._rows.length;
		let row : HTMLTableRowElement = this._footer.querySelector(`tr`);
		let cell : HTMLTableCellElement = this._footer.querySelector(`td`);
		if (!row) {
			row = document.createElement(`tr`);
			cell = document.createElement(`td`);
			
			//cell.scope = `column`;
		}
		// build pagnation symbols here
		let page_select_elements : HTMLAnchorElement[] = [];
		let cur_page : HTMLAnchorElement;
		this._bodies.forEach((v, i, a) => {
			cur_page = document.createElement(`a`);
			//
			cur_page.innerHTML = ` ${i + 1} `;
			//cur_page.style.flex = `auto`;
			cur_page.onclick = () => {
				this.switch_view(v);
				this._last_index = i;
			};
			//
			page_select_elements.push(cur_page);
		});

		// ensure cell is empty before going onwards
		cell.innerHTML = "";
		page_select_elements.forEach((v, i, a) => {
			cell.insertAdjacentElement(`beforeend`, v);
		});
		cell.colSpan = this._columns.length;

		//cell.innerHTML = `${num_pages} tables & ${num_rows} rows`;
		row.insertAdjacentElement(`beforeend`, cell);
		this._footer.insertAdjacentElement(`beforeend`, row);

	};

	private switch_view(incoming : HTMLTableSectionElement)
	{
		let outgoing = this._current_body;
		this._current_body = incoming;
		if (outgoing) {
			outgoing.style.display = "none";
		};
		this._current_body.style.display = "";

	};

	// controls what rows are viewed, and provides a 
	// interface to control how many units there can be
	// note the tables must be already loaded into the class or reloaded as needed
	private controls : HTMLDivElement;
	private _bodies : HTMLTableSectionElement[];

	private _main : HTMLTableElement;
	private _colgroups : HTMLTableColElement;
	private _header : HTMLTableSectionElement;
	private _footer : HTMLTableSectionElement;
	private _current_body : HTMLTableSectionElement;

	private _columns : column<T>[];
	private _rows : row<T>[] = [];
	private _current_size : number = 10;
	private _sizes : number[];

	private _last_index : number = 0;
};

export class table<T>
{
	constructor(main : HTMLDivElement, tree_accessor? : ((q : T) => T[]))
	{
		this._main = main;
		this._main.innerHTML = "";

		this._options = document.createElement(`div`);
		this._table = document.createElement(`table`);

		this._main.insertAdjacentElement(`afterbegin`, this._options);
		this._main.insertAdjacentElement(`afterbegin`, this._table);

		this._view = new view<T>(this._table);
	};

	set columns(info : column<T>[])
	{
		this._view.columns = info;
	};

	set data(src : T[])
	{
		this._view.data = src;
	};

	paint()
	{
		this._view.rebuild();
	};

	// for pagnation, maybe multiple <tbody>'s will work
	// display one, dont display the others
	// on the footer of the table?
	// left ## of ## rows, middle page ## of ##, right: sequence and current position
	private _options : HTMLDivElement;
	private _view : view<T>;
	private _main : HTMLDivElement;
	private _table : HTMLTableElement;
	
	private _bodies : HTMLTableSectionElement[];
	// where we add pagnation details
	
	private _footer : HTMLDivElement;

};