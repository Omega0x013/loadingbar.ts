/**
 * # LoadingBar
 * Class representing a single loading bar, widely customisable through the `BarStyle` class
 * 
 * Defaults to a dynamic screen-width bar with small gutters
 * 
 * Components collapse to fit parts of the bar as the screen gets smaller
 * 
 * ```js
 * 
 * ```
 */
export default class LoadingBar {
    cols:     number;
    max:      number; // Total number of elements to complete
    reset:    boolean; // Whether or not to use ESC A, CR sequence to overwrite the previous bar
    style:    BarStyle;
    dynamic:  boolean; // Switch this off if you don't want the screen size re-measured to dynamically size the bar

    // constructor(style?: BarStyle, max?: number, dynamic?: boolean, cols?: number) {
    //     this.cols = ; // Width of loading bar
    //     this.dynamic = dynamic || true;
    // }
    constructor(
        style = new BarStyle(),
        max = 100,
        dynamic = true,
        reset = true,
        cols: number = Deno.consoleSize(Deno.stdout.rid).columns
    ) {
        this.style = style;
        this.max = max;
        this.dynamic = dynamic;
        this.reset = reset;
        this.cols = cols;
    }
    /**
     * Get a rendered loading bar with the current style sizing options
     */
    display(current: number): string {
        // re-calculates width
        if (this.dynamic) this.cols = Deno.consoleSize(Deno.stdout.rid).columns;

        return "Hello World!";
    }
}

/**
 * Represents the style for a loading bar, customisable with its properties, has reasonable ASCII defaults
 * 
| Argument | Type        | Component                     | Default     |
|----------|-------------|-------------------------------|-------------|
| `lM`     | string      | Left Message                  | `'Loading'` |
| `rM`     | string      | Right Message                 | `''`        |
| `fC`     | string      | Fill Character                | `'#'`       |
| `eC`     | string      | Empty Character               | `' '`       |
| `lC`     | string      | Left Cap                      | `'['`       |
| `rC`     | string      | Right Cap                     | `']'`       |
| `n`      | NumberStyle | How to present the number     | percent     |
| `g`      | number      | Gutter padding on either side | 1           |

```js
const bar: LoadingBar = {
    style: 
}
```
 */
export class BarStyle {
    // looks ugly, is ugly
    lM:string;rM:string;
    fC:string;eC:string;
    lC:string;rC:string;
    n:NumberStyle;
    g:number;
    constructor(
        lM?:string, rM?:string,
        fC?:string, eC?:string,
        lC?:string, rC?:string,
        n?:NumberStyle,
        g?:number
    ) {
        this.lM = lM || "Loading";
        this.rM = rM || "";
        this.fC = fC || "#";
        this.eC = eC || " ";
        this.lC = lC || "[";
        this.rC = rC || "]";
        this.n = n || NumberStyle.percent;
        this.g = g || 1;
    }
}

export enum NumberStyle {
    none,
    percent,
    original,
    divided
}