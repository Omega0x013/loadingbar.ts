# `loadingbar.ts`

Dynamic, dependency-free loading bars for Deno. Runs on `--unstable` and exports 3 items: `cl LoadingBar`, `cl BarStyle` and `en NumberStyle`. Distributed under the permissive `DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE` by Sam Hocevar.

```ts
// Example as found in LoadingBar's JSDoc
const bar = new LoadingBar(new BarStyle("Hello", "World!"), 10);
for (let i = 0; i < 10; i++) {
  console.log(bar.display(i));
  await (() => new Promise((r) => setTimeout(r, 100)))();
}
console.log(bar.display(10));
```

## Example Styles
| Style Name | Gutter Characters | Fill | Empty |
|------------|-------------------|------|-------|
| Default    | `[`, `]`          | `#`  | ` `   |
| Slim       | `<`, `>`          | `=`  | ` `   |
| Original   | `[`, `]`          | `#`  | `.`   |
| Lines      | `\|`, `\|`        | `=`  | `-`   |
| Modern     | `:`               | `█`  | ` `   |