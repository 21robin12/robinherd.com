class App {

    public static CELL_EDGE_PX = 0;

    private lastFrameMs: number;
    private canvas: HTMLCanvasElement;
    private mousePosition: Point2D;
    private grid: Grid;
    private swipeIcon: SwipeIcon;
    private step: number;
    private visualizer: Visualizer;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.updateCellEdgePx();

        this.mousePosition = null;
        this.grid = new Grid();
        this.step = 1;

        if (this.isTouchDevice()) {
            this.swipeIcon = new SwipeIcon();
        }

        var palette = new Palette(Constants.COLORS, Constants.MAXIMUM_INTENSITY, Constants.GRADIENT_COLOR_COUNT);
        this.visualizer = new Visualizer(palette);
    }

    public restart() {
        this.updateCellEdgePx();
        
        this.mousePosition = null;
        this.grid = new Grid();
        this.step = 1;
    }

    public start() {

        var setMousePosition = (x: number, y: number) => {
            x = Math.max(0, Math.min(window.innerWidth - 1, x));
            y = Math.max(0, Math.min(window.innerHeight - 1, y));
            this.mousePosition = new Point2D(x, y);
        };

        document.addEventListener("touchmove", (e) => {
            if (e.changedTouches.length > 0) {
                setMousePosition(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
            }
        });

        document.addEventListener("touchend", (e) => {
            this.mousePosition = null;
        });

        document.onmousemove = (e) => {
            setMousePosition(e.clientX, e.clientY);
        };

        document.onmouseout = (e) => {
            this.mousePosition = null;
        };

        this.lastFrameMs = new Date().getTime();

        setInterval(() => {
            this.doStep();
        }, Constants.FRAME_MS);
    }  

    // https://stackoverflow.com/questions/4817029/whats-the-best-way-to-detect-a-touch-screen-device-using-javascript
    private isTouchDevice() {
        return 'ontouchstart' in window || navigator.maxTouchPoints;
    };

    private doStep() {
        var now = new Date().getTime();
        var dt = now - this.lastFrameMs;
        this.lastFrameMs = now;

        this.evolve(dt);
        
        this.draw();

        this.step++;
    }

    private evolve(dt: number) {
        this.grid.evolve(this.mousePosition, dt, this.step % 2 === 0);

        if (this.swipeIcon) {
            this.swipeIcon.evolve(dt);
        }
    }

    private draw() {
        this.visualizer.draw(this.canvas, this.grid);
    }

    private updateCellEdgePx() {
        var cellCount = 1000;
        var area = this.canvas.width * this.canvas.height;
        var cellArea = area / cellCount;
        var cellEdgePx = Math.floor(Math.sqrt(cellArea));

        App.CELL_EDGE_PX = cellEdgePx;
    }
}