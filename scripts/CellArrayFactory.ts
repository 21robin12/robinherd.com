class CellArrayFactory {

    public static create(width: number, height: number) {
        var columns = [];
        for (var i = 0; i < width; i++) {
            var column = [];
            for (var j = 0; j < height; j++) {
                column.push(new Cell());
            }

            columns.push(column);
        }

        return columns;
    }
}