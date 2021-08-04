/**
 * Copyright © 2000 Your Name <your@address>
 * This work is free. You can redistribute it and/or modify it under the
 * terms of the Do What The Fuck You Want To Public License, Version 2,
 * as published by Sam Hocevar. See http://www.wtfpl.net/ for more details.
 * 
 *             DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
 *                     Version 2, December 2004
 * 
 *  Copyright (C) 2004 Sam Hocevar <sam@hocevar.net>
 * 
 *  Everyone is permitted to copy and distribute verbatim or modified
 *  copies of this license document, and changing it is allowed as long
 *  as the name is changed.
 * 
 *             DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
 *    TERMS AND CONDITIONS FOR COPYING, DISTRIBUTION AND MODIFICATION
 * 
 *   0. You just DO WHAT THE FUCK YOU WANT TO.
 */
 
/**
 * # LoadingBar
 * Class representing a single loading bar, widely customisable through the `BarStyle` class
 * 
 * ```ts
const bar = new LoadingBar(new BarStyle("Hello", "World!"), 10);
for (let i = 0; i < 10; i++) {
  console.log(bar.display(i));
  await (() => new Promise((r) => setTimeout(r, 100)))();
}
console.log(bar.display(10));
// Please leave a 100% loading bar on your screen as shown here
// incomplete bars irk me
 * ```
 * 
 * Defaults to a dynamic screen-width bar with small gutters. With default settings just use `console.log` repeatedly
 * and don't print anything while the loading bar is being used. You can take control of newlines and returns yourself
 * by setting `reset=false`, which will stop it emittng a `\x1B[F` to return after a line break
 * 
 * Components collapse to fit parts of the bar as the screen gets smaller.
 * The bar shrinks to 5 points wide before things begin to be collapsed.
 * The minimum size of the bar is defined as `style(max).len + 2`;
 * for percentage bars this will always be 6.
 * This applies most when using dynamic bars.
 * 
 * Things are collapsed in this order:
 * - Right Text
 * - Left Text
 * - Visual Bar
 * 
 * I recommend calling your bar one last time after your loading loop is complete to show 100% completion - for my sanity if not yours.
 */
export default class LoadingBar {
  cols:     number; // Width of the screen the bar has to fit in
  max:      number; // Total number of elements to complete
  reset:    boolean; // Whether or not to use ESC A, CR sequence to overwrite the previous bar
  style:    BarStyle;
  dynamic:  boolean; // Switch this off if you don't want the screen size re-measured to dynamically size the bar

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
    /**
     * Free space minimums for collapsing:
     * Add the number
     * Add the left text
     * If we can add right text do that
     */
    // re-calculates width if the bar is dynamic
    if (this.dynamic) this.cols = Deno.consoleSize(Deno.stdout.rid).columns;
    let num:string = current.toString(); // single style by default
    switch (this.style.n) {
      case NumberStyle.divide:
        num = `${num}/${this.max}`;
        break;
      case NumberStyle.percent:
        num = `${Math.trunc((current/this.max)*100)}%`;
        break;
    }
    // with each addition see if we have to quit there
    let output = ` ${num} `;
    if (this.cols - output.length <= 7) return output
    output = " " + this.style.lM + output;
    if (this.cols - output.length <= 7) return output
    // see if it would be possible to add a right text, if it wouldnt be then don't
    output += (this.cols - (output.length + this.style.rM.length + 3) > 7)
      ? this.bar(this.cols - (output.length + this.style.rM.length + 1), current) + " " + this.style.rM
      : this.bar(this.cols - output.length, current);
    return output + (this.reset ? "\x1B[F" : "");
  }

  /**
   * Render the loading bar
   * @param space Free space to fill (filled entirely)
   * @param style Style settings provided
   */
  bar(space: number, current: number): string {
    // decimal proportion * characters rounded down implicitly by repeat
    const fillSpace = this.style.fC.repeat((space - 2)*(current / this.max));
    return this.style.lC + fillSpace + this.style.eC.repeat((space - 2) - fillSpace.length) + this.style.rC;
  }
}

/**
 * Represents the style for a loading bar, customisable with its properties, has reasonable ASCII defaults but I recommend
 * looking at the example styles in the README for other ideas
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

 ## Default:
> ```text
> | 50 wide                                           |
> |  Loading 30% [###########                       ] |
> ```
 */
export class BarStyle {
  // constructor looks ugly, is ugly
  // holds all the data for the bar's look in one place
  // and gives rudimentary data checks
  lM:string;rM:string;
  fC:string;eC:string;
  lC:string;rC:string;
  n:NumberStyle;
  constructor(
      lM?:string, rM?:string,
      fC?:string, eC?:string,
      lC?:string, rC?:string,
      n?:NumberStyle
  ) {
      this.lM = lM || "Loading";
      this.rM = rM || "";
      this.fC = fC || "#";
      this.eC = eC || " ";
      this.lC = lC || "[";
      this.rC = rC || "]";
      this.n = n || NumberStyle.percent;

      if (
        this.fC.length != 1
        || this.eC.length != 1
        || this.lC.length != 1
        || this.rC.length != 1
      ) throw "values ending in C must be 1 character long";
  }
}

/**
 * ## NumberStyle
 * Examples with current value 67, max 100
 * 
| Member  | Result   | Length |
|---------|----------|--------|
| single  | `67`     | 2      |
| percent | `67%`    | 3      |
| divide  | `67/100` | 6      |
 */
export enum NumberStyle {
  percent, // % truncated to a whole number
  single, // Just the current completed number
  divide // Current/Maximum
}