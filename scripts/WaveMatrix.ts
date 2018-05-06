class WaveMatrix {
    public UP: number = 0;
    public RIGHT: number = 0;
    public DOWN: number = 0;
    public LEFT: number = 0;
    public UP_LEFT: number = 0;
    public UP_RIGHT: number = 0;
    public DOWN_RIGHT: number = 0;
    public DOWN_LEFT: number = 0;

    public total() {
        return this.UP +
            this.RIGHT +
            this.DOWN +
            this.LEFT +
            this.UP_LEFT +
            this.UP_RIGHT +
            this.DOWN_RIGHT +
            this.DOWN_LEFT;
    }

    public applyDeltas(deltas: WaveMatrix) {
        this.UP = Math.max(0, this.UP + deltas.UP);
        this.RIGHT = Math.max(0, this.RIGHT + deltas.RIGHT);
        this.DOWN = Math.max(0, this.DOWN + deltas.DOWN);
        this.LEFT = Math.max(0, this.LEFT + deltas.LEFT);
        this.UP_LEFT = Math.max(0, this.UP_LEFT + deltas.UP_LEFT);
        this.UP_RIGHT = Math.max(0, this.UP_RIGHT + deltas.UP_RIGHT);
        this.DOWN_RIGHT = Math.max(0, this.DOWN_RIGHT + deltas.DOWN_RIGHT);
        this.DOWN_LEFT = Math.max(0, this.DOWN_LEFT + deltas.DOWN_LEFT);
    }
}