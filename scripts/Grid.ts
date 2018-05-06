interface IForEachCell {
    (i: number, j: number, cell: Cell): void
}

class Grid {

    public array: Cell[][];

    private mousePosition: Point2D;
    private sourceCells: Cell[];

    constructor() {
        var width = Math.ceil(window.innerWidth / App.CELL_EDGE_PX);
        var height = Math.ceil(window.innerHeight / App.CELL_EDGE_PX);
        this.array = CellArrayFactory.create(width, height);
        this.mousePosition = null;
        this.sourceCells = [];
    }    

    public evolve(mousePosition: Point2D, dt: number, isEvenStep: boolean) {
      
        // 1 - calcuclate deltas
        var deltaGrid = new DeltaGrid(this.array.length, this.array[0].length);

        var timeRatio = Constants.SPEED_FUDGE_FACTOR * (dt / Constants.FRAME_MS);
        var sourceSpread = Constants.SOURCE_SPREAD * timeRatio;
        var diagonalSourceSpread = Constants.SOURCE_SPREAD * Constants.SPREAD_FACTOR * timeRatio;
        var spreadMultiplier = Constants.SPREAD_FACTOR * timeRatio;
        var diagonalSpreadMultiplier = Constants.SPREAD_FACTOR * Constants.SPREAD_FACTOR * timeRatio;
        var decayMultiplier = Constants.DECAY_FACTOR * timeRatio;

        this.forEachCell((i, j, cell) => {
            if (isEvenStep) {
                this.addDiagonalDeltas(deltaGrid, i, j, cell, diagonalSourceSpread, diagonalSpreadMultiplier, decayMultiplier);
                this.addLinearDeltas(deltaGrid, i, j, cell, sourceSpread, spreadMultiplier, decayMultiplier);
            } else {
                this.addLinearDeltas(deltaGrid, i, j, cell, sourceSpread, spreadMultiplier, decayMultiplier);
            }
        });

        // 2 - apply deltas
        this.forEachCell((i, j, cell) => {
            cell.waves.applyDeltas(deltaGrid.array[i][j].waves);
        });

        // 3 - deal with sources
        if (isEvenStep) {
            // 3.1 - turn off all current sources
            this.sourceCells.map((cell) => {
                cell.isSource = false;
            });
            this.sourceCells = [];

            // 3.2 - add new sources
            if (mousePosition !== null) {
                this.setSourceCells(mousePosition);
            }

            // 3.3 - update mouse position
            this.mousePosition = mousePosition;
        }
    }

    private forEachCell(action: IForEachCell) {
        for (var i = 0; i < this.array.length; i++) {
            var column = this.array[i];

            for (var j = 0; j < column.length; j++) {
                var cell = column[j];

                action(i, j, cell);
            }
        }
    }

    private addLinearDeltas(deltaGrid: DeltaGrid, i: number, j: number, cell: Cell, sourceSpread: number, spreadMultiplier: number, decayMultiplier: number) {

        if (cell.isSource) {
            deltaGrid.increaseAdjacent(i, j, "UP", sourceSpread);
            deltaGrid.increaseAdjacent(i, j, "RIGHT", sourceSpread);
            deltaGrid.increaseAdjacent(i, j, "DOWN", sourceSpread);
            deltaGrid.increaseAdjacent(i, j, "LEFT", sourceSpread);
        }
        if (cell.waves["UP"] > 0) {
            deltaGrid.increaseAdjacent(i, j, "UP", cell.waves.UP * spreadMultiplier);
            deltaGrid.increase(i, j, "UP", -cell.waves.UP * decayMultiplier);
        }
        if (cell.waves["RIGHT"] > 0) {
            deltaGrid.increaseAdjacent(i, j, "RIGHT", cell.waves.RIGHT * spreadMultiplier);
            deltaGrid.increase(i, j, "RIGHT", -cell.waves.RIGHT * decayMultiplier);
        }
        if (cell.waves["DOWN"] > 0) {
            deltaGrid.increaseAdjacent(i, j, "DOWN", cell.waves.DOWN * spreadMultiplier);
            deltaGrid.increase(i, j, "DOWN", -cell.waves.DOWN * decayMultiplier);
        }
        if (cell.waves["LEFT"] > 0) {
            deltaGrid.increaseAdjacent(i, j, "LEFT", cell.waves.LEFT * spreadMultiplier);
            deltaGrid.increase(i, j, "LEFT", -cell.waves.LEFT * decayMultiplier);
        }
        if (cell.waves["UP_LEFT"] > 0) {
            deltaGrid.increaseAdjacent(i, j, "UP", cell.waves.UP_LEFT * spreadMultiplier);
            deltaGrid.increaseAdjacent(i, j, "LEFT", cell.waves.UP_LEFT * spreadMultiplier);
        }
        if (cell.waves["UP_RIGHT"] > 0) {
            deltaGrid.increaseAdjacent(i, j, "UP", cell.waves.UP_RIGHT * spreadMultiplier);
            deltaGrid.increaseAdjacent(i, j, "RIGHT", cell.waves.UP_RIGHT * spreadMultiplier);
        }
        if (cell.waves["DOWN_RIGHT"] > 0) {
            deltaGrid.increaseAdjacent(i, j, "DOWN", cell.waves.DOWN_RIGHT * spreadMultiplier);
            deltaGrid.increaseAdjacent(i, j, "RIGHT", cell.waves.DOWN_RIGHT * spreadMultiplier);
        }
        if (cell.waves["DOWN_LEFT"] > 0) {
            deltaGrid.increaseAdjacent(i, j, "DOWN", cell.waves.DOWN_LEFT * spreadMultiplier);
            deltaGrid.increaseAdjacent(i, j, "LEFT", cell.waves.DOWN_LEFT * spreadMultiplier);
        }
    }

