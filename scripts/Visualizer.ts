class Visualizer {

    private palette: Palette;

    constructor(palette: Palette) {
        this.palette = palette;
    }

    public draw(canvas: HTMLCanvasElement, grid: Grid) {
        var maxX = Math.ceil(canvas.width / App.CELL_EDGE_PX);
        var maxY = Math.ceil(canvas.height / App.CELL_EDGE_PX);
        var context = canvas.getContext("2d");

        for (var i = 0; i < maxX; i++) {
            var column = grid.array[i];

            for (var j = 0; j < maxY; j++) {
                var cell = column[j];
                var color = this.palette.getColor(cell.getIntensity());
                context.fillStyle = color;

                context.fillRect(i * App.CELL_EDGE_PX, j * App.CELL_EDGE_PX, App.CELL_EDGE_PX, App.CELL_EDGE_PX);

                // context.font = "14px Consolas";
                // context.fillStyle= "black";
                // context.fillText(cell.getIntensity().toFixed(0),i * App.CELL_EDGE_PX,j * App.CELL_EDGE_PX + 14);
            }
        }
    } 
}