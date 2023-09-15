import { ComponentFixture } from "@angular/core/testing";

/**
 * Use as base class for component page classes, e.g.
 * ```ts
 * class HelloWorldPage extends ComponentPage<HelloWorldComponent> {
 *   messageElement() {
 *     return this.querySelector<HTMLElement>('div');
 *   }
 * }
 * ```
 */
export class ComponentPage<TComponent> {
  constructor(
    protected readonly fixture: ComponentFixture<TComponent>,
  ) {
  }

  querySelector<T extends Element>(selectors: string) {
    const nativeElement = this.fixture.debugElement.nativeElement as HTMLElement;
    return nativeElement.querySelector(selectors) as T;
  }

  querySelectorOnParentNode<T extends Element>(selectors: string) {
    const nativeParentElement = this.fixture.debugElement.nativeElement.parentNode as HTMLElement;
    return nativeParentElement.querySelector(selectors) as T;
  }

  querySelectorAll<T extends Element>(selectors: string) {
    const nativeElement = this.fixture.debugElement.nativeElement as HTMLElement;
    const nodeList = nativeElement.querySelectorAll<T>(selectors);
    return Array.from(nodeList);
  }
}

/**
 * Use as base class for component page classes that has rows and columns.
 * Classes extending this needs to implement a `rows` function (a column
 * function is already provided, and depends on the `rows` implementation).
 * ```ts
 * class TodoPage extends ComponentWithRowsAndColumnsPage<TodoComponent, HTMLTableRowElement> {
 *   rows() {
 *     return this.querySelectorAll<HTMLTableRowElement>('todo-item');
 *   }
 *   // column function defined in ComponentWithRowsAndColumnsPage
 *   ...
 * }
 * ```
 * See {@link ComponentPage} for more details.
 */

export abstract class ComponentWithRowsAndColumnsPage<TComponent, TRow extends HTMLElement> extends ComponentPage<TComponent> {
  public abstract rows(): TRow[];

  column(columnIndex: number, rowNumber: number) {
    const row = this.rows()[rowNumber];
    const children = row.children as HTMLCollectionOf<TRow>;
    const child = children[columnIndex];
    return child;
  }
}
