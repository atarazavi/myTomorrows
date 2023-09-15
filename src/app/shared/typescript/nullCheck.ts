/**
 * Unfortunately typescript does not infer that null disappears from a type
 * when using filter like the following:
 * ```typescript
 * const obs$ = new Subject<string | null>();
 * obs$
 *   .pipe(
 *     filter(s => s !== null)
 *   )
 *   .subscribe(s => {
 *     console.log(s.length); // Compile error: 's' is possibly 'null'.ts(18047)
 *   });
 * ```
 * Upstream issue: https://github.com/microsoft/TypeScript/issues/16069
 *
 * To compensate for this, defining a custom [type predicate](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates)
 * which the typescript compiler is able to pick up proper information from.
 * Usage
 * ```typescript
 * obs$
 *   .pipe(
 *     filter(isNotNull)
 *   )
 *   .subscribe(s => {
 *     console.log(s.length); // No error
 *   });
 * ```
 */
export function isNotNull<T>(arg: T | null): arg is T {
    return arg !== null;
}