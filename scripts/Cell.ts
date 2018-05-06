class Cell {
    
    public isSource: boolean;
    public waves: WaveMatrix;

    constructor() {
        this.isSource = false;
        this.waves = new WaveMatrix();
    }

    public getIntensity() {
        return this.waves.total() + (this.isSource ? Constants.SOURCE_INTENSITY : 0);
    }
}