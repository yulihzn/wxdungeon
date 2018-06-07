class AstarMap {
	private _open: Array<any>;               //待考察表
	private _closed: Array<any>;             //已考察表
	private _grid: AstarGrid;               //网格
	private _endNode: AstarNode;                  //终点Node
	private _startNode: AstarNode;                //起点Node
	private _path: Array<AstarNode>;               //保存路径
	private _heuristic: Function;            //寻路算法
	private _straightCost: number = 1.0;     //上下左右走的代价
	private _diagCost: number = Math.SQRT2;  //斜着走的代价 


	public constructor() {
		//this._heuristic = this.manhattan;  
		//this._heuristic = this.euclidian;
		this._heuristic = this.diagonal;
	}

	//寻路
	public findPath(grid: AstarGrid): boolean {
		this._grid = grid;
		this._open = [];
		this._closed = [];

		this._startNode = this._grid.startNode;
		this._endNode = this._grid.endNode;

		this._startNode.g = 0;
		this._startNode.h = this._heuristic(this._startNode);
		this._startNode.f = this._startNode.g + this._startNode.h;

		return this.search();
	}

	//查找路径
	public search(): boolean {
		let node: AstarNode = this._startNode;
		while (node != this._endNode) {
			let startX = Math.max(0, node.x - 1);
			let endX = Math.min(this._grid.numCols - 1, node.x + 1);
			let startY = Math.max(0, node.y - 1);
			let endY = Math.min(this._grid.numRows - 1, node.y + 1);

			for (let i = startX; i <= endX; i++) {
				for (let j = startY; j <= endY; j++) {
					//不让斜着走
					if (i != node.x && j != node.y) {
						continue;
					}

					let test: AstarNode = this._grid.getNode(i, j);
					if (test == node ||
						!test.walkable ||
						!this._grid.getNode(node.x, test.y).walkable ||
						!this._grid.getNode(test.x, node.y).walkable) {
						continue;
					}

					let cost: number = this._straightCost;
					if (!((node.x == test.x) || (node.y == test.y))) {
						cost = this._diagCost;
					}
					let g = node.g + cost * test.costMultiplier;
					let h = this._heuristic(test);
					let f = g + h;
					if (this.isOpen(test) || this.isClosed(test)) {
						if (test.f > f) {
							test.f = f;
							test.g = g;
							test.h = h;
							test.parent = node;
						}
					}
					else {
						test.f = f;
						test.g = g;
						test.h = h;
						test.parent = node;
						this._open.push(test);
					}
				}
			}
			for (let o = 0; o < this._open.length; o++) {
			}
			this._closed.push(node);
			if (this._open.length == 0) {
				console.log("AStar >> no path found");
				return false
			}

			let openLen = this._open.length;
			for (let m = 0; m < openLen; m++) {
				for (let n = m + 1; n < openLen; n++) {
					if (this._open[m].f > this._open[n].f) {
						let temp = this._open[m];
						this._open[m] = this._open[n];
						this._open[n] = temp;
					}
				}
			}

			node = this._open.shift() as AstarNode;
		}
		this.buildPath();
		return true;
	}

	//获取路径
	private buildPath(): void {
		this._path = new Array();
		let node: AstarNode = this._endNode;
		this._path.push(node);
		while (node != this._startNode) {
			node = node.parent;
			this._path.unshift(node);
		}
	}

	public get path() {
		return this._path;
	}

	//是否待检查
	private isOpen(node: AstarNode): boolean {
		for (let i = 0; i < this._open.length; i++) {
			if (this._open[i] == node) {
				return true;
			}
		}
		return false;
	}

	//是否已检查
	private isClosed(node: AstarNode): boolean {
		for (let i = 0; i < this._closed.length; i++) {
			if (this._closed[i] == node) {
				return true;
			}
		}
		return false;
	}

	//曼哈顿算法
	private manhattan(node: AstarNode) {
		return Math.abs(node.x - this._endNode.x) * this._straightCost + Math.abs(node.y + this._endNode.y) * this._straightCost;
	}


	private euclidian(node: AstarNode) {
		let dx = node.x - this._endNode.x;
		let dy = node.y - this._endNode.y;
		return Math.sqrt(dx * dx + dy * dy) * this._straightCost;
	}

	private diagonal(node: AstarNode) {
		let dx = Math.abs(node.x - this._endNode.x);
		let dy = Math.abs(node.y - this._endNode.y);
		let diag = Math.min(dx, dy);
		let straight = dx + dy;
		return this._diagCost * diag + this._straightCost * (straight - 2 * diag);
	}

	public get visited() {
		return this._closed.concat(this._open);
	}
}