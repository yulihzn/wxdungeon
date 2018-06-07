class AstarGrid {
	private _startNode: AstarNode;    //起点
	private _endNode: AstarNode;      //终点
	private _nodes: Array<any>;  //Node数组
	private _numCols: number;    //网格行列
	private _numRows: number;

	public constructor(numCols: number, numRows: number) {
		this._numCols = numCols;
		this._numRows = numRows;
		this._nodes = [];

		for (let i: number = 0; i < numCols; i++) {
			this._nodes[i] = [];
			for (let j: number = 0; j < numRows; j++) {
				this._nodes[i][j] = new AstarNode(i, j);
				this.setWalkable(i,j,true);
			}
		}
	}

	public getNode(x: number, y: number): AstarNode {
		return this._nodes[x][y];
	}

	public setEndNode(x: number, y: number) {
		this._endNode = this._nodes[x][y];
	}

	public setStartNode(x: number, y: number) {
		this._startNode = this._nodes[x][y];
	}

	public setWalkable(x: number, y: number, value: boolean) {
		this._nodes[x][y].walkable = value;
	}

	public get endNode() {
		return this._endNode;
	}

	public get numCols() {
		return this._numCols;
	}

	public get numRows() {
		return this._numRows;
	}

	public get startNode() {
		return this._startNode;
	}
}