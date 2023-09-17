class KeyboardEventStub {
  readonly target: HTMLInputElement;
  constructor(readonly value: string) {
    this.target = document.createElement('input');
    this.target.value = value;
  }
}
export function CreateKeyboardEvent(value: string): KeyboardEvent {
  return new KeyboardEventStub(value) as any;
}