    private addDiagonalDeltas(deltaGrid: DeltaGrid, i: number, j: number, cell: Cell, diagonalSourceSpread: number, diagonalSpreadMultiplier: number, decayMultiplier: number) {
        if (cell.isSource) {
            deltaGrid.increaseAdjacent(i, j, "UP_LEFT", diagonalSourceSpread);
            deltaGrid.increaseAdjacent(i, j, "UP_RIGHT", diagonalSourceSpread);
            deltaGrid.increaseAdjacent(i, j, "DOWN_RIGHT", diagonalSourceSpread);
            deltaGrid.increaseAdjacent(i, j, "DOWN_LEFT", diagonalSourceSpread);
        }
        if (cell.waves["UP_LEFT"] > 0) {
            deltaGrid.increaseAdjacent(i, j, "UP_LEFT", cell.waves.UP_LEFT * diagonalSpreadMultiplier);
            deltaGrid.increase(i, j, "UP_LEFT", -cell.waves.UP_LEFT * decayMultiplier);
        }
        if (cell.waves["UP_RIGHT"] > 0) {
            deltaGrid.increaseAdjacent(i, j, "UP_RIGHT", cell.waves.UP_RIGHT * diagonalSpreadMultiplier);
            deltaGrid.increase(i, j, "UP_RIGHT", -cell.waves.UP_RIGHT * decayMultiplier);
        }
        if (cell.waves["DOWN_RIGHT"] > 0) {
            deltaGrid.increaseAdjacent(i, j, "DOWN_RIGHT", cell.waves.DOWN_RIGHT * diagonalSpreadMultiplier);
            deltaGrid.increase(i, j, "DOWN_RIGHT", -cell.waves.DOWN_RIGHT * decayMultiplier);
        }
        if (cell.waves["DOWN_LEFT"] > 0) {
            deltaGrid.increaseAdjacent(i, j, "DOWN_LEFT", cell.waves.DOWN_LEFT * diagonalSpreadMultiplier);
            deltaGrid.increase(i, j, "DOWN_LEFT", -cell.waves.DOWN_LEFT * decayMultiplier);
        }
    }

    private setSourceCells(mousePosition: Point2D) {
        var iCurrent = Math.floor(mousePosition.x / App.CELL_EDGE_PX);
        var jCurrent = Math.floor(mousePosition.y / App.CELL_EDGE_PX);

        var previousMousePosition = this.mousePosition;
        if (previousMousePosition === null) {
            // place point
            var cell = this.array[iCurrent][jCurrent];
            cell.isSource = true;
            this.sourceCells.push(cell);
        } else if (previousMousePosition.x !== mousePosition.x || previousMousePosition.y !== mousePosition.y) {

            // line between two mouse positions
            var line = new Line2D(previousMousePosition, mousePosition);

            // place line
            var iPrev = Math.floor(previousMousePosition.x / App.CELL_EDGE_PX);
            var jPrev = Math.floor(previousMousePosition.y / App.CELL_EDGE_PX);

            for (var i = Math.min(iCurrent, iPrev); i <= Math.max(iCurrent, iPrev); i++) {
                for (var j = Math.min(jCurrent, jPrev); j <= Math.max(jCurrent, jPrev); j++) {

                    var middle = new Point2D((i + 0.5) * App.CELL_EDGE_PX, (j + 0.5) * App.CELL_EDGE_PX);
                    var distance = line.distanceTo(middle);

                    if (distance < App.CELL_EDGE_PX * 1.5) {
                        var cell = this.array[i][j];
                        cell.isSource = true;
                        this.sourceCells.push(cell);
                    }
                }   
            }                    
        }
    }
}