class DeltaGrid {

    public array: Cell[][];

    constructor(width: number, height: number) {
        this.array = CellArrayFactory.create(width, height);
    }

    public increase(i: number, j: number, waveType: string, delta: number) {
        var cell = this.array[i][j];
        cell.waves[waveType] += delta;
    }

    public increaseAdjacent(i: number, j: number, waveType: string, delta: number) {
        if (waveType === "UP" || waveType === "UP_LEFT" || waveType === "UP_RIGHT") j--;
        if (waveType === "RIGHT" || waveType === "UP_RIGHT" || waveType === "DOWN_RIGHT") i++;
        if (waveType === "DOWN" || waveType === "DOWN_LEFT" || waveType === "DOWN_RIGHT") j++;
        if (waveType === "LEFT" || waveType === "UP_LEFT" || waveType === "DOWN_LEFT") i--;

        if (i > -1 && j > -1 && i < this.array.length && j < this.array[0].length) {
            this.increase(i, j, waveType, delta);
        }
    }
}