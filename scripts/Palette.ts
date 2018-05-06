// https://stackoverflow.com/questions/43702518/typescript-property-log10-does-not-exist-on-type-math
declare interface Math {
    log10(x: number): number;
}

class Palette {

    private logMax: number;
    private gradient: string[];

    constructor(colors: string[], maximumValue: number, gradientColorCount: number) {
        this.logMax = Math.log10(maximumValue + 1);

        var betweens = gradientColorCount - colors.length;
        var numberOfIntervals = colors.length - 1;
        var remainder = betweens % numberOfIntervals;
        var remaining = remainder;

        // calculate intervals (from color 0->1, 1->2, 2->3 etc.)
        var intervals = [];
        for (var i = 0; i < numberOfIntervals; i++) {
            var intervalLength = (betweens - remainder) / numberOfIntervals;
            if (remaining > 0) {
                intervalLength++;
                remaining--;
            }

            var startColor = colors[i]; 
            var endColor = colors[i + 1];
            var stepRatio = 1 / (intervalLength + 1);

            var interval = [];

            interval.push("#" + startColor); 
            for (var step = 1; step < intervalLength + 1; step++) {
                var stepColor = this.colorBetween(endColor, startColor, step * stepRatio);
                interval.push("#" + stepColor);
            }

            interval.push("#" + endColor);
            intervals.push(interval);
        }

        // get total gradient from intervals (0->1->2->3->n)
        this.gradient = [];
        for (var i = 0; i < intervals.length; i++) {
            var thisInterval = intervals[i];

            for (var j = 0; j < thisInterval.length - 1; j++) {
                this.gradient.push(thisInterval[j]);
            }
        }

        this.gradient.push("#" + colors[colors.length - 1]);
    }

    public getColor(value: number) {
        // Math.log10(1) === 0
        value += 1;
        if (value <= 1) {
            return this.gradient[0];
        }

        var factor = (Math.log10(value) / this.logMax) * (this.gradient.length - 1);
        var index = Math.min(this.gradient.length - 1, Math.floor(factor));
        return this.gradient[index];
    }

    // https://stackoverflow.com/questions/16360533/calculate-color-hex-having-2-colors-and-percent-position
    private colorBetween(color1: string, color2: string, ratio: number) {
        var r = Math.ceil(parseInt(color1.substring(0,2), 16) * ratio + parseInt(color2.substring(0,2), 16) * (1-ratio));
        var g = Math.ceil(parseInt(color1.substring(2,4), 16) * ratio + parseInt(color2.substring(2,4), 16) * (1-ratio));
        var b = Math.ceil(parseInt(color1.substring(4,6), 16) * ratio + parseInt(color2.substring(4,6), 16) * (1-ratio));

        var middle = this.hex(r) + this.hex(g) + this.hex(b);
        return middle;
    }

    private hex(x: number) {
        x = Math.max(0, Math.min(x, 255));
        var xString = x.toString(16);
        return (xString.length == 1) ? '0' + xString : xString;
    }
} 