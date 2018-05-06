class SwipeIcon {
    
    private icon: HTMLElement;

    private elapsed: number;
    private movingRight: boolean;
    private remainingDelayMs: number;
    private cycles: number;    
    private isComplete: boolean;

    constructor() {
        this.icon = document.getElementById("swipe-icon");

        this.elapsed = 0;
        this.remainingDelayMs = Constants.SWIPE_ICON_DELAY_MS;
        this.movingRight = true;
        this.cycles = 0;
        this.isComplete = false;
        
        this.hide();
    }

    public evolve(dt: number) {
        if (!this.isComplete) {
            if (this.remainingDelayMs > 0) {
                this.remainingDelayMs -= dt;
                if (this.remainingDelayMs <= 0) {
                    this.updatePosition();
                    this.show();
                }
            } else {
                if (this.movingRight) {
                    if (this.elapsed < Constants.SWIPE_ICON_DURATION_MS) {
                        this.elapsed += dt;
                        this.updatePosition();
                    } else {
                        this.movingRight = false;
                    }
                } else {
                    if (this.elapsed > 0) {
                        this.elapsed -= dt;
                        this.updatePosition();
                    } else {
                        this.movingRight = true;
                        this.cycles++;

                        if (this.cycles >= Constants.SWIPE_ICON_CYCLES_COUNT) {
                            this.isComplete = true;
                            this.hide();
                        }
                    }
                }
            }   
        }
    }

    private show() {
        this.icon.style.visibility = "visible";
    }

    private hide() {
        this.icon.style.visibility = "hidden";
    }

    private updatePosition() {
        var progress = (this.elapsed - (Constants.SWIPE_ICON_DURATION_MS / 2)) / (Constants.SWIPE_ICON_DURATION_MS / 2);

        if (progress < 0) {
            var padding = -progress * Constants.SWIPE_ICON_OFFSET_PX;
            this.icon.setAttribute("style", "padding-right:" + padding + "px;");
        } else if (progress > 0) {
            var padding = progress * Constants.SWIPE_ICON_OFFSET_PX;
            this.icon.setAttribute("style", "padding-left:" + padding + "px;");
        } else {
            this.icon.setAttribute("style", "");
        }
    }
}