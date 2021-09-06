# `loadingbar.ts`

Dynamic, dependency-free loading bars using Deno's --unstable API. Exports 3 items: `cl LoadingBar`, `cl BarStyle` and `en NumberStyle`. Distributed under Sam Hocevar's permissive `DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE`.

### Basic Example
```ts
// Example as found in LoadingBar's JSDoc
const bar = new LoadingBar(new BarStyle("Hello", "World!"), 10);
for (let i = 0; i < 10; i++) {
  console.log(bar.display(i));
  await (() => new Promise((r) => setTimeout(r, 100)))();
}
console.log(bar.display(10));
```
### Indexed Example
```ts
import LoadingBar, {BarStyle} from "https://x.nest.land/loadingbar.ts@1.0.0/mod.ts"

// A practical example
let bar = new LoadingBar(new BarStyle("Counting"), 10);
let tasks = [8, 5, 9, 2, 1, 6, 4, 0, 7, 3];
for (const i in tasks) {
  console.log(bar.display(+i));
  tasks[i] = tasks[i]*5
}
console.log(bar.display(10))
console.log(tasks)
```

With the default settings your bar will size itself to the screen with every task completed.

## `LoadingBar` Usage
### `LoadingBar` and `BarStyle`
```ts
// All of these arguments are optional so only set what you need
const bar = new LoadingBar(
  new BarStyle(
    leftMessage, // string ...
    rightMessage,
    fillChar, // string of length 1 ...
    endChar,
    leftCap,
    rightCap,
    number // NumberStyle
  ),
  max, // Total number of tasks to be completed
  reset, // Don't use ESC[F to overwrite the previous bar
  cols // Width of the screen - don't set or set to -1 for a dynamically sized bar
)
```

### `NumberStyle`
Examples with current value 67, max 100

| Member  | Result   | Length |
|---------|----------|--------|
| single  | `67`     | 2      |
| percent | `67%`    | 3      |
| divide  | `67/100` | 6      |

```ts
// Actual source for NumberStyle
export enum NumberStyle {
  percent, // % truncated to a whole number
  single, // Just the current completed number
  divide // Current/Maximum
}
```

## Example Styles
| Style Name | Gutter Characters | Fill | Empty |
|------------|-------------------|------|-------|
| Default    | `[`, `]`          | `#`  | ` `   |
| Slim       | `<`, `>`          | `=`  | ` `   |
| Original   | `[`, `]`          | `#`  | `.`   |
| Lines      | `\|`, `\|`        | `=`  | `-`   |
| Modern     | `▐`, `▌`          | `█`  | ` `   |

The `|` characters in the Lines style may be double escaped on some renderers

```ts
// Modern style
new BarStyle("Left", "Right", "█", " ", "▐", "▌")
```
